export default function FilterButtons({ period, setPeriod }) {
  const options = [
    { value: "7", label: "Últimos 7 dias" },
    { value: "30", label: "Últimos 30 dias" },
    { value: "all", label: "Todo histórico" },
  ];

  return (
    <div className="filter-buttons">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={period === opt.value ? "filter-active" : "filter-inactive"}
          onClick={() => setPeriod(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
