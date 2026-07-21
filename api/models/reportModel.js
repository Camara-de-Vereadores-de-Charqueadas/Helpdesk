import db from "../config/db.js";

export const fullReport = async (period) => {
  if (!["all", "7", "30"].includes(period)) {
    throw new Error("Invalid period. Use 'all', '7', or '30'.");
  }

  const EXCLUDED_SECTOR_IDS = [1, 4];
  const EXCLUDED_PROFILE_IDS = [6, 54];

  let dateCondition = "";
  let params = [];

  if (period !== "all") {
    const days = parseInt(period);
    dateCondition = "WHERE REPLACE(c.dataHora, 'T', ' ') >= datetime('now', ?)";
    params = [`-${days} days`];
  }

  const chamadosPorSetores = db.prepare(`
    SELECT 
      s.nome,
      COUNT(c.id) AS total
    FROM setores s
    LEFT JOIN chamados c ON s.id = c.setorId
    ${dateCondition}
    AND s.id NOT IN (${EXCLUDED_SECTOR_IDS.join(",")})
    GROUP BY s.id, s.nome
    ORDER BY total DESC
  `).all(...params);

  const chamadosPorFuncionario = db.prepare(`
    SELECT
      p.nome,
      COUNT(c.id) AS resolvidos
    FROM perfis p
    LEFT JOIN chamados c 
      ON p.id = c.finalizadoPorPerfilId
      AND c.fechado = 1
      ${period !== "all" ? "AND REPLACE(c.dataFechamento, 'T', ' ') >= datetime('now', ?)" : ""}
    WHERE p.setorId = 1 AND p.id NOT IN (${EXCLUDED_PROFILE_IDS.join(",")})
    GROUP BY p.id, p.nome
    ORDER BY resolvidos DESC
  `).all(...(period !== "all" ? params : []));

  const summary = db.prepare(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN c.fechado = 0 THEN 1 ELSE 0 END) AS abertos,
      SUM(CASE WHEN c.fechado = 1 THEN 1 ELSE 0 END) AS fechados
    FROM chamados c
    ${dateCondition}
  `).get(...params);

  return {
    summary: {
      total: summary.total || 0,
      abertos: summary.abertos || 0,
      fechados: summary.fechados || 0
    },
    departments: chamadosPorSetores,
    agents: chamadosPorFuncionario
  };
};
