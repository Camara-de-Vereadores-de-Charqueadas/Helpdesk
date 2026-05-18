import express from "express";
import upload from "../uploads/upload.js";
import {
  listarChamados,
  listarChamadosPorSetor,
  listarChamadosPorPerfil,
  criarChamado,
  atualizarChamadoTI,
} from "../controllers/chamadoController.js";
import { deletarChamado } from "../controllers/chamadoController.js";

const router = express.Router();

// Rotas principais
router.get("/", listarChamados);
router.get("/setores/:setorId", listarChamadosPorSetor);
router.get("/perfis/:perfilId", listarChamadosPorPerfil);

// 🔹 AQUI: só essa rota POST deve existir
router.post("/", upload.array("imagens", 2), criarChamado);

router.put("/:id", atualizarChamadoTI); // rota normal
router.put("/ti/:id", atualizarChamadoTI); // rota específica da TI

router.delete("/:id", deletarChamado);

export default router;