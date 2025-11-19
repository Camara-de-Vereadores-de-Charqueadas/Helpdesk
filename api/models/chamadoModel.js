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
    // Se já for array, retorna
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

  return rows.map((r) => ({ ...r, imagens: parseImagens(r.imagens) }));
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
  status = "NÃO VISUALIZADO", // Valor padrão
  visualizadoTI = 0, // Valor padrão
  fechado = 0, // Valor padrão
}) => {
  const [result] = await db.query(
    `INSERT INTO chamados 
     (titulo, descricaoProblema, setorId, perfilId, status, visualizadoTI, fechado, imagens)
     VALUES (?, ?, ?, ?, ?, ?, ?, NULL)`,
    [
      titulo,
      descricaoProblema,
      setorId,
      perfilId,
      status,
      visualizadoTI,
      fechado,
    ]
  );

  return result.insertId;
};
/**
 * Atualiza campo de imagens (recebe array).
 */
export const updateChamadoImages = async (id, imagensArray) => {
  const json =
    imagensArray && imagensArray.length > 0
      ? JSON.stringify(imagensArray)
      : null;
  await db.query("UPDATE chamados SET imagens = ? WHERE id = ?", [json, id]);
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
  const { descricaoTI, status, visualizadoTI, fechado } = campos;

  // Busca o chamado atual
  const [rows] = await db.query(
    "SELECT status, visualizadoTI, fechado FROM chamados WHERE id = ?",
    [id]
  );

  if (rows.length === 0) return false;

  const atual = rows[0];

  // SE O CHAMADO JÁ ESTIVER FECHADO, NÃO ALTERA STATUS NEM VISUALIZADO
  if (atual.fechado === 1) {
    const [result] = await db.query(
      `UPDATE chamados 
       SET descricaoTI = COALESCE(?, descricaoTI)
       WHERE id = ?`,
      [descricaoTI, id]
    );
    return result.affectedRows > 0;
  }

  // Lógica para marcar como visualizado
  let novoStatus = atual.status;
  let novoVisualizado =
    visualizadoTI !== undefined ? visualizadoTI : atual.visualizadoTI;

  // Se está marcando como visualizado E ainda não foi visualizado
  if (visualizadoTI === 1 && atual.visualizadoTI === 0) {
    novoStatus = "EM ANDAMENTO";
  }

  // Se está fechando o chamado
  if (fechado === 1) {
    novoStatus = status || atual.status;
  }

  // Executa atualização
  const [result] = await db.query(
    `UPDATE chamados 
     SET descricaoTI = COALESCE(?, descricaoTI),
         status = ?,
         visualizadoTI = ?,
         fechado = COALESCE(?, fechado)
     WHERE id = ?`,
    [descricaoTI, novoStatus, novoVisualizado, fechado, id]
  );

  return result.affectedRows > 0;
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

// -------------------------------------------------------
// DELETAR CHAMADO + APAGAR IMAGENS DO DISCO
// -------------------------------------------------------
export const deleteChamado = async (id) => {
  // primeiro busca imagens
  const [rows] = await db.query("SELECT imagens FROM chamados WHERE id = ?", [
    id,
  ]);

  if (rows.length === 0) return { affectedRows: 0 };

  const imagens = parseImagens(rows[0].imagens) || [];

  // se tiver imagens, deletar arquivos físicos
  const uploadDir = path.join(process.cwd(), "uploads");

  for (const imgPath of imagens) {
    const fileName = imgPath.split("/").pop();
    const fullPath = path.join(uploadDir, fileName);

    try {
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (err) {
      // não interrompe o processo caso nao consiga deletar um arquivo
      console.warn("Falha ao apagar arquivo:", fullPath, err.message);
    }
  }

  // depois apaga o registro do chamado
  const [result] = await db.query("DELETE FROM chamados WHERE id = ?", [id]);

  return result;
};
