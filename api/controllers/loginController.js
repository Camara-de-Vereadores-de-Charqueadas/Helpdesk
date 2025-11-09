// controllers/loginController.js
import { findByCodigoEntrada } from "../models/setorModel.js";
import jwt from "jsonwebtoken";

export async function login(req, res) {
    const { codigo_entrada } = req.body;

    if (!codigo_entrada) {
        return res.status(400).json({ error: "Código de entrada é obrigatório." });
    }

    try {
        const setor = await findByCodigoEntrada(codigo_entrada);

        if (!setor) {
            return res.status(401).json({ error: "Código inválido." });
        }

        // Gera token JWT (opcional, mas útil para validação futura)
        const token = jwt.sign(
            { id: setor.id, nome: setor.nome },
            process.env.JWT_SECRET || "chave-super-secreta",
            { expiresIn: "365d" } // 1 ano
        );

        res.json({
            message: "Login bem-sucedido!",
            setor,
            token,
        });
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ error: "Erro interno no servidor." });
    }
}
