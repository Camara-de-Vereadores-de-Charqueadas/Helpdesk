import db from "../config/db.js";

export const getAllChamados = async () => {
    const [rows] = await db.query(`
        SELECT c.*, s.nome AS setorNome, s.imagem_perfil AS setorImg, p.nome AS perfilNome
        FROM chamados c
        JOIN setores s ON c.setorId = s.id
        JOIN perfis p ON c.perfilId = p.id
        ORDER BY c.dataHora DESC
    `);
    return rows;
};

export const getChamadosBySetor = async (setorId) => {
    const [rows] = await db.query(`
        SELECT c.*, s.nome AS setorNome, s.imagem_perfil AS setorImg, p.nome AS perfilNome
        FROM chamados c
        JOIN setores s ON c.setorId = s.id
        JOIN perfis p ON c.perfilId = p.id
        WHERE c.setorId = ?
        ORDER BY c.dataHora DESC
    `, [setorId]);
    return rows;
};

export const createChamado = async (chamado) => {
    const {
        titulo,
        descricaoProblema,
        setorId,
        perfilId,
        imagens = []
    } = chamado;

    const dataHora = new Date();
    const status = "NAO RESOLVIDO";
    const visualizadoTI = false;
    const fechado = false;

    const [result] = await db.query(`
        INSERT INTO chamados (titulo, descricaoProblema, setorId, perfilId, dataHora, status, visualizadoTI, fechado, imagens)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        titulo,
        descricaoProblema,
        setorId,
        perfilId,
        dataHora,
        status,
        visualizadoTI,
        fechado,
        JSON.stringify(imagens.slice(0, 2))
    ]);

    return { id: result.insertId };
};

// criação em lote
export const createChamadosEmLote = async (lista) => {
    const resultados = [];

    for (const item of lista) {
        if (!item.titulo || !item.descricaoProblema || !item.setorId || !item.perfilId) continue;
        const novo = await createChamado(item);
        resultados.push(novo);
    }

    return resultados;
};

export const updateChamadoTI = async (id, campos) => {
    const { descricaoTI, status, visualizadoTI, fechado } = campos;

    await db.query(`
        UPDATE chamados 
        SET descricaoTI = ?, status = ?, visualizadoTI = ?, fechado = ?
        WHERE id = ?
    `, [descricaoTI, status, visualizadoTI, fechado, id]);
};
