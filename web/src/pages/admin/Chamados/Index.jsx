import "../../../styles/Admin.css";
import Header from "../../../components/Header";
import Aside from "../../../components/Aside";
import {
  Eye,
  CheckCircle,
  Image as ImageIcon,
  XCircle,
} from "@phosphor-icons/react";
import { useState, useEffect, useRef } from "react";
import { formatarData } from "../../../utils/formatarData";

const API_URL = "http://localhost:3000/api/chamados"; // ajuste se necessário

const formatarDataAgrupamento = (dataISO) => {
  const data = new Date(dataISO);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function Chamados() {
  const [filtro, setFiltro] = useState("Todos");
  const [chamados, setChamados] = useState([]);
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalImagens, setMostrarModalImagens] = useState(false);
  const [novosChamados, setNovosChamados] = useState(0);
  const audioRef = useRef(null);
  const prevIdsRef = useRef([]);

  // --- Buscar chamados do back-end ---
  async function buscarChamados() {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Erro ao buscar chamados");
      const data = await res.json();

      // detectar novos chamados
      const novos = data.filter((c) => !prevIdsRef.current.includes(c.id));
      if (novos.length > 0) {
        audioRef.current?.play();
        setNovosChamados((n) => n + novos.length);
      }

      prevIdsRef.current = data.map((c) => c.id);
      setChamados(data);
    } catch (err) {
      console.error("Erro ao buscar chamados:", err);
    }
  }

  // --- Atualiza título da aba ---
  useEffect(() => {
    const naoVisualizados = chamados.filter(
      (c) => c.status === "NAO VISUALIZADO"
    ).length;

    if (naoVisualizados > 0)
      document.title = `(${naoVisualizados}) Novos Chamados - Helpdesk`;
    else document.title = "Helpdesk - Chamados";
  }, [chamados]);

  // --- Efeito inicial ---
  useEffect(() => {
    buscarChamados();
    const interval = setInterval(buscarChamados, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- Filtro local ---
  const filtrarChamados = () => {
    if (filtro === "Abertos")
      return chamados.filter(
        (c) => c.status === "NAO VISUALIZADO" || c.status === "EM ANDAMENTO"
      );
    if (filtro === "Fechados")
      return chamados.filter(
        (c) => c.status === "RESOLVIDO" || c.status === "NAO RESOLVIDO"
      );
    return chamados;
  };

  const chamadosFiltrados = filtrarChamados();

  const formatarHora = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --- Agrupar por data ---
  const chamadosPorData = chamadosFiltrados.reduce((acc, chamado) => {
    const data = formatarDataAgrupamento(chamado.dataHora);
    if (!acc[data]) acc[data] = [];
    acc[data].push(chamado);
    return acc;
  }, {});

  const datasOrdenadas = Object.keys(chamadosPorData).sort((a, b) => {
    const [dA, mA, aA] = a.split("/").map(Number);
    const [dB, mB, aB] = b.split("/").map(Number);
    return new Date(aB, mB - 1, dB) - new Date(aA, mA - 1, dA);
  });

  const abrirModal = (chamado) => {
    setChamadoSelecionado(chamado);
    setMostrarModal(true);
  };

  const finalizarChamado = (chamado, resolvido) => {
    fetch(`${API_URL}/${chamado.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: resolvido ? "RESOLVIDO" : "NAO RESOLVIDO",
      }),
    })
      .then(() => buscarChamados())
      .catch((err) => console.error(err));
    setMostrarModal(false);
  };

  return (
    <>
      <Header isAdmin={true} userName="Informática" />
      <audio ref={audioRef} src="/assets/notify.mp3" preload="auto" />

      <div className="layout-inferior">
        <Aside
          isAdmin={true}
          userName="Informática"
          onFiltroChange={(novoFiltro) => setFiltro(novoFiltro)}
        />

        <div className="conteudo-principal">
          <div className="page chamados-page">
            <div className="chamados-header">
              <h1 className="titulo-chamados">
                CHAMADOS <span>/ {filtro.toUpperCase()}</span>
              </h1>
              <hr />
            </div>

            {datasOrdenadas.length === 0 ? (
              <p>Nenhum chamado encontrado.</p>
            ) : (
              datasOrdenadas.map((data) => {
                const primeiroChamado = chamadosPorData[data][0];
                const tituloData = formatarData(primeiroChamado.dataHora);

                return (
                  <div className="container-chamado" key={data}>
                    <h3 className="data-separador">{tituloData}</h3>
                    <div className="lista-chamados">
                      {chamadosPorData[data].map((chamado) => (
                        <div
                          key={chamado.id}
                          className={`chamado-card-admin ${
                            chamado.status === "NAO VISUALIZADO"
                              ? "nao-visualizado"
                              : ""
                          }`}
                        >
                          <div className="chamado-esquerda">
                            <img
                              src={chamado.setorImg}
                              alt={chamado.setorNome}
                              className="setor-img"
                            />
                            <div className="chamado-info">
                              <strong>{chamado.setorNome}</strong>
                              <p>{chamado.titulo}</p>
                            </div>
                          </div>

                          <div className="chamado-info-meio">
                            <span className="aberto-por">
                              Aberto por {chamado.perfilNome}
                            </span>
                            <strong>
                              {formatarHora(chamado.dataHora)} -{" "}
                              {formatarDataAgrupamento(chamado.dataHora)}
                            </strong>
                          </div>

                          <div className="chamado-acoes">
                            <div className="buttons">
                              <button
                                className={`btn-visualizar ${
                                  chamado.status === "NAO VISUALIZADO"
                                    ? "vermelho"
                                    : "azul"
                                }`}
                                onClick={() => abrirModal(chamado)}
                              >
                                <Eye size={22} className="icone-olho" />
                              </button>
                            </div>

                            <div
                              className={`status ${
                                chamado.status
                                  ? chamado.status
                                      .toLowerCase()
                                      .replace(" ", "-")
                                  : "nao-visualizado"
                              }`}
                            >
                              {chamado.status || "NAO VISUALIZADO"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* --- MODAL DE DETALHES --- */}
      {mostrarModal && chamadoSelecionado && (
        <div className="modal-overlay-admin">
          <div className="modal">
            <button
              className="modal-close"
              onClick={() => setMostrarModal(false)}
            >
              <XCircle size={28} />
            </button>

            <h2>{chamadoSelecionado.titulo}</h2>

            <p>
              <strong>Setor:</strong> {chamadoSelecionado.setorNome}
            </p>
            <p>
              <strong>Aberto por:</strong> {chamadoSelecionado.perfilNome}
            </p>
            <p>
              <strong>Descrição:</strong> {chamadoSelecionado.descricaoProblema}
            </p>

            <div className="modal-buttons">
              <button
                className="btn-imagens"
                onClick={() => setMostrarModalImagens(true)}
              >
                <ImageIcon size={32} />
              </button>

              <button
                className="btn-resolvido"
                onClick={() => finalizarChamado(chamadoSelecionado, true)}
              >
                Resolvido
              </button>

              <button
                className="btn-nao-resolvido"
                onClick={() => finalizarChamado(chamadoSelecionado, false)}
              >
                Não Resolvido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DE IMAGENS --- */}
      {mostrarModalImagens && (
        <div className="modal-overlay">
          <div className="modal modal-imagens">
            <button
              className="modal-close"
              onClick={() => setMostrarModalImagens(false)}
            >
              <XCircle size={28} />
            </button>

            <h2>Imagens do Chamado</h2>

            <div className="imagens-container">
              {JSON.parse(chamadoSelecionado.imagens || "[]").map(
                (img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Imagem ${idx + 1}`}
                    onClick={() => window.open(img, "_blank")}
                  />
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
