// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignIn } from "@phosphor-icons/react";
import "../styles/login.css";
import logoCamara from "../assets/logoCharqueadasPreto.png";

const Login = () => {
    const [codigo, setCodigo] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!codigo.trim()) return alert("Digite o código de entrada!");

        try {
            const res = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ codigo_entrada: codigo.trim() }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Erro no login!");
                return;
            }

            // Salva os dados e o token no localStorage
            localStorage.setItem("setorLogado", JSON.stringify(data.setor));
            localStorage.setItem("setorId", data.setor.id);
            localStorage.setItem("token", data.token);
            localStorage.setItem("userType", data.setor.nome === "Informática" ? "admin" : "user");

            navigate("/home", {
                state: {
                    setor: data.setor,
                    userType: data.setor.nome === "Informática" ? "admin" : "user",
                },
            });
        } catch (error) {
            console.error("Erro de conexão:", error);
            alert("Não foi possível conectar ao servidor.");
        }
    };

    return (
        <div className="login-container">
            {/* === Lado esquerdo === */}
            <div className="login-left">
                <div className="overlay"></div>
                <div className="login-text">
                    <h1>HELPDESK</h1>
                    <p>PLATAFORMA DE CHAMADOS DA INFORMÁTICA</p>
                </div>
            </div>

            {/* === Lado direito === */}
            <div className="login-right">
                <img src={logoCamara} alt="Logo Câmara" className="login-logo" />
                <div className="container-form">
                    <div className="login-form">
                        <h2>
                            INSIRA O CÓDIGO DE <span>ENTRADA</span>
                        </h2>

                        <div className="login-input-group">
                            <input
                                type="password"
                                className="login-input"
                                value={codigo}
                                onChange={(e) => setCodigo(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                            />
                            <button className="login-btn" onClick={handleLogin}>
                                <SignIn size={32} />
                            </button>
                        </div>

                        <a href="#" className="login-forgot">
                            ESQUECI O CÓDIGO
                        </a>
                    </div>
                </div>
            </div>

            <div className="img-button">
                <img src={logoCamara} alt="Logo Câmara" className="login-logo-bottom" />
            </div>
        </div>
    );
};

export default Login;
