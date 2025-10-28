import "../../../styles/Admin.css";
import Header from "../../../components/Header";
import Aside from "../../../components/Aside";
import { chamadosMock } from "../../../data/chamados";
import { Eye, CheckCircle, ClockCounterClockwise } from "@phosphor-icons/react";
import { useState } from "react";
import { formatarData } from "../../../utils/formatarData"; // 👈 usa a função humanizada (Hoje/Ontem)

// função auxiliar só pra formatar a data em DD/MM/AAAA (pra agrupar corretamente)
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

    const filtrarChamados = () => {
        if (filtro === "Abertos") return chamadosMock.filter(c => c.status === "NAO VISUALIZADO" || c.status === "EM ANDAMENTO");
        if (filtro === "Fechados") return chamadosMock.filter(c => c.status === "RESOLVIDO" || c.status === "NAO RESOLVIDO");
        return chamadosMock;
    };

    const chamadosFiltrados = filtrarChamados();

    const formatarHora = (dataISO) => {
        const data = new Date(dataISO);
        return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    };

    // --- AGRUPAR CHAMADOS POR DATA (DD/MM/AAAA) ---
    const chamadosPorData = chamadosFiltrados.reduce((acc, chamado) => {
        const data = formatarDataAgrupamento(chamado.dataHora);
        if (!acc[data]) acc[data] = [];
        acc[data].push(chamado);
        return acc;
    }, {});

    // --- ORDENAR DATAS (mais recentes primeiro) ---
    const datasOrdenadas = Object.keys(chamadosPorData).sort((a, b) => {
        const [diaA, mesA, anoA] = a.split("/").map(Number);
        const [diaB, mesB, anoB] = b.split("/").map(Number);
        return new Date(anoB, mesB - 1, diaB) - new Date(anoA, mesA - 1, diaA);
    });

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
                            // pegar o primeiro chamado dessa data só pra usar o valor ISO
                            const primeiroChamado = chamadosPorData[data][0];
                            const tituloData = formatarData(primeiroChamado.dataHora); // 👈 usa o "Hoje"/"Ontem"

                            return (
                                <div key={data}>
                                    <h3 className="data-separador">{tituloData}</h3>

                                    <div className="lista-chamados">
                                        {chamadosPorData[data].map((chamado) => (
                                            <div
                                                key={chamado.id}
                                                className={`chamado-card ${!chamado.visualizadoTI ? "nao-visualizado" : ""}`}
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
                                                        {/* <button className="btn-historico">
                                                            <ClockCounterClockwise size={22} />
                                                        </button> */}

                                                        <button
                                                            className={`btn-visualizar ${chamado.visualizadoTI ? "azul" : "vermelho"}`}
                                                        >
                                                            <Eye size={22} />
                                                        </button>

                                                        {!chamado.resolvido && (
                                                            <button className="btn-finalizar">
                                                                <CheckCircle size={20} />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div
                                                        className={`status ${chamado.status
                                                            ? chamado.status.toLowerCase().replace(" ", "-")
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
        </>
    );
}
