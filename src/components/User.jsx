import { useState, useMemo, useEffect } from "react";
import { chamadosMock } from "../data/chamados";
import { PlusCircle, CaretCircleDown } from "@phosphor-icons/react";
import "../styles/User.css";
import Ticket from "../components/Ticket";
import ModalChamadoUser from "../components/modais/ModalChamadoUser";

// ==============================
// COMPONENTE DE CARD
// ==============================

export default function VisualizacaoUsuario() {
    const [expandidoAbertos, setExpandidoAbertos] = useState(true);
    const [expandidoResolvidos, setExpandidoResolvidos] = useState(false);
    const [abrirModal, setAbrirModal] = useState(false);
    const [chamados, setChamados] = useState([]);
    const [setor, setSetor] = useState(null);

    // Filtros
    const [filtrosAbertos, setFiltrosAbertos] = useState({
        periodo: "Últimos 30 dias",
        perfil: "Qualquer",
    });
    const [filtrosResolvidos, setFiltrosResolvidos] = useState({
        periodo: "Últimos 30 dias",
        perfil: "Qualquer",
    });

    // ✅ Buscar setor logado
    useEffect(() => {
        const setorSalvo = localStorage.getItem("setorLogado");
        if (setorSalvo) {
            setSetor(JSON.parse(setorSalvo));
            setChamados(chamadosMock); // exemplo: carregar chamados aqui
        } else {
            alert("Nenhum setor logado. Faça login novamente.");
            window.location.href = "/";
        }
    }, []);

    const handleFiltroChange = (setFiltroFn, campo, valor) => {
        setFiltroFn((prev) => ({ ...prev, [campo]: valor }));
    };

    const filtrarChamados = (lista, filtros) => {
        let resultado = [...lista];

        if (filtros.urgencia && filtros.urgencia !== "Qualquer") {
            resultado = resultado.filter((c) => c.urgencia === filtros.urgencia);
        }
        if (filtros.perfil && filtros.perfil !== "Qualquer") {
            resultado = resultado.filter((c) => c.perfil === filtros.perfil);
        }
        return resultado;
    };

    const ordenarChamados = (lista) => {
        const prioridade = { Alta: 3, Média: 2, Baixa: 1 };
        return [...lista].sort(
            (a, b) => (prioridade[b.urgencia] || 0) - (prioridade[a.urgencia] || 0)
        );
    };

    // ✅ useMemo sempre no mesmo lugar, sem depender do "setor"
    const chamadosAbertos = useMemo(() => {
        return ordenarChamados(
            filtrarChamados(chamados.filter((c) => !c.resolvido), filtrosAbertos)
        );
    }, [chamados, filtrosAbertos]);

    const chamadosResolvidos = useMemo(() => {
        return ordenarChamados(
            filtrarChamados(chamados.filter((c) => c.resolvido), filtrosResolvidos)
        );
    }, [chamados, filtrosResolvidos]);

    // ✅ Renderização condicional segura
    if (!setor) {
        return (
            <p style={{ textAlign: "center", marginTop: "2rem", color: "#555" }}>
                Nenhum setor logado. Faça login novamente.
            </p>
        );
    }
    function CardChamados({
        titulo,
        expandido,
        setExpandido,
        chamados,
        filtros,
        setFiltros,
        handleFiltroChange,
    }) {
        return (
            <div className="visualizacao-usuario fade-in">
                <div className="abrir-chamado">
                    <button className="btn-abrir" onClick={() => setAbrirModal(true)}>
                        ABRIR CHAMADO <PlusCircle size={20} />
                    </button>

                    {abrirModal && (
                        <ModalChamadoUser
                            onClose={() => {
                                const modal = document.querySelector(".modal-chamado-user");
                                modal.classList.add("fade-out-modal");
                                setTimeout(() => setAbrirModal(false), 250);
                            }}
                        />
                    )}
                </div>

                <CardChamados
                    titulo="ABERTOS"
                    expandido={expandidoAbertos}
                    setExpandido={setExpandidoAbertos}
                    chamados={chamadosAbertos}
                    filtros={filtrosAbertos}
                    setFiltros={setFiltrosAbertos}
                    handleFiltroChange={handleFiltroChange}
                />

                <CardChamados
                    titulo="RESOLVIDOS"
                    expandido={expandidoResolvidos}
                    setExpandido={setExpandidoResolvidos}
                    chamados={chamadosResolvidos}
                    filtros={filtrosResolvidos}
                    setFiltros={setFiltrosResolvidos}
                    handleFiltroChange={handleFiltroChange}
                />
            </div>
        );
    }
}