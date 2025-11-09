import express from "express";
import { listarSetores, criarSetor } from "../controllers/setorController.js";

const router = express.Router();

router.get("/", listarSetores);
router.post("/", criarSetor);

export default router;
