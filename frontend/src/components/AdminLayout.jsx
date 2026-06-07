import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaUserMd,
  FaCalendarCheck,
  FaEnvelope,
  FaSignOutAlt,
  FaHospital,
  FaTimes,
} from "../utils/icons";
import "./AdminLayout.css";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out from the portal?")) {
      localStorage.removeItem("admin");
      navigate("/");
    }
  };

  const menuItems = [
    { to: "/admin-dashboard", label: "Dashboard", icon: <FaChartBar size={18} /> },
    { to: "/admin/doctors", label: "Manage Doctors", icon: <FaUserMd size={18} /> },
    { to: "/admin/appointments", label: "Manage Appointments", icon: <FaCalendarCheck size={18} /> },
    { to: "/admin/messages", label: "Contact Messages", icon: <FaEnvelope size={18} /> },
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Header Bar */}
      <div className="admin-mobile-bar">
        <Link to="/admin-dashboard" className="admin-mobile-bar__brand">
          <div className="admin-mobile-bar__logo">
            <FaHospital size={16} />
          </div>
          <span>Staff Portal</span>
        </Link>
        <button
          className={`admin-hamburger ${sidebarOpen ? "open" : ""}`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar menu"
          aria-expanded={sidebarOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${sidebarOpen ? "admin-sidebar--open" : ""}`}>
        <div className="admin-sidebar__brand-container">
          <Link to="/" className="admin-sidebar__brand">
            <div className="admin-sidebar__logo">
              <FaHospital size={22} />
            </div>
            <div>
              <span className="admin-sidebar__name">Healthcare<span className="admin-sidebar__plus">+</span></span>
              <small className="admin-sidebar__tag">Staff Portal</small>
            </div>
          </Link>
        </div>

        <nav className="admin-sidebar__nav" aria-label="Staff navigation">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `admin-sidebar__link ${isActive ? "admin-sidebar__link--active" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-sidebar__link-icon" aria-hidden="true">{item.icon}</span>
              <span className="admin-sidebar__link-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <button
            className="admin-sidebar__logout-btn"
            onClick={handleLogout}
            title="Log out from staff portal"
          >
            <FaSignOutAlt size={18} aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay for closing sidebar on mobile */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Page Content Panel */}
      <div className="admin-layout__content">
        <main className="admin-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
