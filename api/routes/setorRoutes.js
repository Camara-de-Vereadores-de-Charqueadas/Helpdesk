import express from "express";
import { listarSetores, criarSetor, fetchSetorPorId, updateSetor, deleteSetor } from "../controllers/setorController.js";

const router = express.Router();

router.get("/", listarSetores);
router.post("/", criarSetor);
router.get("/:id", fetchSetorPorId);
router.put("/:id", updateSetor);
router.delete("/:id", deleteSetor);

export default router;
