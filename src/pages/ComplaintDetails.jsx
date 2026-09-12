// function ComplaintDetails() {
//     return (
//       <div>
//         <h1>Complaint Details</h1>
//       </div>
//     );
//   }
  
//   export default ComplaintDetails;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  FileText,
  Search,
  Wrench,
} from "lucide-react";
import axios from "axios";

function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `http://localhost:8000/api/complaints/${id}`
        );

        setComplaint(response.data.data);
      } catch (err) {
        console.error("Failed to fetch complaint:", err);
        setError("Unable to load complaint.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  if (loading) {
    return (
      <div className="complaint-details-page">
        <p>Loading complaint...</p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="complaint-details-page">
        <button
          className="btn-secondary"
          onClick={() => navigate("/complaints")}
        >
          <ArrowLeft size={16} />
          Back to Complaints
        </button>

        <h1>{error || "Complaint not found"}</h1>
      </div>
    );
  }

  return (
    <div className="complaint-details-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <span className="breadcrumb">
            Complaints / #{complaint.id}
          </span>

          <h1>Complaint #{complaint.id}</h1>

          <p>
            Complete complaint record and AI quality assessment.
          </p>
        </div>

        <button
          className="btn-secondary"
          onClick={() => navigate("/complaints")}
        >
          <ArrowLeft size={16} />
          Back to Complaints
        </button>
      </div>

      {/* Basic Information */}
      <div className="details-grid">

        <div className="detail-card">
          <div className="detail-card-header">
            <FileText size={20} />
            <h2>Complaint Information</h2>
          </div>

          <div className="detail-list">
            <div>
              <span>Complaint ID</span>
              <strong>#{complaint.id}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{complaint.status}</strong>
            </div>

            <div>
              <span>Category</span>
              <strong>
                {complaint.category || "Not specified"}
              </strong>
            </div>

            <div>
              <span>Created</span>
              <strong>
                {complaint.created_at
                  ? new Date(
                      complaint.created_at
                    ).toLocaleString()
                  : "N/A"}
              </strong>
            </div>
          </div>
        </div>

        {/* Risk */}
        <div className="detail-card">
          <div className="detail-card-header">
            <ShieldAlert size={20} />
            <h2>Risk Assessment</h2>
          </div>

          <div className="risk-detail">
            <div>
              <span>Risk Level</span>

              <strong
                className={`risk-badge ${
                  complaint.risk_level?.toLowerCase() || ""
                }`}
              >
                {complaint.risk_level || "N/A"}
              </strong>
            </div>

            <div>
              <span>Risk Score</span>
              <strong>
                {complaint.risk_score ?? "N/A"} / 100
              </strong>
            </div>
          </div>

          <div className="assessment-section">
            <h3>Risk Reason</h3>

            <p>
              {complaint.risk_reason ||
                "No risk reasoning available."}
            </p>
          </div>
        </div>

      </div>

      {/* Customer + Product */}
      <div className="details-grid">

        <div className="detail-card">
          <div className="detail-card-header">
            <FileText size={20} />
            <h2>Customer Information</h2>
          </div>

          <div className="detail-list">
            <div>
              <span>Name</span>
              <strong>
                {complaint.customer_name || "N/A"}
              </strong>
            </div>

            <div>
              <span>Organization</span>
              <strong>
                {complaint.organization || "N/A"}
              </strong>
            </div>

            <div>
              <span>Email</span>
              <strong>
                {complaint.email || "N/A"}
              </strong>
            </div>

            <div>
              <span>Country</span>
              <strong>
                {complaint.country || "N/A"}
              </strong>
            </div>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-card-header">
            <FileText size={20} />
            <h2>Product Information</h2>
          </div>

          <div className="detail-list">
            <div>
              <span>Product</span>
              <strong>
                {complaint.product_name || "N/A"}
              </strong>
            </div>

            <div>
              <span>Material Type</span>
              <strong>
                {complaint.material_type || "N/A"}
              </strong>
            </div>

            <div>
              <span>Dosage Form</span>
              <strong>
                {complaint.dosage_form || "N/A"}
              </strong>
            </div>

            <div>
              <span>Strength</span>
              <strong>
                {complaint.strength || "N/A"}
              </strong>
            </div>

            <div>
              <span>Batch Number</span>
              <strong>
                {complaint.batch_number || "N/A"}
              </strong>
            </div>
          </div>
        </div>

      </div>

      {/* Complaint Description */}
      <div className="detail-card full-width">
        <div className="detail-card-header">
          <AlertTriangle size={20} />
          <h2>Complaint Description</h2>
        </div>

        <p className="complaint-description">
          {complaint.description ||
            "No complaint description available."}
        </p>
      </div>

      {/* AI Assessment */}
      <div className="detail-card full-width">

        <div className="detail-card-header">
          <CheckCircle size={20} />
          <h2>AI Quality Assessment</h2>
        </div>

        <div className="assessment-grid">

          <div className="assessment-card">
            <h3>Completeness</h3>

            <strong>
              {complaint.completeness_score ?? 0}%
            </strong>
          </div>

          <div className="assessment-card">
            <h3>Risk Score</h3>

            <strong>
              {complaint.risk_score ?? 0}/100
            </strong>
          </div>

        </div>

        <div className="assessment-section">
          <h3>Complaint Summary</h3>

          <p>
            {complaint.summary ||
              "No summary available."}
          </p>
        </div>

      </div>

      {/* Root Cause */}
      <div className="detail-card full-width">

        <div className="detail-card-header">
          <Search size={20} />
          <h2>Potential Root Causes</h2>
        </div>

        {complaint.root_cause_suggestions?.length > 0 ? (
          <ul className="recommendation-list">
            {complaint.root_cause_suggestions.map(
              (cause, index) => (
                <li key={index}>{cause}</li>
              )
            )}
          </ul>
        ) : (
          <p>No root cause suggestions available.</p>
        )}

      </div>

      {/* CAPA */}
      <div className="detail-card full-width">

        <div className="detail-card-header">
          <Wrench size={20} />
          <h2>Preliminary CAPA Recommendations</h2>
        </div>

        {complaint.capa_recommendations?.length > 0 ? (
          <ul className="recommendation-list">
            {complaint.capa_recommendations.map(
              (recommendation, index) => (
                <li key={index}>
                  {recommendation}
                </li>
              )
            )}
          </ul>
        ) : (
          <p>No CAPA recommendations available.</p>
        )}

      </div>

      {/* Human Review */}
      <div className="human-review-note">
        <AlertTriangle size={18} />

        <div>
          <strong>Human Review Required</strong>

          <p>
            AI-generated risk assessment, root causes,
            and CAPA recommendations are preliminary.
            Final decisions must be reviewed and approved
            by qualified QA personnel.
          </p>
        </div>
      </div>

    </div>
  );
}

export default ComplaintDetails;