import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, RefreshCw, Search } from "lucide-react";

import ComplaintTable from "../components/ComplaintTable";
import { getComplaints } from "../services/complaintApi";

const RISK_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");

  const navigate = useNavigate();

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getComplaints();

      setComplaints(response.data || []);
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
      setError(
        "Unable to reach the AIVOA API. Make sure the backend is running on port 8000."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesRisk =
        riskFilter === "ALL" ||
        (complaint.risk_level || "").toUpperCase() === riskFilter;

      if (!matchesRisk) return false;

      if (!query.trim()) return true;

      const haystack = [
        complaint.customer_name,
        complaint.organization,
        complaint.product_name,
        complaint.category,
        `#${complaint.id}`,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query.trim().toLowerCase());
    });
  }, [complaints, query, riskFilter]);

  return (
    <div className="complaints-page">
      <div className="page-header">
        <div>
          <span className="breadcrumb">Complaints</span>
          <h1>Customer Complaints</h1>
          <p>View and manage pharmaceutical customer complaints.</p>
        </div>

        <div className="page-header-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={fetchComplaints}
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate("/complaints/new")}
          >
            <PlusCircle size={16} />
            New Complaint
          </button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-field">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by customer, product, category or ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="filter-chips">
          <button
            type="button"
            className={riskFilter === "ALL" ? "chip active" : "chip"}
            onClick={() => setRiskFilter("ALL")}
          >
            All
          </button>

          {RISK_LEVELS.map((level) => (
            <button
              type="button"
              key={level}
              className={
                riskFilter === level ? `chip active ${level.toLowerCase()}` : "chip"
              }
              onClick={() => setRiskFilter(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="complaints-card">
        {error ? (
          <p className="empty-state">{error}</p>
        ) : loading ? (
          <p className="empty-state">Loading complaints...</p>
        ) : filteredComplaints.length === 0 ? (
          <p className="empty-state">
            {complaints.length === 0
              ? "No complaints found. Log your first complaint to get started."
              : "No complaints match your search or filter."}
          </p>
        ) : (
          <ComplaintTable complaints={filteredComplaints} />
        )}
      </div>
    </div>
  );
}

export default Complaints;
