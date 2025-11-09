import express from "express";
import upload from "../uploads/upload.js";
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
router.post("/", upload.array("imagens", 2), criarChamado);


export default router;
