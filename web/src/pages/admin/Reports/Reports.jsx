import { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Aside from "../../../components/Aside";
import Card from "./components/Card";
import Table from "./components/Table";
import FilterButtons from "./components/FilterButtons";
import "../../../styles/Admin.css";
import "./Reports.css"; 

export default function Reports() {
  const [period, setPeriod] = useState("7");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chamados, setChamados] = useState([]);

  const api = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${api}/api/reports?period=${period}`);
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
  }, [period, api]);

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

  const handleTryAgain = () => setPeriod("7");

  const periodLabel = period === "all" ? "TODO PERÍODO" : `ÚLTIMOS ${period} DIAS`;

  const renderContent = () => {
    if (loading) {
      return <div className="reports-loading">Carregando relatórios...</div>;
    }
    if (error) {
      return (
        <div className="reports-error">
          <p>Erro: {error}</p>
          <button onClick={handleTryAgain} className="reports-retry-btn">
            Tentar novamente
          </button>
        </div>
      );
    }
    if (!data) {
      return <div className="reports-empty">Sem dados. A API está ativa?</div>;
    }

    const { summary, departments, agents } = data;

    return (
      <>
        <FilterButtons period={period} setPeriod={setPeriod} />

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
            rows={departments}
          />
          <Table
            title="Resolvidos por Técnico"
            headers={["Técnico", "Resolvidos"]}
            keys={["nome", "resolvidos"]}
            rows={agents}
          />
        </div>
      </>
    );
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
              <h1 className="titulo-chamados">
                RELATÓRIOS <span>/ {periodLabel}</span>
              </h1>
              <hr />
            </div>
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
}
