import { fullReport } from "../models/reportModel.js";

export const fetchFullReport = async (req, res) => {
  try {
	const { period } = req.query;
	const report = await fullReport(period);
	res.json(report);
   } catch (error) {
	console.error(error);
	res.status(500).json({ error: "Erro ao obter relatorio." });
   } ;
};
