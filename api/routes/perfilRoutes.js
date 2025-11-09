import express from "express";
import { listarPerfis, listarPerfisPorSetor, criarPerfil } from "../controllers/perfilController.js";

const router = express.Router();

router.get("/", listarPerfis);
router.get("/setores/:setorId", listarPerfisPorSetor);
router.post("/", criarPerfil);

export default router;
