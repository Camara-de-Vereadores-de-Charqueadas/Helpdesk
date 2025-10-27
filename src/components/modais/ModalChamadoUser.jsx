import React, { useState } from "react";
import setores from "../../data/setores";
import "../../styles/Layouts/modalChamado.css";
import SelectUrgencia from "../SelectUrgencia";

export default function ModalChamadoUser({ onClose }) {
    const setor = setores[0];
    const [nome, setNome] = useState("");
    const [urgencia, setUrgencia] = useState("médio");
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");

    // Fecha o modal ao clicar fora
    const handleOverlayClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-chamado-user fade-in-modal">
                <div className="modal-header">
                    <h2>NOVO CHAMADO</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="setor-info">
                    <img src={setor.imagemPerfil} alt={setor.nome} className="setor-foto" />
                    <h3>{setor.nome}</h3>
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label className="grad-bundi">USUÁRIO SOLICITANTE *</label>
                        <input
                            type="text"
                            placeholder="Informe seu NOME"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </div>

                    <div className="form-group urgencia-group">
                        <label className="grad-bundi">URGÊNCIA</label>
                        <SelectUrgencia value={urgencia} onChange={setUrgencia} />
                    </div>

                    <div className="form-group anexos-group">
                        <label className="grad-roxo">ANEXOS</label>
                        <button className="btn-anexar">Anexar IMAGENS</button>
                    </div>
                </div>

                <div className="form-group full">
                    <label className="grad-bundi">TÍTULO DO PROBLEMA *</label>
                    <input
                        type="text"
                        placeholder="Informe o problema em uma frase"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />
                </div>

                <div className="form-group full">
                    <label className="grad-bundi">BREVE DESCRIÇÃO DO PROBLEMA</label>
                    <textarea
                        placeholder="Exemplo: Wi-Fi do notebook caiu há 10 minutos e ainda não voltou..."
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    ></textarea>
                </div>

                <button className="btn-criar">CRIAR NOVO CHAMADO</button>
            </div>
        </div>
    );
}
