import {
    ClipboardList,
    ShieldAlert,
    Clock,
    BadgeCheck,
  } from "lucide-react";
  
  function DashboardCards({ stats, loading }) {
    const cards = [
      {
        key: "total",
        label: "Total Complaints",
        value: stats?.total ?? 0,
        icon: ClipboardList,
        tone: "neutral",
        hint: "All time",
      },
      {
        key: "open",
        label: "Open Complaints",
        value: stats?.open ?? 0,
        icon: Clock,
        tone: "warning",
        hint: "Awaiting closure",
      },
      {
        key: "high_risk",
        label: "High / Critical Risk",
        value: stats?.high_risk ?? 0,
        icon: ShieldAlert,
        tone: "danger",
        hint: "Needs priority review",
      },
      {
        key: "average_completeness",
        label: "Avg. Completeness",
        value: `${stats?.average_completeness ?? 0}%`,
        icon: BadgeCheck,
        tone: "success",
        hint: "Across all records",
      },
    ];
  
    return (
      <div className="stat-grid">
        {cards.map((card) => (
          <div className="stat-card" key={card.key}>
            <div className={`stat-icon tone-${card.tone}`}>
              <card.icon size={19} />
            </div>
  
            <div className="stat-body">
              <span className="stat-label">{card.label}</span>
  
              <strong className="stat-value">
                {loading ? "—" : card.value}
              </strong>
  
              <span className="stat-hint">{card.hint}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  export default DashboardCards;
  