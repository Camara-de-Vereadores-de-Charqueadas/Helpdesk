import fs from "fs";
import path from "path";
import {
  getAllChamados,
  getChamadosBySetor,
  getChamadosByPerfil,
  createChamado,
  createChamadosEmLote,
  updateChamadoTI,
  updateChamadoImages,
  deleteChamado,
  getChamados,
} from "../models/chamadoModel.js";

// Lista todos os chamados (com imagens parseadas)
export const listarChamados = async (req, res) => {
  try {
    const chamados = await getAllChamados();
    res.json(chamados);
  } catch (error) {
    console.error("Erro ao listar chamados:", error);
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
    console.error("Erro ao listar chamados por setor:", error);
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
    console.error("Erro ao listar chamados por perfil:", error);
    res.status(500).json({ error: "Erro ao listar chamados do perfil." });
  }
};

// Deletar chamado (apaga arquivos do disco se houver)
export const deletarChamado = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await deleteChamado(id);

    if (!resultado || resultado.affectedRows === 0)
      return res.status(404).json({ error: "Chamado não encontrado." });

    res.json({ message: "Chamado deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar chamado:", error);
    res.status(500).json({ error: "Erro ao deletar chamado." });
  }
};

// Cria novo chamado (renomeia imagens usando o id do chamado)
export const criarChamado = async (req, res) => {
  try {
    const { titulo, descricaoProblema, setorId, perfilId } = req.body;

    // Arquivos enviados via multer (salvos temporariamente)
    const imagensTemp = req.files || [];

    // 1) Primeiro salva o chamado com status inicial correto
    const chamadoId = await createChamado({
      titulo,
      descricaoProblema,
      setorId,
      perfilId,
      status: "NÃO VISUALIZADO", // Status inicial correto
      visualizadoTI: 0, // Não visualizado inicialmente
      fechado: 0, // Não fechado
    });

    // 2) Renomear as imagens (se houver)
    const imagensFinais = [];
    const uploadDir = path.join(process.cwd(), "uploads");

    for (let i = 0; i < imagensTemp.length; i++) {
      const img = imagensTemp[i];
      const ext = path.extname(img.originalname) || "";
      const newName = `${chamadoId}-${i + 1}${ext}`;
      const oldPath = img.path;
      const newPath = path.join(uploadDir, newName);

      // mover/renomear arquivo
      fs.renameSync(oldPath, newPath);

      // salvar caminho relativo para front
      imagensFinais.push(`http://192.168.0.106:3000/api/uploads/${newName}`);
    }

    // 3) Atualiza o chamado se houver imagens finais
    if (imagensFinais.length > 0) {
      await updateChamadoImages(chamadoId, imagensFinais);
    }

    // Retorna o chamado recém-criado
    res.status(201).json({
      message: "Chamado criado!",
      id: chamadoId,
      imagens: imagensFinais.length > 0 ? imagensFinais : null,
    });
  } catch (error) {
    console.error("Erro ao criar chamado:", error);
    res.status(500).json({ error: "Erro ao criar chamado" });
  }
};

// Atualiza informações de TI no chamado
export const atualizarChamadoTI = (req, res) => {
  const id = req.params.id;
  const campos = req.body;

  // Se for finalização, garante inclusão automática da data
  if (campos.status === "RESOLVIDO" || campos.status === "NAO RESOLVIDO") {
    campos.dataFechamento = new Date().toISOString();
    campos.fechado = 1;
    campos.visualizadoTI = 1;
  }

  const ok = updateChamadoTI(id, campos);

  if (!ok) {
    return res.status(400).json({ erro: "Falha ao atualizar chamado" });
  }

  res.json({ sucesso: true });
};
