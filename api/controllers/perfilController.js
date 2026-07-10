import {
  getAllPerfis,
  createPerfil,
  getPerfisBySetor,
  getById,
  remove,
  update,
} from "../models/perfilModel.js";

export const listarPerfis = async (req, res) => {
  try {
    const perfis = await getAllPerfis();
    res.json(perfis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar perfis." });
  }
};

export const listarPerfisPorSetor = (req, res) => {
  try {
    const { setorId } = req.params;
    const perfis = getPerfisBySetor(setorId);
    res.json(perfis);
  } catch (error) {
    console.error("Erro ao listar perfis por setor:", error);
    res.status(500).json({ error: "Erro ao listar perfis." });
  }
};

export const fetchPerfilPorId = (req, res) => {
  try {
    const {id} = req.params;
    const perfil = getById(id);
    res.json(perfil);
  } catch (error) {
    console.error("Erro ao obter perfil:", error);
    res.status(500).json({ error: "Erro ao obter perfil." });    
  }
};

export const updatePerfil = async (req, res) => {
  try {
    const {id} = req.params;
    const perfil = update(id, req.body);
    res.json(perfil);
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({ error: "Erro ao atualizar perfil." });    
  }
};

export const deletePerfil = async (req, res) => {
  try {
    const {id} = req.params;
    const query = remove(id);
    res.json(query);
  } catch (error) {
    console.error("Erro ao deletar perfil:", error);
    res.status(500).json({ error: "Erro ao deletar perfil." });    
  }
}

export const criarPerfil = async (req, res) => {
  try {
    const dados = req.body;

    // Caso o body seja um único objeto
    if (!Array.isArray(dados)) {
      const { nome, setorId } = dados;
      if (!nome || !setorId) {
        return res
          .status(400)
          .json({ error: "Nome e setorId são obrigatórios." });
      }
      const novo = await createPerfil({ nome, setorId });
      return res.status(201).json({ id: novo.id, nome, setorId });
    }

    // Caso o body seja um array de perfis
    const criados = [];
    for (const perfil of dados) {
      if (!perfil.nome || !perfil.setorId) {
        return res
          .status(400)
          .json({ error: "Todos os perfis precisam ter nome e setorId." });
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



