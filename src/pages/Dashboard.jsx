import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, RefreshCw, ArrowUpRight } from "lucide-react";

import DashboardCards from "../components/DashboardCards";
import ComplaintTable from "../components/ComplaintTable";
import { getComplaints, getComplaintStats } from "../services/complaintApi";

function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [complaintsRes, statsRes] = await Promise.all([
        getComplaints(),
        getComplaintStats(),
      ]);

      setComplaints(complaintsRes.data || []);
      setStats(statsRes.data || null);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError(
        "Unable to reach the AIVOA API. Make sure the backend is running on port 8000."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const recentComplaints = complaints.slice(0, 6);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <span className="breadcrumb">Overview</span>
          <h1>Quality Dashboard</h1>
          <p>
            A real-time view of pharmaceutical customer complaints and
            AI-assisted quality assessments.
          </p>
        </div>

        <div className="page-header-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={loadData}
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

      {error && <div className="ai-error dashboard-error">{error}</div>}

      <DashboardCards stats={stats} loading={loading} />

      <div className="complaints-card">
        <div className="card-header-row">
          <div>
            <h2>Recent Complaints</h2>
            <p>The latest complaints logged into the system.</p>
          </div>

          <Link to="/complaints" className="link-button">
            View all
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {loading ? (
          <p className="empty-state">Loading complaints...</p>
        ) : (
          <ComplaintTable complaints={recentComplaints} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
