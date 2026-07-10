import db from "../config/db.js";

// Lista perfis com o nome do setor
export function getAllPerfis() {
  return db
    .prepare(
      `
        SELECT p.*, s.nome AS setor_nome
        FROM perfis p
        JOIN setores s ON p.setorId = s.id
    `,
    )
    .all();
}

export function getById(paramId) {
const id = parseInt(paramId)
if(isNaN(id) || id <= 0) throw new Error("Invalid ID");

  const profile = db.prepare(
  `
    SELECT p.*, s.nome AS setor_nome
    FROM perfis p
    JOIN setores s ON p.setorId = s.id
    WHERE p.id = ?
  `)
  .get(id);
  if(!profile) throw new Error("No profiles found.");

  return profile;
}

// Cria perfil
export function createPerfil({ nome, setorId }) {
  const result = db
    .prepare(
      `
        INSERT INTO perfis (nome, setorId)
        VALUES (?, ?)
    `,
    )
    .run(nome, setorId);

  return { id: result.lastInsertRowid };
}

// Busca perfis por setor
export function getPerfisBySetor(setorId) {
  return db
    .prepare(
      `
        SELECT id, nome, setorId FROM perfis WHERE setorId = ? ORDER BY nome
    `,
    )
    .all(setorId);
}

export function update(idParam, fields) {
  const id = parseInt(idParam);
  if(isNaN(id) || id < 0) throw new Error("Invalid ID");

  const columns = [];
  const params = [];

  let { nome } = fields;
  if (nome !== undefined || nome == null, nome == '') throw new Error("Invalid name");

  const sql = `
  UPDATE perfis
  SET nome = ?
  WHERE id = ?
  `;

  const update = db.prepare(sql).run(nome, id);
  return update.changes > 0;
}

export function remove(idParam) {
  const id = parseInt(idParam);
  if(isNaN(id) || id < 0) throw new Error("Invalid ID");

  const result = db.prepare(`
  DELETE FROM perfis
  WHERE id = ?
  `).run(id);

  return result.changes > 0;
}