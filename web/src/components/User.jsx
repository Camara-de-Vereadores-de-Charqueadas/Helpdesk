import { useState, useMemo, useEffect } from "react";
import {
  PlusCircleIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  LightningIcon,
} from "@phosphor-icons/react";
import "../styles/User.css";
import ModalChamadoUser from "../components/modais/ModalChamadoUser";

const API_URL = import.meta.env.VITE_API_URL;

const ABAS = ["Todos", "Abertos", "Em andamento", "Fechados"];

function getStatusInfo(c) {
  if (c.fechado === 1) {
    return c.status === "RESOLVIDO"
      ? { label: "Concluído", cls: "concluido" }
      : { label: "Não resolvido", cls: "nao-resolvido" };
  }
  return c.status === "NAO VISUALIZADO"
    ? { label: "Não visualizado", cls: "nao-visualizado" }
    : { label: "Em andamento", cls: "em-andamento" };
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function VisualizacaoUsuario() {
  const [abrirModal, setAbrirModal] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState("Todos");
  const [busca, setBusca] = useState("");
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

  const contagens = useMemo(
    () => ({
      Todos: chamados.length,
      Abertos: chamados.filter((c) => !c.fechado && c.status !== "Em andamento").length,
      "Em andamento": chamados.filter((c) => c.status === "Em andamento").length,
      Fechados: chamados.filter((c) => c.fechado).length,
    }),
    [chamados]
  );

  const chamadosFiltrados = useMemo(() => {
    let lista = [...chamados];
    if (abaAtiva === "Abertos") lista = lista.filter((c) => !c.fechado && c.status !== "Em andamento");
    else if (abaAtiva === "Em andamento") lista = lista.filter((c) => c.status === "Em andamento");
    else if (abaAtiva === "Fechados") lista = lista.filter((c) => c.fechado);

    if (busca.trim()) {
      const q = busca.toLowerCase();
      lista = lista.filter(
        (c) =>
          c.titulo?.toLowerCase().includes(q) ||
          c.perfilNome?.toLowerCase().includes(q)
      );
    }

    lista.sort(
      (a, b) =>
        new Date(b.criadoEm || b.dataHora) - new Date(a.criadoEm || a.dataHora)
    );
    return lista;
  }, [chamados, abaAtiva, busca]);

  if (loading)
    return (
      <div className="vu-page">
        <div className="vu-loading">Carregando chamados...</div>
      </div>
    );
  if (erro)
    return (
      <div className="vu-page">
        <div className="vu-erro">{erro}</div>
      </div>
    );

  return (
    <div className="vu-page">

      {/* ===== HERO ===== */}
      <div className="vu-hero">
        <div className="vu-hero-deco vu-hero-deco--1" />
        <div className="vu-hero-deco vu-hero-deco--2" />

        <div className="vu-hero-content">
          <span className="vu-hero-tag">Precisa de suporte?</span>
          <h1 className="vu-hero-title">
            Abrir um chamado<br />
            <span className="vu-hero-title-accent">é rápido e fácil</span>
          </h1>
          <p className="vu-hero-sub">Nossa equipe está pronta para te atender.</p>
          <div className="vu-hero-badges">
            <span className="vu-hero-badge">
              <ShieldCheckIcon size={13} weight="fill" />
              Atendimento seguro
            </span>
            <span className="vu-hero-badge">
              <LightningIcon size={13} weight="fill" />
              Resposta ágil
            </span>
          </div>
          <button className="vu-btn-abrir" onClick={() => setAbrirModal(true)}>
            <PlusCircleIcon size={18} weight="bold" />
            Abrir novo chamado
          </button>
        </div>

        <div className="vu-hero-illustration" aria-hidden="true">
          <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="vu-hero-svg">
            <circle cx="100" cy="80" r="72" fill="#eff6ff" />
            <path d="M65 74 C65 47 135 47 135 74" stroke="#3b82f6" strokeWidth="5" fill="none" strokeLinecap="round" />
            <rect x="56" y="70" width="15" height="20" rx="7" fill="#2563eb" />
            <rect x="129" y="70" width="15" height="20" rx="7" fill="#2563eb" />
            <circle cx="100" cy="72" r="24" fill="#bfdbfe" />
            <circle cx="91" cy="69" r="4" fill="#1d4ed8" />
            <circle cx="109" cy="69" r="4" fill="#1d4ed8" />
            <path d="M91 79 Q100 86 109 79" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <rect x="78" y="97" width="44" height="30" rx="14" fill="#93c5fd" />
            <rect x="132" y="28" width="44" height="26" rx="11" fill="#2563eb" />
            <circle cx="144" cy="41" r="3" fill="white" />
            <circle cx="154" cy="41" r="3" fill="white" />
            <circle cx="164" cy="41" r="3" fill="white" />
            <path d="M138 54 L132 62" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="22" y="40" width="36" height="22" rx="9" fill="#bfdbfe" />
            <circle cx="33" cy="51" r="2.5" fill="#3b82f6" />
            <circle cx="40" cy="51" r="2.5" fill="#3b82f6" />
            <circle cx="47" cy="51" r="2.5" fill="#3b82f6" />
            <path d="M50 62 L56 68" stroke="#bfdbfe" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* ===== MODAL ===== */}
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

      {/* ===== CARD DE CHAMADOS ===== */}
      <div className="vu-card">
        <div className="vu-card-header">
          <div className="vu-card-titulo-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A56DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="5" y="2" width="14" height="20" rx="2" />
              <line x1="9" y1="7" x2="15" y2="7" />
              <line x1="9" y1="11" x2="15" y2="11" />
              <line x1="9" y1="15" x2="13" y2="15" />
            </svg>
            <h2 className="vu-card-titulo">Meus chamados</h2>
          </div>
          <div className="vu-search-wrap">
            <MagnifyingGlassIcon size={15} className="vu-search-icon" />
            <input
              type="text"
              className="vu-search"
              placeholder="Buscar chamados..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
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
                <span className={`vu-tab-count${abaAtiva === aba ? " vu-tab-count--ativo" : ""}`}>
                  {contagens[aba]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="vu-card-body">
          {chamadosFiltrados.length === 0 ? (
            <div className="vu-vazio">
              <div className="vu-vazio-icone">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1A56DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                  <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                </svg>
              </div>
              <p className="vu-vazio-titulo">Nenhum chamado encontrado.</p>
              <p className="vu-vazio-sub">Clique em "Abrir novo chamado" para iniciar.</p>
            </div>
          ) : (
            <div className="vu-table">
              <div className="vu-table-head">
                <span>Chamado</span>
                <span className="vu-col-hide-sm">Solicitante</span>
                <span className="vu-col-hide-md">Aberto em</span>
                <span>Status</span>
              </div>
              {chamadosFiltrados.map((c) => {
                const { label, cls } = getStatusInfo(c);
                const dateStr = formatDate(c.criadoEm || c.dataHora);
                const initials = (c.perfilNome || "?")
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();
                return (
                  <div key={c.id} className="vu-table-row">
                    <div className="vu-table-chamado">
                      <strong className="vu-table-titulo">{c.titulo}</strong>
                      <span className="vu-table-desc">{c.descricaoProblema}</span>
                    </div>
                    <div className="vu-table-solicitante vu-col-hide-sm">
                      <div className="vu-avatar">{initials}</div>
                      <span className="vu-avatar-nome">{c.perfilNome}</span>
                    </div>
                    <div className="vu-table-date vu-col-hide-md">{dateStr}</div>
                    <div>
                      <span className={`vu-status vu-status--${cls}`}>{label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <footer className="vu-footer">© 2024 Helpdesk · Todos os direitos reservados</footer>
    </div>
  );
}
