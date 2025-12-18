import "../../../styles/Admin.css";
import Header from "../../../components/Header";
import Aside from "../../../components/Aside";
import {
  Eye,
  CheckCircle,
  Image as ImageIcon,
  XCircle,
  TrashSimple,
} from "@phosphor-icons/react";
import { useState, useEffect, useRef } from "react";
import { formatarData } from "../../../utils/formatarData";
import notifySound from "../../../assets/notify.mp3";

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

  // NOVO: Campo para descrição da TI
  const [descricaoTI, setDescricaoTI] = useState("");

  const api = import.meta.env.VITE_API_URL;

  const prevIdsRef = useRef([]);
  const primeiraExecucaoRef = useRef(true);

  // ---------------------------------------------------------
  // BUSCAR CHAMADOS
  // ---------------------------------------------------------
  async function buscarChamados() {
    try {
      const endpoint = `${api}/api/chamados`;

      const res = await fetch(endpoint, { method: "GET" });

      if (!res.ok) {
        const text = await res.text();
        console.error("Erro ao buscar chamados:", res.status, text);
        throw new Error("Erro ao buscar chamados");
      }

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Resposta não JSON:", contentType, text);
        throw new Error("Formato inválido");
      }

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Dados inválidos");

      const novos = data.filter((c) => !prevIdsRef.current.includes(c.id));

      if (novos.length > 0 && !primeiraExecucaoRef.current) {
        audioRef.current?.play();
        setNovosChamados((n) => n + novos.length);
      }

      if (primeiraExecucaoRef.current) primeiraExecucaoRef.current = false;

      prevIdsRef.current = data.map((c) => c.id);
      setChamados(data);
    } catch (err) {
      console.error("Erro ao buscar chamados:", err);
    }
  }

  // Título da aba
  useEffect(() => {
    const naoVisualizados = chamados.filter(
      (c) => c.visualizadoTI === 0
    ).length;

    document.title =
      naoVisualizados > 0
        ? `(${naoVisualizados}) Novos Chamados - Helpdesk`
        : "Helpdesk - Chamados";
  }, [chamados]);

  // Recarregar a cada 10s
  useEffect(() => {
    buscarChamados();
    const interval = setInterval(buscarChamados, 10000);
    return () => clearInterval(interval);
  }, []);

  // ---------------------------------------------------------
  // FILTRO
  // ---------------------------------------------------------
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

  const deletarChamado = async (id) => {
    if (!confirm("Deseja realmente deletar este chamado?")) return;

    try {
      await fetch(`${api}/api/chamados/${id}`, { method: "DELETE" });
      buscarChamados();
    } catch (err) {
      console.error("Erro ao deletar chamado:", err);
    }
  };

  const formatarHora = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Agrupamento por data
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
    console.log("Imagens:", chamado.imagens);

    setChamadoSelecionado(chamado);
    setDescricaoTI(chamado.descricaoTI || ""); // CARREGA DESCRIÇÃO TI SE EXISTIR
    setMostrarModal(true);
  };

  const marcarComoVisualizado = async (chamado) => {
    try {
      await fetch(`${api}/api/chamados/${chamado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visualizadoTI: true,
        }),
      });

      setChamados((prev) =>
        prev.map((c) =>
          c.id === chamado.id
            ? { ...c, visualizadoTI: 1, status: "EM ANDAMENTO" }
            : c
        )
      );
    } catch (err) {
      console.error("Erro ao marcar visualizado:", err);
    }
  };

  // ---------------------------------------------------------
  // FINALIZAR CHAMADO (ATUALIZADO)
  // ---------------------------------------------------------
  const finalizarChamado = async (chamado, resolvido) => {
    if (!descricaoTI.trim()) {
      alert("A descrição da TI é obrigatória para finalizar o chamado!");
      return;
    }

    try {
      const dataFechamento = new Date().toISOString();

      await fetch(`${api}/api/chamados/${chamado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: resolvido ? "RESOLVIDO" : "NAO RESOLVIDO",
          descricaoTI: descricaoTI,
          dataFechamento: dataFechamento,
        }),
      });

      setChamados((prev) =>
        prev.map((c) =>
          c.id === chamado.id
            ? {
                ...c,
                status: resolvido ? "RESOLVIDO" : "NAO RESOLVIDO",
                descricaoTI,
                dataFechamento,
                fechado: 1,
              }
            : c
        )
      );

      setMostrarModal(false);
    } catch (err) {
      console.error("Erro ao finalizar chamado:", err);
    }
  };

  return (
    <>
      <Header isAdmin={true} userName="Informática" />
      <audio ref={audioRef} src={notifySound} preload="auto" />
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
                            chamado.visualizadoTI === 0 ? "nao-visualizado" : "" // CORREÇÃO: usar visualizadoTI
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
                                  chamado.visualizadoTI === 0
                                    ? "nao-visualizado"
                                    : "visualizado"
                                }`}
                                onClick={() => {
                                  // Primeiro abre o modal imediatamente
                                  abrirModal(chamado);

                                  // Depois marca como visualizado (se necessário)
                                  if (chamado.visualizadoTI === 0) {
                                    marcarComoVisualizado(chamado);
                                  }
                                }}
                              >
                                <Eye size={22} className="icone-olho" />
                              </button>{" "}
                              <button
                                className="btn-delete"
                                onClick={() => deletarChamado(chamado.id)}
                              >
                                <TrashSimple size={22} />
                              </button>
                            </div>

                            {/* CORREÇÃO: Status com classe correta */}
                            <div
                              className={`status ${
                                chamado.status
                                  ? chamado.status
                                      .toLowerCase()
                                      .replace(/\s+/g, "-")
                                  : "nao-visualizado"
                              }`}
                            >
                              {chamado.status || "NÃO VISUALIZADO"}
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
      {/* --- MODAL DE DETALHES PRINCIPAL --- */}
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

            {/* Mostrar descrição da TI se existir */}
            {chamadoSelecionado.fechado === 1 && (
              <>
                {chamadoSelecionado.descricaoTI && (
                  <p>
                    <strong>Descrição TI:</strong>{" "}
                    {chamadoSelecionado.descricaoTI}
                  </p>
                )}

                {chamadoSelecionado.dataFechamento && (
                  <p>
                    <strong>Fechado em:</strong>{" "}
                    {new Date(chamadoSelecionado.dataFechamento).toLocaleString(
                      "pt-BR"
                    )}
                  </p>
                )}
              </>
            )}
            {chamadoSelecionado.fechado !== 1 && (
              <div className="campo-ti">
                <label>
                  <strong>Descrição TI:</strong>
                </label>
                <textarea
                  className="descricao-ti-admin"
                  value={descricaoTI}
                  onChange={(e) => setDescricaoTI(e.target.value)}
                  placeholder="Descreva o que foi feito pela TI..."
                ></textarea>
              </div>
            )}

            <div className="modal-buttons">
              {/* Botão para ver imagens - CORREÇÃO AQUI */}
              {chamadoSelecionado.imagens &&
                chamadoSelecionado.imagens.length > 0 && ( // REMOVEU JSON.parse
                  <button
                    className="btn-imagens"
                    onClick={() => setMostrarModalImagens(true)}
                  >
                    <ImageIcon size={32} />
                  </button>
                )}

              {/* Botões de finalização - só mostrar se não estiver fechado */}
              {chamadoSelecionado.fechado !== 1 && (
                <>
                  <button
                    className="btn-resolvido"
                    onClick={() => finalizarChamado(chamadoSelecionado, true)}
                  >
                    <CheckCircle size={32} weight="fill" />
                  </button>

                  <button
                    className="btn-nao-resolvido"
                    onClick={() => finalizarChamado(chamadoSelecionado, false)}
                  >
                    <XCircle size={32} weight="fill" />
                  </button>
                </>
              )}

              {/* Mostrar status se estiver fechado */}
              {chamadoSelecionado.fechado === 1 && (
                <div
                  className={`status ${chamadoSelecionado.status
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {chamadoSelecionado.status}
                </div>
              )}
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
              {/* CORREÇÃO AQUI - Remove JSON.parse */}
              {(chamadoSelecionado?.imagens || []).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Imagem ${idx + 1}`}
                  onClick={() => window.open(img, "_blank")}
                />
              ))}
            </div>
          </div>
        </div>
      )}{" "}
    </>
  );
}
