import { useState, useEffect } from "react";
import { generateAndDownloadPDF } from "./pdf/pdfGenerator.js";
import Header from "../../../components/Header";
import Aside from "../../../components/Aside";
import Card from "./components/Card";
import Table from "./components/Table";
import DateFilter from "./components/DateFilter";
import MultiSelect from "./components/MultiSelect";
import TicketTable from "./components/TicketTable";
import "../../../styles/Admin.css";
import "./Reports.css";

export default function Reports() {

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState("");


  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chamados, setChamados] = useState([]);


  const [sectorOptions, setSectorOptions] = useState([]);
  const [agentOptions, setAgentOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState({ sectors: true, agents: true });

  const api = import.meta.env.VITE_API_URL;


  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (startDate) params.append("sd", startDate + ":00");
        if (endDate) params.append("ed", endDate + ":00");
        departments.forEach((d) => params.append("d[]", d));
        agents.forEach((a) => params.append("a[]", a));
        if (search) params.append("s", search);

        const url = `${api}/api/reports?${params.toString()}`;
        const res = await fetch(url);
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(errText || "Erro ao carregar relatórios.");
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [api, startDate, endDate, departments, agents, search]);


  useEffect(() => {
    const fetchChamados = async () => {
      try {
        const res = await fetch(`${api}/api/chamados`);
        if (res.ok) {
          const data = await res.json();
          setChamados(data);
        }
      } catch (err) {
        console.error("Erro ao buscar chamados para o Aside:", err);
      }
    };
    fetchChamados();
  }, [api]);


  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const res = await fetch(`${api}/api/setores`);
        if (res.ok) {
          const data = await res.json();
          setSectorOptions(data);
        }
      } catch (err) {
        console.error("Erro ao buscar setores:", err);
      } finally {
        setLoadingOptions((prev) => ({ ...prev, sectors: false }));
      }
    };
    fetchSectors();
  }, [api]);


  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch(`${api}/api/perfis/setor/1`);
        if (res.ok) {
          const data = await res.json();
          setAgentOptions(data);
        }
      } catch (err) {
        console.error("Erro ao buscar técnicos:", err);
      } finally {
        setLoadingOptions((prev) => ({ ...prev, agents: false }));
      }
    };
    fetchAgents();
  }, [api]);

  const handleTryAgain = () => {
    setStartDate(null);
    setEndDate(null);
    setDepartments([]);
    setAgents([]);
    setSearch("");
  };


  const renderContent = () => {
    if (loading) {
      return <div className="reports-loading">Carregando relatórios...</div>;
    }
    if (error) {
      return (
        <div className="reports-error">
          <p>Erro: {error}</p>
          <button onClick={handleTryAgain} className="reports-retry-btn">
            Limpar filtros
          </button>
        </div>
      );
    }
    if (!data) {
      return <div className="reports-empty">Aplique filtros para carregar os dados.</div>;
    }

    const { summary, departments: deptData, agents: agentData, tickets } = data;


    const hasData = summary && (summary.total > 0 || summary.abertos > 0 || summary.fechados > 0);

    return (
      <>
        {hasData && (
          <>
            <div className="cards-grid">
              <Card label="Total" value={summary.total} color="#94a3b8" />
              <Card label="Abertos" value={summary.abertos} color="#fbbf24" />
              <Card label="Fechados" value={summary.fechados} color="#4ade80" />
            </div>

            <div className="tables-grid">
              <Table
                title="Chamados por Setor"
                headers={["Setor", "Total"]}
                keys={["nome", "total"]}
                rows={deptData || []}
              />
              <Table
                title="Resolvidos por Técnico"
                headers={["Técnico", "Resolvidos"]}
                keys={["nome", "resolvidos"]}
                rows={agentData || []}
              />
            </div>

            <TicketTable tickets={tickets || []} />
          </>
        )}

        {!hasData && (
          <div className="reports-empty">Nenhum dado encontrado para os filtros selecionados.</div>
        )}
      </>
    );
  };


  const getPeriodLabel = () => {
    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      return `${s.toLocaleDateString("pt-BR")} a ${e.toLocaleDateString("pt-BR")}`;
    }
    if (startDate) {
      const s = new Date(startDate);
      return `A partir de ${s.toLocaleDateString("pt-BR")}`;
    }
    if (endDate) {
      const e = new Date(endDate);
      return `Até ${e.toLocaleDateString("pt-BR")}`;
    }
    return "TODO PERÍODO";
  };

return (
  <>
    <Header isAdmin={true} userName="Informática" />

    <div className="layout-inferior">
      <Aside
        isAdmin={true}
        userName="Informática"
        chamados={chamados}
        onFiltroChange={() => {}}
      />

      <div className="conteudo-principal">
        <div className="page reports-page">
          <div className="chamados-header">
            <div className="reports-header-actions">
              <h1 className="titulo-chamados">
                RELATÓRIOS <span>/ {getPeriodLabel()}</span>
              </h1>
              <button
                className="btn-export-pdf"
                onClick={() => {
                  const filters = {
                    startDate,
                    endDate,
                    departments,
                    agents,
                    search,
                  };
                  generateAndDownloadPDF(
                    data,
                    filters,
                    `relatorio_${new Date().toISOString().slice(0, 10)}.pdf`
                  );
                }}
                disabled={!data}
              >
                Exportar PDF
              </button>
            </div>
            <hr />
          </div>

          <div className="reports-filters">
            <DateFilter
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />

            <div className="reports-selects">
              <MultiSelect
                label="Setores"
                options={sectorOptions}
                selected={departments}
                onChange={setDepartments}
                placeholder="Selecionar setores..."
                loading={loadingOptions.sectors}
              />

              <MultiSelect
                label="Técnicos"
                options={agentOptions}
                selected={agents}
                onChange={setAgents}
                placeholder="Selecionar técnicos..."
                loading={loadingOptions.agents}
              />
            </div>

            <div className="reports-search">
              <label className="reports-search-label">Palavras-chave</label>
              <input
                type="text"
                className="reports-search-input"
                placeholder="Palavras-chave separadas por espaço..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="reports-search-clear" onClick={() => setSearch("")}>
                  Limpar
                </button>
              )}
            </div>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  </>
);
}
