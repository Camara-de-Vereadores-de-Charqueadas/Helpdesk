import express from "express";
import cors from "cors";
import setorRoutes from "./routes/setorRoutes.js";
import perfilRoutes from "./routes/perfilRoutes.js";
import chamadoRoutes from "./routes/chamadoRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";

import initDatabase from "./db/init.js";

const app = express();
app.use(cors());
app.use(express.json()); // para ler JSON no body


const PORT = process.env.API_PORT || 3000;

// Rotas
app.get("/", (req, res) => res.send("API Helpdesk rodando 🚀"));
app.use("/api", loginRoutes);
app.use("/api/perfis", perfilRoutes);
app.use("/api/setores", setorRoutes);
app.use("/api/chamados", chamadoRoutes);


const startServer = async () => {
    await initDatabase(); // só prossegue se o banco responder
    app.listen(PORT, () => console.log(`🚀 API rodando na porta ${PORT}`));
};

startServer();