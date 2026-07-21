export default function Card({ label, value, color = "#94a3b8" }) {
  return (
    <div className="report-card" style={{ borderLeftColor: color }}>
      <span className="report-card-value">{value}</span>
      <span className="report-card-label">{label}</span>
    </div>
  );
};
