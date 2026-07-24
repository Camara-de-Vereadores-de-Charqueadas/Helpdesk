import { fullReport } from "../models/reportModel.js";

export const fetchFullReport = async (req, res) => {
  try {
	const { d, a, s, sd, ed } = req.query; 
	const report = await fullReport(d, a, s, sd, ed);
	res.json(report);
   } catch (error) {
	console.error(error);
	res.status(500).json({ error: "Erro ao obter relatorio." });
   } ;
};
