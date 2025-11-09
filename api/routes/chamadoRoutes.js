import express from "express";
import {
    listarChamados,
    listarChamadosPorSetor,
    criarChamado,
    atualizarChamadoTI
} from "../controllers/chamadoController.js";

const router = express.Router();

router.get("/", listarChamados);
router.get("/setor/:setorId", listarChamadosPorSetor);
router.post("/", criarChamado);
router.put("/:id", atualizarChamadoTI);

export default router;
