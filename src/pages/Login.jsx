// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SignIn } from "@phosphor-icons/react";
import "../styles/login.css";
import logoCamara from "../assets/logoCharqueadasPreto.png";
import setores from "../data/setores";

export default function Login() {
    const [codigo, setCodigo] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        if (!codigo.trim()) return alert("Digite o código de entrada!");

        const setorEncontrado = setores.find(
            (setor) => setor.codigoEntrada === codigo.trim()
        );

        if (!setorEncontrado) {
            alert("Código inválido!");
            return;
        }
        if (setorEncontrado) {
            // Salva o setor logado no localStorage
            localStorage.setItem("setorLogado", JSON.stringify(setorEncontrado));

            // E também salva o tipo de usuário, se quiser
            const userType = setorEncontrado.nome === "Informática" ? "admin" : "user";
            localStorage.setItem("userType", userType);

            // Agora navega
            navigate("/home", {
                state: {
                    setor: setorEncontrado,
                    userType,
                },
            });
        }

        // Redireciona com o setor completo
        navigate("/home", {
            state: {
                setor: setorEncontrado,
                userType: setorEncontrado.nome === "Informática" ? "admin" : "user",
            },
        });
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
                                type="text"
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
                <img src={logoCamara} alt="Logo Câmara" className="login-logo-bottom" />
            </div>
        </div>
    );
}
