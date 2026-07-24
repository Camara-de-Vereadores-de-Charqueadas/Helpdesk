import { useState, useEffect } from "react";

export default function DateFilter({ startDate, endDate, onStartDateChange, onEndDateChange }) {
  const [activePreset, setActivePreset] = useState(null);


  useEffect(() => {
    if (!startDate && !endDate) {
      setActivePreset("all");
    } else if (startDate && endDate) {

      const now = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffDays = Math.round((now - start) / (1000 * 60 * 60 * 24));
      

      const isEndNow = Math.abs(now - end) < 3600000;
      
      if (isEndNow && diffDays === 7) {
        setActivePreset("7");
      } else if (isEndNow && diffDays === 30) {
        setActivePreset("30");
      } else {
        setActivePreset("custom");
      }
    } else {
      setActivePreset("custom");
    }
  }, [startDate, endDate]);

  const applyPreset = (days) => {
    const now = new Date();
    const end = now.toISOString().slice(0, 16);
    const start = new Date(now);
    start.setDate(start.getDate() - days);
    const startStr = start.toISOString().slice(0, 16);
    
    onStartDateChange(startStr);
    onEndDateChange(end);
    setActivePreset(String(days));
  };

  const applyAll = () => {
    onStartDateChange(null);
    onEndDateChange(null);
    setActivePreset("all");
  };

  const presets = [
    { label: "Últimos 7 dias", value: "7" },
    { label: "Últimos 30 dias", value: "30" },
    { label: "Todo histórico", value: "all" },
  ];

  return (
    <div className="date-filter">
      <div className="date-filter-presets">
        {presets.map((p) => (
          <button
            key={p.value}
            className={activePreset === p.value ? "filter-active" : "filter-inactive"}
            onClick={() => p.value === "all" ? applyAll() : applyPreset(parseInt(p.value))}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="date-filter-custom">
        <label className="date-filter-label">De:</label>
        <input
          type="datetime-local"
          className="date-filter-input"
          value={startDate || ""}
          onChange={(e) => {
            onStartDateChange(e.target.value || null);
            if (e.target.value) setActivePreset("custom");
          }}
        />
        <label className="date-filter-label">Até:</label>
        <input
          type="datetime-local"
          className="date-filter-input"
          value={endDate || ""}
          onChange={(e) => {
            onEndDateChange(e.target.value || null);
            if (e.target.value) setActivePreset("custom");
          }}
        />
      </div>
    </div>
  );
}
