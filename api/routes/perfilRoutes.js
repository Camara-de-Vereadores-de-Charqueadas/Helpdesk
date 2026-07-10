import express from "express";
import { listarPerfis, listarPerfisPorSetor, criarPerfil, fetchPerfilPorId, updatePerfil, deletePerfil } from "../controllers/perfilController.js";

const router = express.Router();
// /api/perfis

router.get("/", listarPerfis);
router.get("/setor/:setorId", listarPerfisPorSetor);
router.post("/", criarPerfil);

router.get("/:id", fetchPerfilPorId);
router.put("/:id", updatePerfil);
router.delete("/:id", deletePerfil);

export default router;
