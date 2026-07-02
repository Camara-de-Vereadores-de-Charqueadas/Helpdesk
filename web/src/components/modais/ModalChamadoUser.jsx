import React, { useState, useEffect } from "react";
import "../../styles/Layouts/modalChamado.css";
import { createPortal } from "react-dom";
import { CaretDown, PlusCircle, TrashSimple, Paperclip, X } from "@phosphor-icons/react";

const api = import.meta.env.VITE_API_URL;

export default function ModalChamadoUser({ onClose, setorSelecionado }) {
  const [setor, setSetor] = useState(null);
  const [perfis, setPerfis] = useState([]);
  const [perfilSelecionado, setPerfilSelecionado] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagens, setImagens] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    async function fetchSetor() {
      try {
        const res = await fetch(`${api}/api/setores`);
        const data = await res.json();
        const encontrado = data.find((s) => s.id === Number(setorSelecionado));
        setSetor(encontrado);
      } catch (error) {
        console.error("Erro ao buscar setor:", error);
      }
    }

    async function fetchPerfis() {
      try {
        const res = await fetch(`${api}/api/perfis/setor/${setorSelecionado}`);
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

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) handleClose();
  };

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (imagens.length >= 2) {
      alert("Máximo de 2 imagens por chamado.");
      return;
    }
    setImagens((prev) => [...prev, file]);
  };

  const handleRemoveImage = (index) => {
    setImagens((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCriarChamado = async () => {
    if (!titulo || !descricao || !perfilSelecionado) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    setCarregando(true);

    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descricaoProblema", descricao);
      formData.append("setorId", setorSelecionado);
      formData.append("perfilId", perfilSelecionado);

      imagens.forEach((img) => {
        formData.append("imagens", img);
      });

      const res = await fetch(`${api}/api/chamados`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao criar chamado.");

      handleClose();
      setTimeout(() => alert("Chamado criado com sucesso!"), 50);
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
        <div className={`modal-chamado-user ${!isClosing ? "" : "fade-out-modal"}`}>
          <div className="modal-header">
            <h2>Novo Chamado</h2>
            <button className="close-btn" onClick={handleClose}>
              <X size={14} weight="bold" />
            </button>
          </div>

          <div className="modal-content">
            <div className="setor-info">
              <img
                src={setor.imagem_perfil}
                alt={setor.nome}
                className="setor-foto"
                loading="lazy"
              />
              <div>
                <span>Setor</span>
                <h3>{setor.nome}</h3>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Perfil de atendimento</label>
                <div className="select-wrapper">
                  <select
                    value={perfilSelecionado}
                    onChange={(e) => setPerfilSelecionado(e.target.value)}
                  >
                    <option value="">Selecionar perfil</option>
                    {perfis.length > 0 ? (
                      perfis.map((perfil) => (
                        <option key={perfil.id} value={perfil.id}>
                          {perfil.nome}
                        </option>
                      ))
                    ) : (
                      <option disabled>Nenhum perfil disponível</option>
                    )}
                  </select>
                  <CaretDown size={16} className="icon" />
                </div>
              </div>

              <div className="form-group">
                <label>Anexos</label>
                <button
                  className="btn-anexar"
                  onClick={() => setShowImageModal(true)}
                >
                  <Paperclip size={14} weight="bold" />
                  {imagens.length > 0 ? (
                    <span>{imagens.length}/2</span>
                  ) : (
                    "Adicionar"
                  )}
                </button>
              </div>
            </div>

            <div className="form-group full">
              <label>Título do problema</label>
              <input
                type="text"
                placeholder="Ex: Falha ao sincronizar dados"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>

            <div className="form-group full">
              <label>Descrição</label>
              <textarea
                placeholder="Descreva o ocorrido em detalhes..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

            <button
              className="btn-criar"
              onClick={handleCriarChamado}
              disabled={carregando}
            >
              {carregando ? "Enviando..." : "Criar Chamado"}
            </button>
          </div>
        </div>
      </div>

      {showImageModal && (
        <div
          className="mini-modal-overlay"
          onClick={(e) => {
            if (e.target.classList.contains("mini-modal-overlay"))
              setShowImageModal(false);
          }}
        >
          <div className="mini-modal">
            <div className="mini-modal-header">
              <h3>Adicionar imagens</h3>
              <button
                className="close-btn"
                onClick={() => setShowImageModal(false)}
              >
                <X size={14} weight="bold" />
              </button>
            </div>

            <div className="imagens-grid">
              {imagens.map((file, index) => (
                <div key={index} className="imagem-item">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    loading="lazy"
                  />
                  <button
                    className="delete-img-btn"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <TrashSimple size={12} weight="fill" />
                  </button>
                </div>
              ))}

              {imagens.length < 2 && (
                <label className="add-img-btn">
                  <PlusCircle size={28} weight="light" />
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