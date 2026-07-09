import express from "express";
import { listarPerfis, listarPerfisPorSetor, criarPerfil } from "../controllers/perfilController.js";

const router = express.Router();
// /api/perfis

router.get("/", listarPerfis);
router.get("/setor/:setorId", listarPerfisPorSetor);
router.post("/", criarPerfil);

// TODO
// router.get("/:id", fetchPerfilPorId);
// router.put("/:id", updatePerfil);
// router.delete("/:id", deletePerfil);
// -luanf

export default router;
