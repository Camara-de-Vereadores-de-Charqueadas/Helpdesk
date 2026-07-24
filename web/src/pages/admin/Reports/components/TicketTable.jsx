// pages/admin/Reports/components/TicketTable.jsx
import { useState, useMemo } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

const ITEMS_PER_PAGE = 10;

export default function TicketTable({ tickets = [] }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(tickets.length / ITEMS_PER_PAGE));
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return tickets.slice(start, start + ITEMS_PER_PAGE);
  }, [tickets, currentPage]);

  const renderPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusClass = (status, fechado) => {
    if (fechado === 1) return "status resolvido";
    if (status === "EM ANDAMENTO") return "status em-andamento";
    return "status nao-visualizado";
  };

  const getStatusLabel = (status, fechado) => {
    if (fechado === 1) return "Fechado";
    if (status === "EM ANDAMENTO") return "Em andamento";
    return "Não visualizado";
  };

  return (
    <div className="ticket-table-wrapper">
      <h3 className="ticket-table-title">Chamados Filtrados</h3>

      {tickets.length === 0 ? (
        <div className="ticket-table-empty">Nenhum chamado encontrado</div>
      ) : (
        <>
          <div className="ticket-table-scroll">
            <table className="ticket-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Setor</th>
                  <th>Descrição TI</th>
                  <th>Status</th>
                  <th>Abertura</th>
                  <th>Fechamento</th>
                  <th>Técnico</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTickets.map((t) => (
                  <tr key={t.id}>
                    <td>#{t.id}</td>
                    <td className="ticket-table-title-cell">{t.titulo}</td>
                    <td>{t.setorNome || "—"}</td>
                    <td className="ticket-table-desc-cell">{t.descricaoTI || "-"} </td>
                    <td>
                      <span className={getStatusClass(t.status, t.fechado)}>
                        {getStatusLabel(t.status, t.fechado)}
                      </span>
                    </td>
                    <td>{formatDate(t.dataHora)}</td>
                    <td>{t.fechado === 1 ? formatDate(t.dataFechamento) : "—"}</td>
                    <td>{t.finalizadoPorNome || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="ticket-table-pagination">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
              >
                <CaretLeftIcon size={14} />
              </button>
              {renderPageNumbers().map((n, i) =>
                n === "..." ? (
                  <span key={`e-${i}`} className="pag-reticencias">…</span>
                ) : (
                  <button
                    key={n}
                    className={n === currentPage ? "pag-ativo" : ""}
                    onClick={() => setCurrentPage(n)}
                  >
                    {n}
                  </button>
                )
              )}
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
              >
                <CaretRightIcon size={14} />
              </button>
            </div>
          )}

          <p className="ticket-table-info">
            Mostrando {tickets.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}–
            {Math.min(currentPage * ITEMS_PER_PAGE, tickets.length)} de {tickets.length} chamados
          </p>
        </>
      )}
    </div>
  );
}
