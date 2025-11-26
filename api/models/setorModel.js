import db from "../config/db.js";

// Lista setores
export function getAllSetores() {
  return db.prepare("SELECT * FROM setores").all();
}

// Cria setor
export function createSetor({ nome, criadoPor, codigoEntrada, imagemPerfil }) {
  const stmt = db.prepare(`
        INSERT INTO setores (nome, criado_em, criado_por, codigo_entrada, imagem_perfil)
        VALUES (?, datetime('now'), ?, ?, ?)
    `);

  const result = stmt.run(nome, criadoPor, codigoEntrada, imagemPerfil);

  return { id: result.lastInsertRowid };
}

// Busca setor pelo código
export function findByCodigoEntrada(codigo) {
  return db
    .prepare(
      `
        SELECT * FROM setores WHERE codigo_entrada = ?
    `
    )
    .get(codigo);
}
