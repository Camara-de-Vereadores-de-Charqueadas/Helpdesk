import { useState, useMemo, useEffect } from "react";
import { PlusCircle } from "@phosphor-icons/react";
import "../styles/User.css";
import Ticket from "../components/Ticket";
import ModalChamadoUser from "../components/modais/ModalChamadoUser";

const API_URL = import.meta.env.VITE_API_URL;

const ABAS = ["Todos", "Abertos", "Em andamento", "Fechados"];
const ORDENACOES = ["Mais recentes", "Mais antigos", "Urgência"];

export default function VisualizacaoUsuario() {
  const [abrirModal, setAbrirModal] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState("Todos");
  const [ordenacao, setOrdenacao] = useState("Mais recentes");

  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

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
    carregarChamados();
    const interval = setInterval(carregarChamados, 5000);
    return () => clearInterval(interval);
  }, []);

  const chamadosFiltrados = useMemo(() => {
    const prioridade = { Alta: 3, Média: 2, Baixa: 1 };

    let lista = [...chamados];

    if (abaAtiva === "Abertos") lista = lista.filter((c) => !c.fechado && c.status !== "Em andamento");
    else if (abaAtiva === "Em andamento") lista = lista.filter((c) => c.status === "Em andamento");
    else if (abaAtiva === "Fechados") lista = lista.filter((c) => c.fechado);

    if (ordenacao === "Mais recentes") lista.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));
    else if (ordenacao === "Mais antigos") lista.sort((a, b) => new Date(a.criadoEm) - new Date(b.criadoEm));
    else if (ordenacao === "Urgência") lista.sort((a, b) => (prioridade[b.urgencia] || 0) - (prioridade[a.urgencia] || 0));

    return lista;
  }, [chamados, abaAtiva, ordenacao]);

  if (loading) return <div className="vu-page"><div className="vu-loading">Carregando chamados...</div></div>;
  if (erro) return <div className="vu-page"><div className="vu-erro">{erro}</div></div>;

  return (
    <div className="vu-page">

      {/* Hero */}
      <div className="vu-hero">
        <div className="vu-hero-deco vu-hero-deco--1" />
        <div className="vu-hero-deco vu-hero-deco--2" />
        <div className="vu-hero-left">
          <span className="vu-hero-tag">Precisa de suporte?</span>
          <h1 className="vu-hero-title">Abrir um chamado<br />é rápido e fácil</h1>
          <p className="vu-hero-sub">Nossa equipe está pronta para te atender.</p>
        </div>
        <div className="vu-hero-right">
          <button className="vu-btn-abrir" onClick={() => setAbrirModal(true)}>
            <PlusCircle size={20} weight="bold" />
            Abrir novo chamado
          </button>
        </div>
      </div>

      {/* Modal */}
      {abrirModal && (
        <ModalChamadoUser
          setorSelecionado={localStorage.getItem("setorId")}
          onClose={() => {
            const modal = document.querySelector(".modal-chamado-user");
            if (modal) modal.classList.add("fade-out-modal");
            setTimeout(() => setAbrirModal(false), 250);
          }}
        />
      )}

      {/* Card de chamados */}
      <div className="vu-card">
        <div className="vu-card-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A56DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="13" y2="15"/></svg>
          <h2 className="vu-card-titulo">Meus chamados</h2>
        </div>

        <div className="vu-tabs-row">
          <div className="vu-tabs">
            {ABAS.map((aba) => (
              <button
                key={aba}
                className={`vu-tab${abaAtiva === aba ? " vu-tab--ativo" : ""}`}
                onClick={() => setAbaAtiva(aba)}
              >
                {aba}
              </button>
            ))}
          </div>
        </div>

        <div className="vu-card-body">
          {chamadosFiltrados.length === 0 ? (
            <div className="vu-vazio">
              <div className="vu-vazio-icone">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
              </div>
              <p className="vu-vazio-titulo">Você ainda não possui chamados.</p>
              <p className="vu-vazio-sub">Clique em "Abrir novo chamado" para iniciar.</p>
            </div>
          ) : (
            <div className="vu-lista">
              {chamadosFiltrados.map((c) => (
                <Ticket key={c.id} chamado={c} />
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="vu-footer">© 2024 Helpdesk · Todos os direitos reservados</footer>
    </div>
  );
}