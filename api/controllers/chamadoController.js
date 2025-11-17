import {
  getAllChamados,
  getChamadosBySetor,
  getChamadosByPerfil,
  createChamado,
  createChamadosEmLote,
  updateChamadoTI,
} from "../models/chamadoModel.js";

// Lista todos os chamados
export const listarChamados = async (req, res) => {
  try {
    const chamados = await getAllChamados();
    res.json(chamados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar chamados." });
  }
};

// Lista chamados por setor
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

// Lista chamados por perfil
export const listarChamadosPorPerfil = async (req, res) => {
  try {
    const { perfilId } = req.params;
    const chamados = await getChamadosByPerfil(perfilId);
    res.json(chamados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar chamados do perfil." });
  }
};

// Cria novo chamado ou vários (em lote)
export const criarChamado = async (req, res) => {
  try {
    const { titulo, descricaoProblema, setorId, perfilId } = req.body;
    const imagens =
      req.files?.map((file) => `/uploads/chamados/${file.filename}`) || [];

    if (!titulo || !descricaoProblema || !setorId || !perfilId) {
      return res.status(400).json({
        error: "Campos obrigatórios: título, descrição, setorId e perfilId.",
      });
    }

    const novo = await createChamado({
      titulo,
      descricaoProblema,
      setorId,
      perfilId,
      imagens: JSON.stringify(imagens), // salva como array JSON no BD
    });

    res.status(201).json({ id: novo.id, titulo, setorId, perfilId, imagens });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar chamado." });
  }
};

// Atualiza informações de TI no chamado
export const atualizarChamadoTI = async (req, res) => {
  try {
    const { id } = req.params;
    const { descricaoTI, status, visualizadoTI, fechado } = req.body;

    // 🔹 Converte strings para boolean
    const visualizadoBool =
      visualizadoTI === true || visualizadoTI === "true" ? 1 : 0;

    const fechadoBool = fechado === true || fechado === "true" ? 1 : 0;

    // 🔹 Mantém o status se vier do front
    const statusFinal = status || "NAO RESOLVIDO";

    await updateChamadoTI(id, {
      descricaoTI,
      status: statusFinal,
      visualizadoTI: visualizadoBool,
      fechado: fechadoBool,
    });
    res.json({ message: "Chamado atualizado com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar chamado." });
  }
};
