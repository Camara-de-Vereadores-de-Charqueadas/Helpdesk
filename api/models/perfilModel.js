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
