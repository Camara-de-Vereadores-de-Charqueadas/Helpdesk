import { getAllChamados, getChamadosBySetor, createChamado, createChamadosEmLote, updateChamadoTI } from "../models/chamadoModel.js";

export const listarChamados = async (req, res) => {
    try {
        const chamados = await getAllChamados();
        res.json(chamados);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao listar chamados." });
    }
};

export const listarChamadosPorSetor = async (req, res) => {
    try {
        const { setorId } = req.params;
        const chamados = await getChamadosBySetor(setorId);
        res.json(chamados);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao listar chamados do setor." });
    }
};

export const criarChamado = async (req, res) => {
    try {
        const body = req.body;

        // caso seja um array, é um envio em lote
        if (Array.isArray(body)) {
            const resultados = await createChamadosEmLote(body);
            return res.status(201).json({ message: "Chamados criados com sucesso.", resultados });
        }

        const { titulo, descricaoProblema, setorId, perfilId, imagens = [] } = body;

        if (!titulo || !descricaoProblema || !setorId || !perfilId) {
            return res.status(400).json({ error: "Campos obrigatórios: título, descrição, setorId e perfilId." });
        }

        const novo = await createChamado({ titulo, descricaoProblema, setorId, perfilId, imagens });
        res.status(201).json({ id: novo.id, titulo, setorId, perfilId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao criar chamado." });
    }
};

export const atualizarChamadoTI = async (req, res) => {
    try {
        const { id } = req.params;
        const { descricaoTI, status, visualizadoTI, fechado } = req.body;

        await updateChamadoTI(id, { descricaoTI, status, visualizadoTI, fechado });
        res.json({ message: "Chamado atualizado com sucesso." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao atualizar chamado." });
    }
};
