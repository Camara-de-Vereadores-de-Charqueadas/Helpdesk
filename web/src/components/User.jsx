import { useState, useMemo, useEffect } from "react";
import { PlusCircle, CaretCircleDown } from "@phosphor-icons/react";
import "../styles/User.css";
import Ticket from "../components/Ticket";
import ModalChamadoUser from "../components/modais/ModalChamadoUser";

const API_URL = import.meta.env.VITE_API_URL;

export default function VisualizacaoUsuario() {
  const [expandidoAbertos, setExpandidoAbertos] = useState(true);
  const [expandidoResolvidos, setExpandidoResolvidos] = useState(false);
  const [abrirModal, setAbrirModal] = useState(false);

  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [filtrosAbertos, setFiltrosAbertos] = useState({
    periodo: "Últimos 30 dias",
    perfil: "Qualquer",
    urgencia: "Qualquer",
  });

  const [filtrosResolvidos, setFiltrosResolvidos] = useState({
    periodo: "Últimos 30 dias",
    perfil: "Qualquer",
    urgencia: "Qualquer",
  });

  const carregarChamados = async () => {
    try {
      const setorId = localStorage.getItem("setorId");
      if (!setorId) return setErro("Setor não logado.");

      const res = await fetch(`${API_URL}/api/chamados/setores/${setorId}`);
      if (!res.ok) throw new Error("Erro ao buscar chamados.");

      const data = await res.json();
      setChamados(data);
    } catch (error) {
      console.error(error);
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    carregarChamados(); // Carrega ao abrir a página

    const interval = setInterval(() => {
      carregarChamados(); // Atualiza automaticamente
    }, 5000); // 5 segundos

    return () => clearInterval(interval); // limpar ao sair da página
  }, []);

  const handleFiltroChange = (setFiltroFn, campo, valor) => {
    setFiltroFn((prev) => ({ ...prev, [campo]: valor }));
  };

  const filtrarChamados = (lista, filtros) => {
    let resultado = [...lista];
    if (filtros.urgencia !== "Qualquer") {
      resultado = resultado.filter((c) => c.urgencia === filtros.urgencia);
    }
    if (filtros.perfil !== "Qualquer") {
      resultado = resultado.filter((c) => c.perfilNome === filtros.perfil);
    }
    return resultado;
  };

  const ordenarChamados = (lista) => {
    const prioridade = { Alta: 3, Média: 2, Baixa: 1 };
    return [...lista].sort(
      (a, b) => (prioridade[b.urgencia] || 0) - (prioridade[a.urgencia] || 0)
    );
  };

  const chamadosAbertos = useMemo(() => {
    return ordenarChamados(
      filtrarChamados(
        chamados.filter((c) => !c.fechado),
        filtrosAbertos
      )
    );
  }, [chamados, filtrosAbertos]);

  const chamadosResolvidos = useMemo(() => {
    return ordenarChamados(
      filtrarChamados(
        chamados.filter((c) => c.fechado),
        filtrosResolvidos
      )
    );
  }, [chamados, filtrosResolvidos]);

  if (loading)
    return <div className="visualizacao-usuario">Carregando chamados...</div>;
  if (erro) return <div className="visualizacao-usuario erro">{erro}</div>;

  return (
    <div className="visualizacao-usuario fade-in">
      <div className="abrir-chamado">
        <button className="btn-abrir" onClick={() => setAbrirModal(true)}>
          ABRIR CHAMADO <PlusCircle size={20} />
        </button>
        {abrirModal && (
          <ModalChamadoUser
            setorSelecionado={localStorage.getItem("setorId")}
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
        titulo="FECHADOS"
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
    <div className={`card-chamados ${expandido ? "expandido" : "minimizado"}`}>
      <div className="card-header" onClick={() => setExpandido(!expandido)}>
        <h2 className="titulo-card">
          CHAMADOS / <span>{titulo}</span>
        </h2>
        <CaretCircleDown
          className={`icone-toggle ${expandido ? "ativo" : ""}`}
          size={26}
          weight="fill"
        />
      </div>

      {expandido && (
        <>
          <hr />
          <div className="card-conteudo fade-in">
            <h2 className="quantidade-chamados">{chamados.length} CHAMADOS</h2>

            <div className="filtros">
              <div className="filtro">
                <span className="label">Período:</span>
                <select
                  className="select-estilizado"
                  value={filtros.periodo}
                  onChange={(e) =>
                    handleFiltroChange(setFiltros, "periodo", e.target.value)
                  }
                >
                  <option>Últimos 7 dias</option>
                  <option>Últimos 30 dias</option>
                  <option>Últimos 90 dias</option>
                </select>
              </div>
            </div>

            <div className="lista-chamados fade-in">
              {chamados.map((c) => (
                <Ticket key={c.id} chamado={c} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
