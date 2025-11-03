import "../../../styles/Admin.css";
import Header from "../../../components/Header";
import Aside from "../../../components/Aside";
import { chamadosMock as chamadosIniciais } from "../../../data/chamados";
import {
    Eye,
    CheckCircle,
    Image as ImageIcon,
    XCircle,
} from "@phosphor-icons/react";
import { useState } from "react";
import { formatarData } from "../../../utils/formatarData";

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
    const [chamados, setChamados] = useState(chamadosIniciais);
    const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalImagens, setMostrarModalImagens] = useState(false);

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

    // --- AGRUPAR POR DATA ---
    const chamadosPorData = chamadosFiltrados.reduce((acc, chamado) => {
        const data = formatarDataAgrupamento(chamado.dataHora);
        if (!acc[data]) acc[data] = [];
        acc[data].push(chamado);
        return acc;
    }, {});

    // --- ORDENAR DATAS (decrescente) ---
    const datasOrdenadas = Object.keys(chamadosPorData).sort((a, b) => {
        const [dA, mA, aA] = a.split("/").map(Number);
        const [dB, mB, aB] = b.split("/").map(Number);
        return new Date(aB, mB - 1, dB) - new Date(aA, mA - 1, dA);
    });

    // --- FUNÇÃO: abrir modal de detalhes ---
    const abrirModal = (chamado) => {
        // marca como visualizado
        const atualizados = chamados.map((c) =>
            c.id === chamado.id ? { ...c, visualizadoTI: true, status: "EM ANDAMENTO" } : c
        );
        setChamados(atualizados);
        setChamadoSelecionado(chamado);
        setMostrarModal(true);
    };

    // --- FUNÇÃO: finalizar chamado ---
    const finalizarChamado = (chamado, resolvido) => {
        const atualizados = chamados.map((c) =>
            c.id === chamado.id
                ? {
                    ...c,
                    resolvido,
                    status: resolvido ? "RESOLVIDO" : "NAO RESOLVIDO",
                }
                : c
        );
        setChamados(atualizados);
        setMostrarModal(false);
    };

    return (
        <>
            <Header isAdmin={true} userName="Informática" />
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

                        {datasOrdenadas.map((data) => {
                            const primeiroChamado = chamadosPorData[data][0];
                            const tituloData = formatarData(primeiroChamado.dataHora);

                            return (
                                <div key={data}>
                                    <h3 className="data-separador">{tituloData}</h3>

                                    <div className="lista-chamados">
                                        {chamadosPorData[data].map((chamado) => (
                                            <div
                                                key={chamado.id}
                                                className={`chamado-card-admin ${!chamado.visualizadoTI ? "nao-visualizado" : ""
                                                    }`}
                                            >
                                                <div className="chamado-esquerda">
                                                    <img
                                                        src={chamado.setorImg}
                                                        alt={chamado.setor}
                                                        className="setor-img"
                                                    />
                                                    <div className="chamado-info">
                                                        <strong>{chamado.setor}</strong>
                                                        <p>{chamado.titulo}</p>
                                                    </div>
                                                </div>

                                                <div className="chamado-info-meio">
                                                    <span className="aberto-por">
                                                        Aberto por {chamado.perfil}
                                                    </span>
                                                    <strong>
                                                        {formatarHora(chamado.dataHora)} -{" "}
                                                        {formatarDataAgrupamento(chamado.dataHora)}
                                                    </strong>
                                                </div>

                                                <div className="chamado-acoes">
                                                    <div className="buttons">
                                                        <button
                                                            className={`btn-visualizar ${chamado.visualizadoTI
                                                                ? "azul"
                                                                : "vermelho"
                                                                }`}
                                                            onClick={() => abrirModal(chamado)}
                                                        >
                                                            <Eye size={22} />
                                                        </button>

                                                        {/* {!chamado.resolvido && (
                                                            <button
                                                                className="btn-finalizar"
                                                                onClick={() =>
                                                                    setChamadoSelecionado(chamado)
                                                                }
                                                            >
                                                                <CheckCircle size={20} />
                                                            </button>
                                                        )} */}
                                                    </div>
                                                    <div
                                                        className={`status ${chamado.status
                                                            ? chamado.status
                                                                .toLowerCase()
                                                                .replace(" ", "-")
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
                        })}
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
                            <strong>Setor:</strong> {chamadoSelecionado.setor}
                        </p>
                        <p>
                            <strong>Aberto por:</strong> {chamadoSelecionado.perfil}
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
                            {chamadoSelecionado.imagens?.map((img, idx) => (
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
            )}
        </>
    );
}
