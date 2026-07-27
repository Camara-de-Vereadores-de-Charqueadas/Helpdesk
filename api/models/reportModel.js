import db from "../config/db.js";

// search is a string search for descricaoTI field
// everything is optional but period.
export const fullReport = async(departments = [], agents = [], search = '', startDate = null, endDate = null) => {

    if (startDate !== null && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(startDate)) {
        throw new Error("Invalid startDate format. Use ISO timestamp: YYYY-MM-DDTHH:MM:SS");
    }
    if (endDate !== null && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(endDate)) {
        throw new Error("Invalid endDate format. Use ISO timestamp: YYYY-MM-DDTHH:MM:SS");
    }
    if (startDate !== null && endDate !== null && startDate > endDate) {
        throw new Error("startDate must be <= endDate");
    }

    const setoresId = sanitizeIDArray(departments);
    const agentesId = sanitizeIDArray(agents);
    const searchTerms = sanitizeSearch(search);

    const EXCLUDED_DEPARTMENT_IDS = [1, 4];
    const EXCLUDED_PROFILE_IDS = [6, 54];

    let dateFilter = '';
    let fechamentoFilter = '';
    let params = [];

    if (startDate !== null || endDate !== null) {
        const conditions = [];
        if (startDate !== null) {
            conditions.push("REPLACE(c.dataHora, 'T', ' ') >= ?");
            params.push(startDate.replace('T', ' '));
        }
        if (endDate !== null) {
            conditions.push("REPLACE(c.dataHora, 'T', ' ') <= ?");
            params.push(endDate.replace('T', ' '));
        }
        dateFilter = `AND (${conditions.join(' AND ')})`;
    };

    if (startDate !== null || endDate !== null) {
        const conditions = [];
        if (startDate !== null) {
            conditions.push("REPLACE(c.dataFechamento, 'T', ' ') >= ?");
        }
        if (endDate !== null) {
            conditions.push("REPLACE(c.dataFechamento, 'T', ' ') <= ?");
        }
        fechamentoFilter = `AND (${conditions.join(' AND ')})`;
    }

    let deptFilter = "";
    if (setoresId.length > 0) {
        deptFilter = `AND c.setorId IN (${setoresId.join(',')})`;
    };

    let searchFilter = '';
    if (searchTerms.length > 0) {
        const likeConditions = searchTerms.map(term => `c.descricaoTI LIKE '%${term}%'`).join(' OR ');
        searchFilter = ` AND (${likeConditions}) `;
    };

    const chamadosPorSetores = db.prepare(`
    SELECT 
      s.nome,
      COUNT(c.id) AS total
    FROM setores s
    LEFT JOIN chamados c ON s.id = c.setorId
	WHERE s.id NOT IN (${EXCLUDED_DEPARTMENT_IDS.join(',')})
		${dateFilter}
		${deptFilter}
		${searchFilter}
    GROUP BY s.id, s.nome
    ORDER BY total DESC
  `).all(...params);

    let agentFilter = "";
    if (agentesId.length > 0 && agentesId[0] !== undefined) {
        agentFilter = `AND p.id IN (${agentesId.join(',')})`;
    };

    const chamadosPorFuncionario = db.prepare(`
    SELECT
      p.nome,
      COUNT(c.id) AS resolvidos
    FROM perfis p
    LEFT JOIN chamados c
      ON p.id = c.finalizadoPorPerfilId
      AND c.fechado = 1
      ${fechamentoFilter}
	  ${deptFilter}
	  ${searchFilter}
    WHERE p.setorId = 1 
		AND p.id NOT IN (${EXCLUDED_PROFILE_IDS.join(",")})
		${agentFilter}
    GROUP BY p.id, p.nome
    ORDER BY resolvidos DESC
  `).all(...params);

    const summary = db.prepare(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN c.fechado = 0 THEN 1 ELSE 0 END) AS abertos,
      SUM(CASE WHEN c.fechado = 1 AND (${agentesId.length > 0 ? `c.finalizadoPorPerfilId IN (${agentesId.join(',')})` : '1'}) THEN 1 ELSE 0 END) AS fechados
    FROM chamados c
    LEFT JOIN setores s ON c.setorId = s.id
    WHERE 1=1
	  ${dateFilter}
	  ${deptFilter}
	  ${searchFilter}
  `).get(...params);

    const tickets = db.prepare(`
	SELECT
        c.id as id,
        c.titulo as titulo,
        c.descricaoProblema as descricaoProblema,
        c.descricaoTI,
        c.status,
        c.fechado,
        c.dataHora,
        c.dataFechamento,
        c.setorId as setorId,
        c.perfilId as perfilId,
        c.finalizadoPorPerfilId as finalizadoPorPerfilId,
        s.nome AS setorNome,
        p.nome AS perfilNome,
        pf.nome AS finalizadoPorNome
    FROM chamados c
    LEFT JOIN setores s ON c.setorId = s.id
    LEFT JOIN perfis p ON c.perfilId = p.id
    LEFT JOIN perfis pf ON c.finalizadoPorPerfilId = pf.id
    WHERE 1=1
        ${dateFilter}
        ${deptFilter}
        ${searchFilter}
    ORDER BY c.dataHora DESC
  `).all(...params)

    return {
        summary: {
            total: summary.total || 0,
            abertos: summary.abertos || 0,
            fechados: summary.fechados || 0
        },
        departments: chamadosPorSetores,
        agents: chamadosPorFuncionario,
        tickets: tickets
    };
};

function sanitizeIDArray(input) {
    let raw = Array.isArray(input) ? input : (input ? [input] : []);
    const valid = [];
    raw.forEach((id) => {
        const num = Number(id);
        if (Number.isInteger(num)) valid.push(num);
    });
    return [...new Set(valid)];
};

function sanitizeSearch(input) {
    const maxLength = 100;
    const blacklist = ['<', '>', '{', '}', '[', ']', '|', '\\', '^', '~', '`', ';', "'", '"', '$'];
    let str = String(input || '').trim().slice(0, maxLength);

    const blacklistRegex = new RegExp(`[${blacklist.join('')}]`, 'g');
    const cleaned = str.replace(blacklistRegex, '');
    const keywords = cleaned.split(/\s+/).filter(kw => kw.length > 0);
    const seen = new Set();

    return keywords.filter(kw => {
        const lower = kw.toLowerCase();
        if (seen.has(lower)) return false;
        seen.add(lower);
        return true;
    });
};;
