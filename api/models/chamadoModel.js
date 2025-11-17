import db from "../config/db.js";

/**
 * Lista todos os chamados, com nome e imagem do setor e nome do perfil.
 */
export const getAllChamados = async () => {
  const [rows] = await db.query(`
        SELECT 
            c.*, 
            s.nome AS setorNome, 
            s.imagem_perfil AS setorImg, 
            p.nome AS perfilNome
        FROM chamados c
        INNER JOIN setores s ON c.setorId = s.id
        INNER JOIN perfis p ON c.perfilId = p.id
        ORDER BY c.dataHora DESC
    `);
  return rows;
};

/**
 * Lista chamados de um setor específico.
 */
export const getChamadosBySetor = async (setorId) => {
  const [rows] = await db.query(
    `
        SELECT 
            c.*, 
            s.nome AS setorNome, 
            s.imagem_perfil AS setorImg, 
            p.nome AS perfilNome
        FROM chamados c
        INNER JOIN setores s ON c.setorId = s.id
        INNER JOIN perfis p ON c.perfilId = p.id
        WHERE c.setorId = ?
        ORDER BY c.dataHora DESC
    `,
    [setorId]
  );
  return rows;
};

/**
 * Lista chamados de um perfil específico.
 */
export const getChamadosByPerfil = async (perfilId) => {
  const [rows] = await db.query(
    `
        SELECT 
            c.*, 
            s.nome AS setorNome, 
            s.imagem_perfil AS setorImg, 
            p.nome AS perfilNome
        FROM chamados c
        INNER JOIN setores s ON c.setorId = s.id
        INNER JOIN perfis p ON c.perfilId = p.id
        WHERE c.perfilId = ?
        ORDER BY c.dataHora DESC
    `,
    [perfilId]
  );
  return rows;
};

/**
 * Cria um novo chamado.
 */
export const createChamado = async (chamado) => {
  const {
    titulo,
    descricaoProblema,
    setorId,
    perfilId,
    imagens = [],
  } = chamado;

  const dataHora = new Date();
  const status = "NAO VISUALIZADO";
  const visualizadoTI = false;
  const fechado = false;

  const imagensValidas = JSON.stringify(imagens.slice(0, 2)); // garante máx. 2 imagens

  const [result] = await db.query(
    `
        INSERT INTO chamados (
            titulo, descricaoProblema, setorId, perfilId, dataHora, 
            status, visualizadoTI, fechado, imagens
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      titulo,
      descricaoProblema,
      setorId,
      perfilId,
      dataHora,
      status,
      visualizadoTI,
      fechado,
      imagensValidas,
    ]
  );

  return { id: result.insertId };
};

/**
 * Cria vários chamados em lote.
 */
export const createChamadosEmLote = async (lista) => {
  const resultados = [];

  for (const item of lista) {
    if (
      !item.titulo ||
      !item.descricaoProblema ||
      !item.setorId ||
      !item.perfilId
    ) {
      console.warn("Chamado inválido ignorado:", item);
      continue;
    }
    const novo = await createChamado(item);
    resultados.push(novo);
  }

  return resultados;
};

/**
 * Atualiza informações técnicas (TI) de um chamado.
 */
export const updateChamadoTI = async (id, campos) => {
  const { descricaoTI = "", status, visualizadoTI, fechado } = campos;

  const [result] = await db.query(
    `
        UPDATE chamados 
        SET 
            descricaoTI = ?, 
            status = ?, 
            visualizadoTI = ?, 
            fechado = ?
        WHERE id = ?
    `,
    [descricaoTI, status, visualizadoTI, fechado, id]
  );

  return result.affectedRows > 0;
};
