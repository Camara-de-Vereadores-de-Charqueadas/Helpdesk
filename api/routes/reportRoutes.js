import express from "express";
import { fetchFullReport } from "../controllers/reportController.js"

const router = express.Router();

router.get("/", fetchFullReport);

export default router;
