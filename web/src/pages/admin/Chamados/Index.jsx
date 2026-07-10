import "../../../styles/Admin.css";
import Header from "../../../components/Header";
import Aside from "../../../components/Aside";
import {
  EyeIcon,
  CheckCircleIcon,
  ImageIcon,
  XCircleIcon,
  TrashSimpleIcon,
  MagnifyingGlassIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react";
import { useState, useEffect, useRef, useMemo } from "react";
import notifySound from "../../../assets/notify.mp3";

const ITENS_POR_PAGINA = 10;

export default function Chamados() {
  const [filtro, setFiltro] = useState("Todos");
  const [chamados, setChamados] = useState([]);
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalImagens, setMostrarModalImagens] = useState(false);
  const [mostrarModalEdit, setMostrarModalEdit] = useState(false);

  const [novosChamados, setNovosChamados] = useState(0);
  const audioRef = useRef(null);
  const [perfisTI, setPerfisTI] = useState([]);
  const [finalizadoPorPerfilId, setFinalizadoPorPerfilId] = useState("");
  const [descricaoTI, setDescricaoTI] = useState("");

  // Toolbar
  const [busca, setBusca] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  const api = import.meta.env.VITE_API_URL;
  const prevIdsRef = useRef([]);
  const primeiraExecucaoRef = useRef(true);

  // ---------------------------------------------------------
  // BUSCAR CHAMADOS
  // ---------------------------------------------------------
  async function buscarChamados() {
    try {
      const res = await fetch(`${api}/api/chamados`, { method: "GET" });
      if (!res.ok) throw new Error("Erro ao buscar chamados");

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) throw new Error("Formato inválido");

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

  useEffect(() => {
    async function buscarPerfisTI() {
      try {
        const res = await fetch(`${api}/api/perfis/setor/1`);
        if (!res.ok) throw new Error("Erro ao buscar perfis da TI");
        const data = await res.json();
        setPerfisTI(data);
      } catch (err) {
        console.error("Erro ao buscar perfis da TI:", err);
      }
    }
    buscarPerfisTI();
  }, [api]);

  useEffect(() => {
    const naoVisualizados = chamados.filter((c) => c.visualizadoTI === 0).length;
    document.title =
      naoVisualizados > 0
        ? `(${naoVisualizados}) Novos Chamados - Helpdesk`
        : "Helpdesk - Chamados";
  }, [chamados]);

  useEffect(() => {
    buscarChamados();
    const interval = setInterval(buscarChamados, 10000);
    return () => clearInterval(interval);
  }, []);

  // Reseta página ao mudar filtros
  useEffect(() => {
    setPaginaAtual(1);
  }, [filtro, busca, filtroData]);

  // ---------------------------------------------------------
  // FILTRO + BUSCA + PAGINAÇÃO
  // ---------------------------------------------------------
  const chamadosFiltrados = useMemo(() => {
    let lista = [...chamados];

    if (filtro === "Abertos")
      lista = lista.filter((c) => c.status === "NAO VISUALIZADO");
    else if (filtro === "Em andamento")
      lista = lista.filter((c) => c.status === "EM ANDAMENTO");
    else if (filtro === "Fechados")
      lista = lista.filter((c) => c.fechado == 1);

    if (busca.trim()) {
      const q = busca.toLowerCase();
      lista = lista.filter(
        (c) =>
          c.titulo?.toLowerCase().includes(q) ||
          c.setorNome?.toLowerCase().includes(q) ||
          c.perfilNome?.toLowerCase().includes(q)
      );
    }

    if (filtroData) {
      lista = lista.filter((c) => c.dataHora?.startsWith(filtroData));
    }

    lista.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));
    return lista;
  }, [chamados, filtro, busca, filtroData]);

  const totalPaginas = Math.max(1, Math.ceil(chamadosFiltrados.length / ITENS_POR_PAGINA));
  const chamadosPagina = chamadosFiltrados.slice(
    (paginaAtual - 1) * ITENS_POR_PAGINA,
    paginaAtual * ITENS_POR_PAGINA
  );

  const renderPageNumbers = () => {
    if (totalPaginas <= 7)
      return Array.from({ length: totalPaginas }, (_, i) => i + 1);
    const pages = [1];
    if (paginaAtual > 3) pages.push("...");
    const start = Math.max(2, paginaAtual - 1);
    const end = Math.min(totalPaginas - 1, paginaAtual + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (paginaAtual < totalPaginas - 2) pages.push("...");
    pages.push(totalPaginas);
    return pages;
  };

  // ---------------------------------------------------------
  // AÇÕES
  // ---------------------------------------------------------
  const deletarChamado = async (id) => {
    if (!confirm("Deseja realmente deletar este chamado?")) return;
    try {
      await fetch(`${api}/api/chamados/${id}`, { method: "DELETE" });
      buscarChamados();
    } catch (err) {
      console.error("Erro ao deletar chamado:", err);
    }
  };

  const abrirModal = (chamado) => {
    setChamadoSelecionado(chamado);
    setDescricaoTI(chamado.descricaoTI || "");
    setFinalizadoPorPerfilId(chamado.finalizadoPorPerfilId || "");
    setMostrarModal(true);
  };

  const marcarComoVisualizado = async (chamado) => {
    try {
      await fetch(`${api}/api/chamados/${chamado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visualizadoTI: true }),
      });
      setChamados((prev) =>
        prev.map((c) =>
          c.id === chamado.id ? { ...c, visualizadoTI: 1, status: "EM ANDAMENTO" } : c
        )
      );
    } catch (err) {
      console.error("Erro ao marcar visualizado:", err);
    }
  };

  const finalizarChamado = async (chamado, resolvido) => {
    if (!descricaoTI.trim()) {
      alert("A descrição da TI é obrigatória para finalizar o chamado!");
      return;
    }
    if (!finalizadoPorPerfilId) {
      alert("Selecione o funcionário da TI que está finalizando o chamado!");
      return;
    }
    try {
      const dataFechamento = new Date().toISOString();
      await fetch(`${api}/api/chamados/${chamado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: resolvido ? "RESOLVIDO" : "NAO RESOLVIDO",
          descricaoTI,
          dataFechamento,
          finalizadoPorPerfilId: Number(finalizadoPorPerfilId),
        }),
      });

      const perfilSelecionado = perfisTI.find(
        (p) => Number(p.id) === Number(finalizadoPorPerfilId)
      );

      setChamados((prev) =>
        prev.map((c) =>
          c.id === chamado.id
            ? {
                ...c,
                status: resolvido ? "RESOLVIDO" : "NAO RESOLVIDO",
                descricaoTI,
                dataFechamento,
                fechado: 1,
                finalizadoPorPerfilId: Number(finalizadoPorPerfilId),
                finalizadoPorNome: perfilSelecionado?.nome || "",
              }
            : c
        )
      );

      setChamadoSelecionado((prev) =>
        prev
          ? {
              ...prev,
              status: resolvido ? "RESOLVIDO" : "NAO RESOLVIDO",
              descricaoTI,
              dataFechamento,
              fechado: 1,
              finalizadoPorPerfilId: Number(finalizadoPorPerfilId),
              finalizadoPorNome: perfilSelecionado?.nome || "",
            }
          : prev
      );

      setMostrarModal(false);
    } catch (err) {
      console.error("Erro ao finalizar chamado:", err);
    }
  };

  const formatarHora = (dataISO) =>
    new Date(dataISO).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  // ---------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------
  return (
    <>
      <Header isAdmin={true} userName="Informática" />
      <audio ref={audioRef} src={notifySound} preload="auto" />

      <div className="layout-inferior">
        <Aside
          isAdmin={true}
          userName="Informática"
          chamados={chamados}
          onFiltroChange={(novoFiltro) => setFiltro(novoFiltro)}
        />

        <div className="conteudo-principal">
          <div className="page chamados-page">

            {/* Cabeçalho */}
            <div className="chamados-header">
              <h1 className="titulo-chamados">
                CHAMADOS <span>/ {filtro.toUpperCase()}</span>
              </h1>
              <hr />
            </div>

            {/* Toolbar */}
            <div className="chamados-toolbar">
              <div className="toolbar-busca">
                <MagnifyingGlassIcon size={16} />
                <input
                  type="text"
                  placeholder="Buscar por título, setor ou pessoa..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
              <input
                type="date"
                className="toolbar-data"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
              />
              {filtroData && (
                <button className="toolbar-limpar" onClick={() => setFiltroData("")}>
                  Limpar data
                </button>
              )}
            </div>

            {/* Lista paginada */}
            {chamadosPagina.length === 0 ? (
              <p className="sem-chamados">Nenhum chamado encontrado.</p>
            ) : (
              <div className="lista-chamados">
                {chamadosPagina.map((chamado) => (
                  <div
                    key={chamado.id}
                    className={`chamado-card-admin ${chamado.visualizadoTI === 0 ? "nao-visualizado" : ""}`}
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
                      <span className="aberto-por">Aberto por {chamado.perfilNome}</span>
                      <strong>
                        {formatarHora(chamado.dataHora)} —{" "}
                        {new Date(chamado.dataHora).toLocaleDateString("pt-BR")}
                      </strong>
                    </div>

                    <div className="chamado-acoes">
                      <div className="buttons">
                        <button
                          className={`btn-visualizar ${chamado.visualizadoTI === 0 ? "nao-visualizado" : "visualizado"}`}
                          onClick={() => {
                            abrirModal(chamado);
                            if (chamado.visualizadoTI === 0) marcarComoVisualizado(chamado);
                          }}
                        >
                          <EyeIcon size={22} />
                        </button>
                        <button className="btn-delete" onClick={() => deletarChamado(chamado.id)}>
                          <TrashSimpleIcon size={22} />
                        </button>
                      </div>
                      <div
                        className={`status ${
                          chamado.status
                            ? chamado.status.toLowerCase().replace(/\s+/g, "-")
                            : "nao-visualizado"
                        }`}
                      >
                        {chamado.status || "NÃO VISUALIZADO"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Paginação */}
            {totalPaginas > 1 && (
              <div className="paginacao">
                <button
                  onClick={() => setPaginaAtual((p) => p - 1)}
                  disabled={paginaAtual === 1}
                >
                  <CaretLeftIcon size={14} />
                </button>

                {renderPageNumbers().map((n, i) =>
                  n === "..." ? (
                    <span key={`e-${i}`} className="pag-reticencias">…</span>
                  ) : (
                    <button
                      key={n}
                      className={n === paginaAtual ? "pag-ativo" : ""}
                      onClick={() => setPaginaAtual(n)}
                    >
                      {n}
                    </button>
                  )
                )}

                <button
                  onClick={() => setPaginaAtual((p) => p + 1)}
                  disabled={paginaAtual === totalPaginas}
                >
                  <CaretRightIcon size={14} />
                </button>
              </div>
            )}

            {chamadosFiltrados.length > 0 && (
              <p className="paginacao-info">
                Mostrando{" "}
                {(paginaAtual - 1) * ITENS_POR_PAGINA + 1}–
                {Math.min(paginaAtual * ITENS_POR_PAGINA, chamadosFiltrados.length)}{" "}
                de {chamadosFiltrados.length} chamados
              </p>
            )}
          </div>
        </div>
      </div>

      {/* --- MODAL DE DETALHES --- */}
      {mostrarModal && chamadoSelecionado && (
        <div className="modal-overlay-admin">
          <div className="modal">
            <button className="modal-close" onClick={() => setMostrarModal(false)}>
              <XCircleIcon size={28} />
            </button>

            <h2 className="modal-title">{chamadoSelecionado.titulo}</h2>

            <p>
              <strong>Setor:</strong> {chamadoSelecionado.setorNome}
            </p>

            <div>
              <p>
                <strong>Aberto por:</strong> {chamadoSelecionado.perfilNome}
              </p>
              <p>
                <strong>Descrição:</strong>{" "}
                <span className="descricao-texto">{chamadoSelecionado.descricaoProblema}</span>
              </p>
            </div>

            {chamadoSelecionado.fechado === 1 && (
              <>
                {chamadoSelecionado.descricaoTI && (
                  <p>
                    <strong>Descrição TI:</strong>{" "}
                    <span className="descricao-texto">{chamadoSelecionado.descricaoTI}</span>
                  </p>
                )}
                {chamadoSelecionado.finalizadoPorNome && (
                  <p>
                    <strong>Finalizado por:</strong> {chamadoSelecionado.finalizadoPorNome}
                  </p>
                )}
                {chamadoSelecionado.dataFechamento && (
                  <p>
                    <strong>Fechado em:</strong>{" "}
                    {new Date(chamadoSelecionado.dataFechamento).toLocaleString("pt-BR")}
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
                />
                <div className="campo-ti">
                  <label>
                    <strong>Funcionário da TI:</strong>
                  </label>
                  <select
                    className="select-ti-admin"
                    value={finalizadoPorPerfilId}
                    onChange={(e) => setFinalizadoPorPerfilId(e.target.value)}
                  >
                    <option value="">Selecione o funcionário</option>
                    {perfisTI.map((perfil) => (
                      <option key={perfil.id} value={perfil.id}>
                        {perfil.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="modal-buttons">
              {chamadoSelecionado.imagens?.length > 0 && (
                <button className="btn-imagens" onClick={() => setMostrarModalImagens(true)}>
                  <ImageIcon size={32} />
                </button>
              )}

              {chamadoSelecionado.fechado !== 1 && (
                <>
                  <button
                    className="btn-resolvido"
                    onClick={() => finalizarChamado(chamadoSelecionado, true)}
                  >
                    <CheckCircleIcon size={32} weight="fill" />
                  </button>
                  <button
                    className="btn-nao-resolvido"
                    onClick={() => finalizarChamado(chamadoSelecionado, false)}
                  >
                    <XCircleIcon size={32} weight="fill" />
                  </button>
                </>
              )}

              {chamadoSelecionado.fechado === 1 && (
                <>
                  <button className="btn-edit" onClick={() => setMostrarModalEdit(true)}>
                    ✏️ Editar
                  </button>
                  <div
                    className={`status ${chamadoSelecionado.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {chamadoSelecionado.status}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DE IMAGENS --- */}
      {mostrarModalImagens && (
        <div className="modal-overlay">
          <div className="modal modal-imagens">
            <button className="modal-close" onClick={() => setMostrarModalImagens(false)}>
              <XCircleIcon size={28} />
            </button>
            <h2 className="modal-title">Imagens do Chamado</h2>
            <div className="imagens-container">
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
      )}

      {/* --- MODAL DE EDIÇÃO --- */}
      {mostrarModalEdit && chamadoSelecionado?.fechado === 1 && (
        <div className="modal-overlay-admin">
          <div className="modal">
            <button className="modal-close" onClick={() => setMostrarModalEdit(false)}>
              <XCircleIcon size={28} />
            </button>
            <h2 className="modal-title">Modo de edição</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const form = e.target;
                  const editDescricao = form.descricaoTI.value;
                  const novoPerfilID = form.FinalizadoPorPerfilID.value;
                  const status = form.resolvidoStatus.value;
                  const currentTime = new Date().toISOString();

                  await fetch(`${api}/api/chamados/ti/${chamadoSelecionado.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      descricaoTI: editDescricao,
                      finalizadoPorPerfilId: parseInt(novoPerfilID) || null,
                      status,
                    }),
                  });

                  setChamadoSelecionado((prev) => ({
                    ...prev,
                    descricaoTI: editDescricao,
                    finalizadoPorPerfilId: parseInt(novoPerfilID),
                    finalizadoPorNome:
                      perfisTI.find((p) => String(p.id) === String(novoPerfilID))?.nome || "",
                    status,
                    dataFechamento: currentTime,
                  }));

                  setChamados((prev) =>
                    prev.map((c) =>
                      c.id === chamadoSelecionado.id
                        ? {
                            ...c,
                            descricaoTI: editDescricao,
                            finalizadoPorPerfilId: parseInt(novoPerfilID),
                            finalizadoPorNome:
                              perfisTI.find((p) => String(p.id) === String(novoPerfilID))?.nome || "",
                            status,
                            dataFechamento: currentTime,
                          }
                        : c
                    )
                  );

                  setMostrarModalEdit(false);
                } catch (err) {
                  console.error("Erro ao editar chamado", err);
                }
              }}
            >
              <div className="campo-ti">
                <label>
                  <strong>Descrição TI:</strong>
                </label>
                <textarea
                  name="descricaoTI"
                  className="descricao-ti-admin"
                  defaultValue={chamadoSelecionado.descricaoTI || ""}
                />
              </div>

              <div className="campo-ti">
                <label>
                  <strong>Finalizado por:</strong>
                </label>
                <select
                  name="FinalizadoPorPerfilID"
                  className="select-ti-admin"
                  defaultValue={chamadoSelecionado.finalizadoPorPerfilId || ""}
                >
                  <option value="">Selecione o funcionário</option>
                  {perfisTI.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo-ti">
                <label>
                  <strong>Status:</strong>
                </label>
                <select
                  name="resolvidoStatus"
                  className="select-ti-admin"
                  defaultValue={chamadoSelecionado.status}
                >
                  <option value="RESOLVIDO">Resolvido</option>
                  <option value="NAO RESOLVIDO">Não resolvido</option>
                </select>
              </div>

              <div className="modal-buttons">
                <button className="btn-save" type="submit">Salvar</button>
                <button
                  className="btn-cancel"
                  type="button"
                  onClick={() => setMostrarModalEdit(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
