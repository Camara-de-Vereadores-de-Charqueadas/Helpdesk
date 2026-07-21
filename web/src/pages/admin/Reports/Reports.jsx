import { useState, useEffect } from "react";
import Card from "./components/Card.jsx";
import Table from "./components/Table.jsx";
import FilterButtons from "./components/FilterButtons.jsx";
import "./Reports.css";

export default function Reports() {
  const [period, setPeriod] = useState("7");
  const [data, setDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
	const fetchReports = async () => {
	  setLoading(true);
	  setError(null);

	  try {
	  	const res = await fetch(`{api}/api/reports?period=${period}`);
		if (!res.ok) {
		  const errText = await res.text();
		  throw new Error(errText || "Erro ao carregar relatórios.");
		}
		const json = await res.json();

		setData(json);
	  } catch (error) {
	  	setError(err.message);
	  } finally {
		setLoading(false);
	  }
	};

	fetchReports();
  }, [period]);

  const handleTry = () => {
	setPeriod();
  };

  if (loading) {
	return (
	  <div className="reports-container">
		<div className="reports-loading">Carregando relatórios...</div>
	  </div>
	);
  };

  if (error) {
	return (
	  <div className="reports-container">
		<div className="reports-error">
		  <p>Erro: {error}</p>
		  <button onClick={handleTry} className="reports-retry-btn">
			Tentar novamente
		  </button>
		</div>	  
	  </div>
	);  
  };

  if (!data) {
	return (
	  <div className="reports-container">
		<div className="reports-empty">Sem nenhum data state. A API está ativa?</div>
	  </div>
	);
  };

  const { summary, departments, agents } = data;

  return (
	<div className="reports-container">
	  <FilterButtons period={period} setPeriod={setPeriod} />

	  <div className="cards-grid">
		<Card label="Total" value={summary.total} color="#94a3b8" />
		<Card label="Abertos" value={summary.abertos} color="#fbbf24" />
		<Card label="Em andamento" value={summary.emAndamento} color="#fb923c" />
		<Card label="Fechados" value={summary.fechados} color="#4ade80" />
	  </div>

	  <div className="tables-grid">
		<Table
		  title="Chamados por Setor"
		  headers={["Setor", "Total"]}
		  keys={["nome", "total"]}
		  rows={departments}
		/>
	  </div>
	</div>
  );
}
