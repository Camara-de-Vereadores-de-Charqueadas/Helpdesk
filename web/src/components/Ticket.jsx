import { Eye } from "@phosphor-icons/react";
import "../styles/Layouts/Ticket.css";

export default function Ticket({ chamado }) {
  const dataAbertura = new Date(chamado.dataHora).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const dataFechamentoFormatada =
    chamado.fechado === 1 && chamado.dataFechamento
      ? new Date(chamado.dataFechamento).toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

  const getStatus = () => {
    if (chamado.fechado === 1) {
      return chamado.status === "RESOLVIDO" ? "Concluído" : "Não Resolvido";
    }

    return chamado.status === "NAO VISUALIZADO"
      ? "Não Visualizado"
      : "Em andamento";
  };

  return (
    <div className="chamado-card">
      <div className="chamado-topo">
        <strong>
          {chamado.titulo.toUpperCase()} | {dataAbertura}
        </strong>
      </div>

      {/* ===== CORPO PRINCIPAL ===== */}
      <div className="chamado-corpo">
        <div className="lado-esquerdo">
          <div className="perfil-ticket">
            <p className="titulo-info">PERFIL SOLICITANTE:</p>
            <p className="perfil-ticket-p">{chamado.perfilNome}</p>
          </div>
          <div className="perfil-ticket">
            <p className="titulo-info">DESCRIÇÃO DO PROBLEMA:</p>
            <p className="descricao">{chamado.descricaoProblema}</p>
          </div>
          {chamado.fechado === 1 && dataFechamentoFormatada && (
            <p className="data-fechamento">
              <strong className="titulo-info">FECHADO EM: </strong>
              {dataFechamentoFormatada}
            </p>
          )}
        </div>

        <div className="lado-direito">
          <p className="titulo-info">STATUS</p>
          <p
            className={`status-response ${getStatus()
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            {getStatus()}
          </p>
        </div>
      </div>

      {/* ===== DESCRIÇÃO TI (FULL WIDTH) ===== */}
      {chamado.descricaoTI && (
        <div className="descricao-ti-container">
          <p className="titulo-info">RESPOSTA DA TI</p>
          <p className="descricao-ti">{chamado.descricaoTI}</p>
        </div>
      )}
    </div>
  );
}
