import express from "express";
import { listarSetores, criarSetor } from "../controllers/setorController.js";

const router = express.Router();

router.get("/", listarSetores);
router.post("/", criarSetor);

// TODO
// router.get("/setores/:id", fetchSetorPorId);
// router.put("/:id", updateSetor);
// router.delete("/:id", deleteSetor);
// -luanf


export default router;
