import React, { useState } from "react";
import setores from "../../data/setores";
import "../../styles/Layouts/modalChamado.css";
import SelectUrgencia from "../SelectUrgencia";
import { createPortal } from "react-dom";

import {
    CaretDown,
    PlusCircle,
    TrashSimple
} from "@phosphor-icons/react";

export default function ModalChamadoUser({ onClose, setorSelecionado }) {
    const [nome, setNome] = useState("");
    // const [urgencia, setUrgencia] = useState("médio");
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [showImageModal, setShowImageModal] = useState(false);
    const [imagens, setImagens] = useState([]);
    const [perfilSelecionado, setPerfilSelecionado] = useState("");

    setorSelecionado = 5;
    // busca o setor com base no id
    const setor = setores.find((s) => s.id === setorSelecionado);

    // Fecha o modal ao clicar fora
    const handleOverlayClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) {
            onClose();
        }
    };

    // Abrir pequeno modal de imagens
    const openImageModal = () => {
        setShowImageModal(true);
    };

    // Fechar modal de imagens
    const closeImageModal = () => {
        setShowImageModal(false);
    };

    // Adicionar imagem (máx 2)
    const handleAddImage = (e) => {
        const file = e.target.files[0];
        if (file && imagens.length < 2) {
            const url = URL.createObjectURL(file);
            setImagens((prev) => [...prev, url]);
        }
    };

    // Remover imagem
    const handleRemoveImage = (index) => {
        setImagens((prev) => prev.filter((_, i) => i !== index));
    };

    const modalContent = (<>
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
                    <div className="form-grid full">
                        <div className="form-group">
                            <label className="grad-bundi">Selecione o perfil</label>
                            <div className="select-wrapper">
                                <select
                                    value={perfilSelecionado}
                                    onChange={(e) => setPerfilSelecionado(e.target.value)}
                                >
                                    <option value="">Selecione...</option>
                                    {setor.perfis.length > 0 ? (
                                        setor.perfis.map((perfil) => (
                                            <option key={perfil.id} value={perfil.nome}>
                                                {perfil.nome}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>(Nenhum perfil cadastrado)</option>
                                    )}
                                </select>
                                <CaretDown size={18} className="icon" />
                            </div>
                        </div>
                    </div>

                    {/* <div className="form-group urgencia-group">
                            <label className="grad-bundi">URGÊNCIA</label>
                            <SelectUrgencia value={urgencia} onChange={setUrgencia} />
                        </div> */}

                    <div className="form-group anexos-group">
                        <label className="grad-roxo">ANEXOS</label>
                        <button className="btn-anexar" onClick={openImageModal}>
                            Anexar IMAGENS
                        </button>
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

        {/* MODAL DE IMAGENS */}
        {showImageModal && (
            <div className="mini-modal-overlay" onClick={(e) => {
                if (e.target.classList.contains("mini-modal-overlay")) closeImageModal();
            }}>
                <div className="mini-modal fade-in-modal">
                    <div className="mini-modal-header">
                        <h3>Imagens do chamado</h3>
                        <button className="close-btn" onClick={closeImageModal}>×</button>
                    </div>

                    <div className="imagens-grid">
                        {imagens.map((img, index) => (
                            <div key={index} className="imagem-item">
                                <img src={img} alt={`Imagem ${index + 1}`} />
                                <button
                                    className="delete-img-btn"
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    <TrashSimple size={12} color="#ffffff" weight="fill" />
                                </button>
                            </div>
                        ))}

                        {imagens.length < 2 && (
                            <label className="add-img-btn">
                                <PlusCircle size={32} color="var(--azul-claro)" weight="fill" />
                                <input type="file" accept="image/*" onChange={handleAddImage} hidden />
                            </label>
                        )}
                    </div>
                </div>
            </div>
        )}
    </>

    );
    return createPortal(modalContent, document.body);

}
