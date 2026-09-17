import { Bell, Shield, User, Database } from "lucide-react";

function Settings() {
  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <span className="breadcrumb">Settings</span>
          <h1>Settings</h1>
          <p>Manage your profile and workspace preferences.</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="detail-card">
          <div className="detail-card-header">
            <User size={20} />
            <h2>Profile</h2>
          </div>

          <div className="detail-list">
            <div>
              <span>Name</span>
              <strong>QA User</strong>
            </div>

            <div>
              <span>Role</span>
              <strong>Quality Assurance</strong>
            </div>

            <div>
              <span>Department</span>
              <strong>Pharmacovigilance & Quality</strong>
            </div>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-card-header">
            <Bell size={20} />
            <h2>Notifications</h2>
          </div>

          <div className="settings-toggle-list">
            <label className="settings-toggle">
              <span>Email me when a complaint is marked HIGH or CRITICAL risk</span>
              <input type="checkbox" defaultChecked />
            </label>

            <label className="settings-toggle">
              <span>Weekly quality summary digest</span>
              <input type="checkbox" defaultChecked />
            </label>

            <label className="settings-toggle">
              <span>Notify on CAPA recommendations pending review</span>
              <input type="checkbox" />
            </label>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-card-header">
            <Shield size={20} />
            <h2>AI Assistance</h2>
          </div>

          <div className="detail-list">
            <div>
              <span>Copilot model</span>
              <strong>Groq · configured via backend</strong>
            </div>

            <div>
              <span>Human review requirement</span>
              <strong>Always required before closure</strong>
            </div>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-card-header">
            <Database size={20} />
            <h2>Data Source</h2>
          </div>

          <div className="detail-list">
            <div>
              <span>API endpoint</span>
              <strong>http://localhost:8000/api</strong>
            </div>

            <div>
              <span>Storage</span>
              <strong>PostgreSQL</strong>
            </div>
          </div>
        </div>
      </div>

      <p className="settings-note">
        This is a preview settings panel — changes here are not yet
        persisted to the backend.
      </p>
    </div>
  );
}

export default Settings;
