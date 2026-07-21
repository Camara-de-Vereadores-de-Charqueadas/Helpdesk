export default function Table({ title, headers, keys, rows }) {
  return (
    <div className="report-table-wrapper">
      <h3 className="report-table-title">{title}</h3>
      <table className="report-table">
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="report-table-empty">
                Nenhum dado disponível
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={idx}>
                {keys.map((key, kIdx) => (
                  <td key={kIdx}>{row[key]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
