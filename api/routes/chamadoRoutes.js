import express from "express";
import {
    listarChamados,
    listarChamadosPorSetor,
    listarChamadosPorPerfil,
    criarChamado,
    atualizarChamadoTI
} from "../controllers/chamadoController.js";

const router = express.Router();

// Rotas principais
router.get("/", listarChamados);
router.get("/setores/:setorId", listarChamadosPorSetor);
router.get("/perfis/:perfilId", listarChamadosPorPerfil);
router.post("/", criarChamado);
router.put("/:id", atualizarChamadoTI);

export default router;
