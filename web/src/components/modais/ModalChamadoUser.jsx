import React, { useState, useEffect } from "react";
import "../../styles/Layouts/modalChamado.css";
import { createPortal } from "react-dom";
import { CaretDown, PlusCircle, TrashSimple } from "@phosphor-icons/react";

export default function ModalChamadoUser({ onClose, setorSelecionado }) {
    const [setor, setSetor] = useState(null);
    const [perfis, setPerfis] = useState([]);
    const [perfilSelecionado, setPerfilSelecionado] = useState("");
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [imagens, setImagens] = useState([]); // aqui guardamos File objects
    const [showImageModal, setShowImageModal] = useState(false);
    const [carregando, setCarregando] = useState(false);

    // 🔹 Busca setor e perfis
    useEffect(() => {
        async function fetchSetor() {
            try {
                const res = await fetch(`http://localhost:3000/api/setores`);
                const data = await res.json();
                const encontrado = data.find((s) => s.id === Number(setorSelecionado));
                setSetor(encontrado);
            } catch (error) {
                console.error("Erro ao buscar setor:", error);
            }
        }

        async function fetchPerfis() {
            try {
                const res = await fetch(
                    `http://localhost:3000/api/perfis/setor/${setorSelecionado}`
                );
                const data = await res.json();
                setPerfis(data);
            } catch (error) {
                console.error("Erro ao buscar perfis:", error);
            }
        }

        if (setorSelecionado) {
            fetchSetor();
            fetchPerfis();
        }
    }, [setorSelecionado]);

    // 🔹 Fecha modal ao clicar fora
    const handleOverlayClick = (e) => {
        if (e.target.classList.contains("modal-overlay")) onClose();
    };

    // 🔹 Adiciona imagem (máx. 2)
    const handleAddImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (imagens.length >= 2)
            return alert("Máximo de 2 imagens por chamado.");
        setImagens((prev) => [...prev, file]); // salva o File, não base64
    };

    // 🔹 Remove imagem
    const handleRemoveImage = (index) => {
        setImagens((prev) => prev.filter((_, i) => i !== index));
    };

    // 🔹 Cria chamado
    const handleCriarChamado = async () => {
        if (!titulo || !descricao || !perfilSelecionado) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        setCarregando(true);

        try {
            // 👉 agora usamos FormData
            const formData = new FormData();
            formData.append("titulo", titulo);
            formData.append("descricaoProblema", descricao);
            formData.append("setorId", setorSelecionado);
            formData.append("perfilId", perfilSelecionado);
            console.log({
                titulo,
                descricaoProblema: descricao,
                setorId: setorSelecionado,
                perfilId: perfilSelecionado,
                imagens
            });

            imagens.forEach((img) => {
                formData.append("imagens", img);
            });

            const res = await fetch("http://localhost:3000/api/chamados", {
                method: "POST",
                body: formData, // sem headers
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Erro ao criar chamado.");

            alert("Chamado criado com sucesso!");
            onClose();
        } catch (error) {
            console.error(error);
            alert("Erro ao enviar chamado.");
        } finally {
            setCarregando(false);
        }
    };

    if (!setor) return null;

    const modalContent = (
        <>
            <div className="modal-overlay" onClick={handleOverlayClick}>
                <div className="modal-chamado-user fade-in-modal">
                    <div className="modal-header">
                        <h2>NOVO CHAMADO</h2>
                        <button className="close-btn" onClick={onClose}>
                            ×
                        </button>
                    </div>

                    <div className="setor-info">
                        <img src={setor.imagem_perfil} alt={setor.nome} className="setor-foto" />
                        <h3>{setor.nome}</h3>
                    </div>

                    <div className="form-grid">
                        <div className="form-group full">
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
                        <label className="grad-bundi">BREVE DESCRIÇÃO DO PROBLEMA *</label>
                        <textarea
                            placeholder="Descreva o que aconteceu..."
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        ></textarea>
                    </div>

                    <button
                        className="btn-criar"
                        onClick={handleCriarChamado}
                        disabled={carregando}
                    >
                        {carregando ? "Enviando..." : "CRIAR NOVO CHAMADO"}
                    </button>
                </div>
            </div>

            {/* 🔹 Modal de imagens */}
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
                            <button
                                className="close-btn"
                                onClick={() => setShowImageModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="imagens-grid">
                            {imagens.map((file, index) => (
                                <div key={index} className="imagem-item">
                                    <img src={URL.createObjectURL(file)} alt={`Imagem ${index + 1}`} />
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
                                    <PlusCircle
                                        size={32}
                                        color="var(--azul-claro)"
                                        weight="fill"
                                    />
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
