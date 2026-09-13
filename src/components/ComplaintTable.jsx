import React from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";


function ComplaintTable({ complaints = [] }) {
  const navigate = useNavigate();

  const handleView = (id) => {
    navigate(`/complaints/${id}`);
  };

  if (complaints.length === 0) {
    return (
      <div className="empty-state">
        <p>No complaints found.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
        {/* <ComplaintTable complaints={complaints} /> */}
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
                  {complaint.status || "Draft"}
                </span>
              </td>

              <td>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => handleView(complaint.id)}
                  title="View complaint"
                >
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ComplaintTable;
