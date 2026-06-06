import "./StatCard.css";

function StatCard({ icon, label, value, color = "blue", trend }) {
  const colorMap = {
    blue: { bg: "#dbeafe", text: "#1a56db", border: "#1a56db" },
    green: { bg: "#d1fae5", text: "#059669", border: "#059669" },
    purple: { bg: "#ede9fe", text: "#7c3aed", border: "#7c3aed" },
    orange: { bg: "#fef3c7", text: "#b45309", border: "#b45309" },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="stat-card hc-card hc-card--static">
      <div className="stat-card__icon" style={{ background: c.bg, color: c.text }}>
        {icon}
      </div>
      <div className="stat-card__content">
        <div className="stat-card__value">{value}</div>
        <div className="stat-card__label">{label}</div>
        {trend && <div className="stat-card__trend">{trend}</div>}
      </div>
      <div className="stat-card__bar" style={{ background: c.border }} />
    </div>
  );
}

export default StatCard;
