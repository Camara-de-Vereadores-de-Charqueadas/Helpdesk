import { getAllSetores, createSetor } from "../models/setorModel.js";

export const listarSetores = async (req, res) => {
    try {
        const setores = await getAllSetores();
        res.json(setores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao listar setores." });
    }
};

export const criarSetor = async (req, res) => {
    try {
        const dados = req.body;

        // Caso o corpo seja um array de setores
        if (Array.isArray(dados)) {
            const setoresCriados = [];

            for (const setor of dados) {
                const { nome, codigoEntrada, criadoPor = null, imagemPerfil = null } = setor;
                if (!nome || !codigoEntrada) continue;

                const novo = await createSetor({ nome, criadoPor, codigoEntrada, imagemPerfil });
                setoresCriados.push({ id: novo.id, nome, codigoEntrada });
            }

            if (setoresCriados.length === 0) {
                return res.status(400).json({ error: "Nenhum setor válido enviado." });
            }

            return res.status(201).json(setoresCriados);
        }

        // Caso seja um único setor
        const { nome, codigoEntrada, criadoPor = null, imagemPerfil = null } = dados;

        if (!nome || !codigoEntrada) {
            return res.status(400).json({ error: "Nome e código de entrada são obrigatórios." });
        }

        const novo = await createSetor({ nome, criadoPor, codigoEntrada, imagemPerfil });
        res.status(201).json({ id: novo.id, nome, codigoEntrada });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao criar setor." });
    }
};
