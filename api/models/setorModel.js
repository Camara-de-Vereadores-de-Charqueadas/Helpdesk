import pool from "../config/db.js";

export async function getAllSetores() {
    const [rows] = await pool.query("SELECT * FROM setores");
    return rows;
}

export async function createSetor({ nome, criadoPor, codigoEntrada, imagemPerfil }) {
    const [result] = await pool.query(
        "INSERT INTO setores (nome, criado_em, criado_por, codigo_entrada, imagem_perfil) VALUES (?, NOW(), ?, ?, ?)",
        [nome, criadoPor, codigoEntrada, imagemPerfil]
    );
    return { id: result.insertId };
}

export async function findByCodigoEntrada(codigo) {
    const [rows] = await pool.query(
        "SELECT * FROM setores WHERE codigo_entrada = ?",
        [codigo]
    );
    return rows[0];
}

