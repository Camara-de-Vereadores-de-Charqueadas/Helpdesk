import db from "../config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper para parse seguro de imagens (padrão: null ou array)
const parseImagens = (val) => {
  if (!val) return null;
  try {
    if (Array.isArray(val)) return val;
    const parsed = typeof val === "string" ? JSON.parse(val) : val;
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

/**
 * Lista todos os chamados, com nome e imagem do setor e nome do perfil.
 * Retorna imagens como array ou null.
 */
export const getAllChamados = async () => {
  const rows = db
    .prepare(
      `
    SELECT 
      c.*,
      s.nome AS setorNome,
      s.imagem_perfil AS setorImg,
      p.nome AS perfilNome
    FROM chamados c
    INNER JOIN setores s ON c.setorId = s.id
    INNER JOIN perfis p ON c.perfilId = p.id
    ORDER BY c.dataHora DESC
  `
    )
    .all();

  return rows.map((r) => ({ ...r, imagens: parseImagens(r.imagens) }));
};

/**
 * Lista chamados de um setor específico.
 */
export const getChamadosBySetor = async (setorId) => {
  const rows = db
    .prepare(
      `
    SELECT 
      c.*,
      s.nome AS setorNome,
      s.imagem_perfil AS setorImg,
      p.nome AS perfilNome
    FROM chamados c
    INNER JOIN setores s ON c.setorId = s.id
    INNER INNER JOIN perfis p ON c.perfilId = p.id
    WHERE c.setorId = ?
    ORDER BY c.dataHora DESC
  `
    )
    .all(setorId);

  return rows.map((r) => ({ ...r, imagens: parseImagens(r.imagens) }));
};

/**
 * Lista chamados de um perfil específico.
 */
export const getChamadosByPerfil = async (perfilId) => {
  const rows = db
    .prepare(
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
  `
    )
    .all(perfilId);

  return rows.map((r) => ({ ...r, imagens: parseImagens(r.imagens) }));
};

/**
 * Cria um novo chamado sem imagens (imagens = NULL).
 * Retorna insertId.
 */
/**
 * Cria um novo chamado com status inicial "NÃO VISUALIZADO"
 * Retorna insertId.
 */
export const createChamado = async ({
  titulo,
  descricaoProblema,
  setorId,
  perfilId,
  status = "NÃO VISUALIZADO",
  visualizadoTI = 0,
  fechado = 0,
}) => {
  const stmt = db.prepare(`
    INSERT INTO chamados 
    (titulo, descricaoProblema, setorId, perfilId, status, visualizadoTI, fechado, imagens)
    VALUES (?, ?, ?, ?, ?, ?, ?, NULL)
  `);

  const result = stmt.run(
    titulo,
    descricaoProblema,
    setorId,
    perfilId,
    status,
    visualizadoTI,
    fechado
  );

  return result.lastInsertRowid;
};
/**
 * Atualiza campo de imagens (recebe array).
 */
export const updateChamadoImages = async (id, imagensArray) => {
  const json = imagensArray?.length ? JSON.stringify(imagensArray) : null;

  db.prepare(
    `
    UPDATE chamados SET imagens = ? WHERE id = ?
  `
  ).run(json, id);
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
 * Recebe status possivelmente undefined (se undefined, não sobrescreve).
 */
// Model - updateChamadoTI.js
export const updateChamadoTI = async (id, campos) => {
  let { descricaoTI, status, visualizadoTI, fechado, dataFechamento } = campos;

  // 🔥 NORMALIZAÇÃO CRÍTICA
  if (visualizadoTI !== undefined) visualizadoTI = Number(visualizadoTI);
  if (fechado !== undefined) fechado = Number(fechado);

  const atual = db
    .prepare(
      `SELECT status, visualizadoTI, fechado, dataFechamento FROM chamados WHERE id = ?`
    )
    .get(id);

  if (!atual) return false;

  const descTI = descricaoTI ?? null;

  // --------------------------------------------
  // CASO JÁ FECHADO
  // --------------------------------------------
  if (atual.fechado === 1) {
    const result = db
      .prepare(
        `
        UPDATE chamados 
        SET descricaoTI = COALESCE(?, descricaoTI)
        WHERE id = ?
      `
      )
      .run(descTI, id);

    return result.changes > 0;
  }

  // --------------------------------------------
  // CHAMADO ABERTO
  // --------------------------------------------
  let novoStatus = atual.status;
  let novoVisualizado =
    visualizadoTI !== undefined ? visualizadoTI : atual.visualizadoTI;
  let novoFechado = fechado !== undefined ? fechado : atual.fechado;
  let novaDataFechamento = atual.dataFechamento;

  // ✅ AGORA FUNCIONA
  if (novoVisualizado === 1 && atual.visualizadoTI === 0) {
    novoStatus = "EM ANDAMENTO";
  }

  if (status === "RESOLVIDO" || status === "NAO RESOLVIDO") {
    novoStatus = status;
    novoFechado = 1;
    novoVisualizado = 1;
    novaDataFechamento = dataFechamento || new Date().toISOString();
  }

  const result = db
    .prepare(
      `
      UPDATE chamados
      SET descricaoTI = COALESCE(?, descricaoTI),
          status = ?,
          visualizadoTI = ?,
          fechado = ?,
          dataFechamento = COALESCE(?, dataFechamento)
      WHERE id = ?
    `
    )
    .run(
      descTI,
      novoStatus,
      novoVisualizado,
      novoFechado,
      novaDataFechamento ?? null,
      id
    );

  return result.changes > 0;
};

// -------------------------------------------------------
// PEGAR CHAMADOS (alternativa que já parseia imagens)
// -------------------------------------------------------
export const getChamados = async () => {
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
    ORDER BY c.dataHora DESC
  `
  );

  return rows.map((r) => ({ ...r, imagens: parseImagens(r.imagens) }));
};

// Buscar imagens + deletar arquivos + remover registro
export const deleteChamado = async (id) => {
  try {
    // 1) Buscar o chamado
    const row = db.prepare("SELECT imagens FROM chamados WHERE id = ?").get(id);

    if (!row) {
      return { changes: 0 }; // não encontrado
    }

    const imagens = parseImagens(row.imagens) || [];

    // 2) Deletar arquivos
    const uploadDir = path.join(process.cwd(), "uploads");

    for (const imgPath of imagens) {
      const fileName = imgPath.split("/").pop();
      const fullPath = path.join(uploadDir, fileName);

      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (err) {
          console.warn("Falha ao apagar arquivo:", fullPath, err.message);
        }
      }
    }

    // 3) Deletar do banco
    const result = db.prepare("DELETE FROM chamados WHERE id = ?").run(id);

    return result; // contém { changes: X }
  } catch (err) {
    console.error("Erro no deleteChamado:", err);
    throw err;
  }
};
