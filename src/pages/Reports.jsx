import { useEffect, useMemo, useState } from "react";
import { RefreshCw, PieChart, ShieldAlert } from "lucide-react";

import { getComplaints } from "../services/complaintApi";

const RISK_COLORS = {
  LOW: "#36a269",
  MEDIUM: "#d9a441",
  HIGH: "#d9772f",
  CRITICAL: "#c0392b",
};

function buildBreakdown(complaints, key) {
  const counts = {};

  complaints.forEach((complaint) => {
    const value = complaint[key] || "Unspecified";
    counts[value] = (counts[value] || 0) + 1;
  });

  const total = complaints.length || 1;

  return Object.entries(counts)
    .map(([label, count]) => ({
      label,
      count,
      pct: Math.round((count / total) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

function Reports() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getComplaints();
      setComplaints(response.data || []);
    } catch (err) {
      console.error("Failed to fetch report data:", err);
      setError(
        "Unable to reach the AIVOA API. Make sure the backend is running on port 8000."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const riskBreakdown = useMemo(
    () => buildBreakdown(complaints, "risk_level"),
    [complaints]
  );

  const categoryBreakdown = useMemo(
    () => buildBreakdown(complaints, "category"),
    [complaints]
  );

  return (
    <div className="reports-page">
      <div className="page-header">
        <div>
          <span className="breadcrumb">Reports</span>
          <h1>Quality Analytics</h1>
          <p>
            A breakdown of logged complaints by risk level and complaint
            category.
          </p>
        </div>

        <button type="button" className="btn-secondary" onClick={load}>
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && <div className="ai-error dashboard-error">{error}</div>}

      <div className="reports-grid">
        <div className="report-card">
          <div className="detail-card-header">
            <ShieldAlert size={20} />
            <h2>By Risk Level</h2>
          </div>

          {loading ? (
            <p className="empty-state">Loading...</p>
          ) : riskBreakdown.length === 0 ? (
            <p className="empty-state">No data yet.</p>
          ) : (
            <div className="bar-list">
              {riskBreakdown.map((row) => (
                <div className="bar-row" key={row.label}>
                  <div className="bar-row-label">
                    <span>{row.label}</span>
                    <span>
                      {row.count} · {row.pct}%
                    </span>
                  </div>

                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${row.pct}%`,
                        background:
                          RISK_COLORS[row.label] || "#7b8798",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="report-card">
          <div className="detail-card-header">
            <PieChart size={20} />
            <h2>By Complaint Category</h2>
          </div>

          {loading ? (
            <p className="empty-state">Loading...</p>
          ) : categoryBreakdown.length === 0 ? (
            <p className="empty-state">No data yet.</p>
          ) : (
            <div className="bar-list">
              {categoryBreakdown.map((row) => (
                <div className="bar-row" key={row.label}>
                  <div className="bar-row-label">
                    <span>{row.label}</span>
                    <span>
                      {row.count} · {row.pct}%
                    </span>
                  </div>

                  <div className="bar-track">
                    <div
                      className="bar-fill category-fill"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;
