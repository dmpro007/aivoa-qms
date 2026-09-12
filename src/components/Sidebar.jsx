import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  BarChart3,
  Settings,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="logo">
        <div className="logo-mark">A</div>

        <div>
          <h2>AIVOA</h2>
          <span>QMS</span>
        </div>
      </div>

      <nav className="sidebar-nav">

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/complaints"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <ClipboardList size={19} />
          <span>Complaints</span>
        </NavLink>

        <NavLink
          to="/complaints/new"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <PlusCircle size={19} />
          <span>New Complaint</span>
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <BarChart3 size={19} />
          <span>Reports</span>
        </NavLink>

      </nav>

      <div className="sidebar-bottom">

        <NavLink to="/settings" className="nav-item">
          <Settings size={19} />
          <span>Settings</span>
        </NavLink>

        <div className="user-profile">
          <div className="avatar">SD</div>

          <div>
            <strong>QA User</strong>
            <small>Quality Assurance</small>
          </div>
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;