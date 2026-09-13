import { Link } from "react-router-dom";

function Complaints() {
  return (
    <div className="complaints-page">
      <div className="page-header">
        <div>
          <span className="breadcrumb">
            Complaints
          </span>

          <h1>Customer Complaints</h1>

          <p>
            View and manage pharmaceutical customer complaints.
          </p>
        </div>
      </div>

      <div className="complaints-card">
        <h2>Complaint #1</h2>

        <p>
          Test complaint record
        </p>

        <Link
          to="/complaints/1"
          className="primary-button"
        >
          View Complaint
        </Link>
      </div>
    </div>
  );
}

export default Complaints;