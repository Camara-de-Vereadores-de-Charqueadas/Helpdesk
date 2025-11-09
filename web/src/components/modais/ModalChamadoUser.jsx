import React, { useState, useEffect } from "react";
import "../../styles/Layouts/modalChamado.css";
import { createPortal } from "react-dom";
import { CaretDown, PlusCircle, TrashSimple } from "@phosphor-icons/react";

export default function ModalChamadoUser({ onClose, setorSelecionado }) {
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [imagens, setImagens] = useState([]);
    const [showImageModal, setShowImageModal] = useState(false);
    const [setor, setSetor] = useState(null);
    const [perfis, setPerfis] = useState([]);
    const [perfilSelecionado, setPerfilSelecionado] = useState("");

    // 🔹 Carregar dados do setor e seus perfis ao abrir o modal
    useEffect(() => {
        async function fetchSetor() {
            try {
                const res = await fetch(`/api/setores`);
                const setores = await res.json();
                const setorEncontrado = setores.find((s) => s.id === setorSelecionado);
                setSetor(setorEncontrado || null);
            } catch (err) {
                console.error("Erro ao carregar setor:", err);
            }
        }

        async function fetchPerfis() {
            try {
                const res = await fetch(`/api/perfis/setores/${setorSelecionado}`);
                const data = await res.json();
                setPerfis(data);
            } catch (err) {
                console.error("Erro ao buscar perfis:", err);
            }
        }

        fetchSetor();
        fetchPerfis();
    }, [setorSelecionado]);

    // 🔹 Envio do chamado ao backend
    const handleCriarChamado = async () => {
        if (!titulo || !descricao || !perfilSelecionado || !setorSelecionado) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }

        try {
            const payload = {
                titulo,
                descricaoProblema: descricao,
                setorId: setorSelecionado,
                perfilId: perfilSelecionado,
                imagens, // opcional, limitado a 2
            };

            const res = await fetch("/api/chamados", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Erro ao criar chamado.");
            const data = await res.json();

            alert("Chamado criado com sucesso!");
            console.log("Novo chamado:", data);
            onClose(); // fecha o modal
        } catch (err) {
            console.error(err);
            alert("Erro ao enviar chamado.");
        }
    };

    // 🔹 Adicionar imagem (máximo 2)
    const handleAddImage = (e) => {
        const file = e.target.files[0];
        if (file && imagens.length < 2) {
            const reader = new FileReader();
            reader.onload = () => {
                setImagens((prev) => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (index) => {
        setImagens((prev) => prev.filter((_, i) => i !== index));
    };

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) onClose();
    };

    if (!setor) return null;

    const modalContent = (
        <>
            <div className="modal-overlay" onClick={handleOverlayClick}>
                <div className="modal-chamado-user fade-in-modal">
                    <div className="modal-header">
                        <h2>NOVO CHAMADO</h2>
                        <button className="close-btn" onClick={onClose}>×</button>
                    </div>

                    <div className="setor-info">
                        <img
                            src={setor.imagem_perfil}
                            alt={setor.nome}
                            className="setor-foto"
                        />
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
                                        {perfis.length > 0 ? (
                                            perfis.map((perfil) => (
                                                <option key={perfil.id} value={perfil.id}>
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

                        <div className="form-group anexos-group">
                            <label className="grad-roxo">ANEXOS</label>
                            <button
                                className="btn-anexar"
                                onClick={() => setShowImageModal(true)}
                            >
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
                            placeholder="Exemplo: Wi-Fi do notebook caiu há 10 minutos..."
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        ></textarea>
                    </div>

                    <button className="btn-criar" onClick={handleCriarChamado}>
                        CRIAR NOVO CHAMADO
                    </button>
                </div>
            </div>

            {/* Mini modal de imagens */}
            {showImageModal && (
                <div
                    className="mini-modal-overlay"
                    onClick={(e) => {
                        if (e.target.classList.contains("mini-modal-overlay"))
                            setShowImageModal(false);
                    }}
                >
                    <div className="mini-modal fade-in-modal">
                        <div className="mini-modal-header">
                            <h3>Imagens do chamado</h3>
                            <button className="close-btn" onClick={() => setShowImageModal(false)}>×</button>
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
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAddImage}
                                        hidden
                                    />
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
