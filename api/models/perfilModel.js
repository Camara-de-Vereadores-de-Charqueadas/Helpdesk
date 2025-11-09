import pool from "../config/db.js";

export async function getAllPerfis() {
    const [rows] = await pool.query(
        "SELECT p.*, s.nome AS setor_nome FROM perfis p JOIN setores s ON p.setorId = s.id"
    );
    return rows;
}

export async function createPerfil({ nome, setorId }) {
    const [result] = await pool.query(
        "INSERT INTO perfis (nome, setorId) VALUES (?, ?)",
        [nome, setorId]
    );
    return { id: result.insertId };
}

export async function getPerfisBySetor(setorId) {
    const [rows] = await pool.query(
        "SELECT * FROM perfis WHERE setorId = ?",
        [setorId]
    );
    return rows;
}
