import { getAllPerfis, createPerfil, getPerfisBySetor } from "../models/perfilModel.js";

export const listarPerfis = async (req, res) => {
    try {
        const perfis = await getAllPerfis();
        res.json(perfis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao listar perfis." });
    }
};

export const listarPerfisPorSetor = async (req, res) => {
    try {
        const { setorId } = req.params;
        const perfis = await getPerfisBySetor(setorId);
        res.json(perfis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar perfis do setor." });
    }
};

export const criarPerfil = async (req, res) => {
    try {
        const dados = req.body;

        // Caso o body seja um único objeto
        if (!Array.isArray(dados)) {
            const { nome, setorId } = dados;
            if (!nome || !setorId) {
                return res.status(400).json({ error: "Nome e setorId são obrigatórios." });
            }
            const novo = await createPerfil({ nome, setorId });
            return res.status(201).json({ id: novo.id, nome, setorId });
        }

        // Caso o body seja um array de perfis
        const criados = [];
        for (const perfil of dados) {
            if (!perfil.nome || !perfil.setorId) {
                return res.status(400).json({ error: "Todos os perfis precisam ter nome e setorId." });
            }
            const novo = await createPerfil(perfil);
            criados.push({ id: novo.id, nome: perfil.nome, setorId: perfil.setorId });
        }

        res.status(201).json(criados);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao criar perfil." });
    }
};
