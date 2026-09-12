import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:8000/api/complaints"
      );

      setComplaints(response.data.data);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="complaints-page">
      <div className="page-header">
        <div>
          <span className="breadcrumb">Complaints</span>
          <h1>Customer Complaints</h1>
          <p>
            View and manage pharmaceutical customer complaints.
          </p>
        </div>

        <button
          className="btn-secondary"
          onClick={fetchComplaints}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="complaints-card">
        {loading ? (
          <p className="empty-state">Loading complaints...</p>
        ) : complaints.length === 0 ? (
          <p className="empty-state">
            No complaints found.
          </p>
        ) : (
          <div className="table-wrapper">
            <table className="complaints-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Risk</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td>
                      <strong>#{complaint.id}</strong>
                    </td>

                    <td>
                      <div className="customer-cell">
                        <strong>
                          {complaint.customer_name || "Unknown"}
                        </strong>

                        <span>
                          {complaint.organization || "-"}
                        </span>
                      </div>
                    </td>

                    <td>
                      {complaint.product_name || "-"}
                    </td>

                    <td>
                      {complaint.category || "-"}
                    </td>

                    <td>
                      <span
                        className={`risk-badge ${
                          complaint.risk_level?.toLowerCase() || ""
                        }`}
                      >
                        {complaint.risk_level || "N/A"}
                      </span>
                    </td>

                    <td>
                      <span className="status-badge">
                        {complaint.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="icon-button"
                        onClick={() =>
                          navigate(
                            `/complaints/${complaint.id}`
                          )
                        }
                        title="View complaint"
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Complaints;