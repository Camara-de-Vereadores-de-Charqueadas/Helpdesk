import db from "../config/db.js";

// Get setor por id
export function getSetor(idParam) {
  const id = parseInt(idParam);
  if (isNaN(id) || id <= 0) {
    throw new Error('Invalid ID');
  }

  const sql = `
    SELECT * FROM setores
    WHERE id = ?
  `
  const setor = db.prepare(sql).get(id);
  if (!setor) throw new Error("No setor found.");
  return setor;
}

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

export function update(idParam, campos) {
  const id = parseInt(idParam);
  if (isNaN(id) || id <= 0) {
    throw new Error('Invalid ID');
  }
  console.log("parsed id!")

  const columns = [];
  const params = [];

  let {
    nome,
    criadoPor,
    codigoEntrada,
    imagemPerfil
  } = campos

  const sanitizedMap = {
    nome: { column: "nome", convert: v => v },
    criadoPor: { column: "criado_por", convert: v => v },
    codigoEntrada: { column: "codigo_entrada", convert: v => v },
    imagemPerfil: { column: "imagemPerfil", convert: (v) => {
      // This regex is used to verify if files start with "/img/" and if they end with a file extension ".jpg, .jpeg, .png", so we guarantee valid data.
      const regex = /^\/img\/[^/]+\.[a-zA-Z0-9]+$/;
      if (!regex.test(v)) {
        throw new Error("Image has invalid input formatting")
      }
      return v;
    }},
  };
  console.log("passed regex!")

  for (const [key, { column, convert }] of Object.entries(sanitizedMap)) {
    const value = campos[key];
    if (value !== undefined && value !== null && value !== '') {
      columns.push(`${column} = ?`);
      params.push(convert(value));
    };
  };

  console.log("passed object manipulation!")

  if (columns.length === 0) {
    throw new Error("Sem colunas para atualizar");
  }

  const setClause = `SET ${columns.join(' , ')}`;
  params.push(id);

  const sql = `
    UPDATE setores
    ${setClause}
    WHERE id = ?
  `;

  console.log("sending to bd!")
  const update = db.prepare(sql).run(...params);
  return update.changes > 0;
}

export function remove(idParam) {
  const id = parseInt(idParam);
  if (isNaN(id) || id <= 0) {
    throw new Error('Invalid ID');
  }

  const sql = db.prepare(`
    DELETE FROM setores
    WHERE id = ?;
    `)
  const result = sql.run(id);
  return result.changes > 0;
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
