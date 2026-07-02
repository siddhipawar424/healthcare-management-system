import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCalendarCheck, FaLock, FaHospital, FaSignOutAlt, FaUser } from "../utils/icons";
import "./Navbar.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("admin");
      navigate("/");
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/doctors", label: "Doctors" },
  ];

  if (token) {
    if (role === "ADMIN") {
      navLinks.push({ to: "/admin-dashboard", label: "Dashboard" });
    } else {
      navLinks.push({ to: "/appointments", label: "My Appointments" });
    }
  }

  navLinks.push({ to: "/about", label: "About" });
  navLinks.push({ to: "/contact", label: "Contact" });

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <nav className={`hc-navbar ${scrolled ? "hc-navbar--scrolled" : ""}`} aria-label="Main navigation">
      <div className="container">
        <div className="hc-navbar__inner">
          <Link to="/" className="hc-navbar__brand" aria-label="Healthcare+ Home">
            <div className="hc-navbar__logo">
              <FaHospital size={20} aria-hidden="true" />
            </div>
            <span>Healthcare<span className="hc-navbar__plus">+</span></span>
          </Link>

          <ul className="hc-navbar__links">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`hc-navbar__link ${isActive(link.to) ? "hc-navbar__link--active" : ""}`}
                  aria-current={isActive(link.to) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hc-navbar__cta">
            {token ? (
              <>
                <span className="navbar-username" style={{ color: scrolled ? "var(--dark)" : "white", marginRight: "10px", fontWeight: "600", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <FaUser size={12} /> {name}
                </span>
                <button onClick={handleLogout} className="btn-hc-white hc-navbar__btn" style={{ padding: "8px 20px" }} title="Logout">
                  <FaSignOutAlt size={14} aria-hidden="true" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-hc-white hc-navbar__btn" style={{ padding: "8px 20px" }} title="Sign In">
                  <FaLock size={14} aria-hidden="true" /> Login
                </Link>
                <Link to="/register" className="btn-hc-white hc-navbar__btn hc-navbar__btn--primary" style={{ padding: "8px 20px" }} title="Register">
                  Register
                </Link>
              </>
            )}
            {(!token || role !== "ADMIN") && (
              <Link to="/book" className="btn-hc-white hc-navbar__btn hc-navbar__btn--primary" style={{ padding: "8px 20px", marginLeft: "8px" }} title="Book appointment">
                <FaCalendarCheck size={14} aria-hidden="true" /> Book Now
              </Link>
            )}
          </div>

          <button
            className={`hc-navbar__hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>

        <div className={`hc-navbar__mobile ${menuOpen ? "hc-navbar__mobile--open" : ""}`}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`hc-navbar__mobile-link ${isActive(link.to) ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
          {token ? (
            <>
              <div className="navbar-username-mobile" style={{ color: "var(--dark)", padding: "10px 16px", fontWeight: "600", borderBottom: "1px solid var(--gray-100)" }}>
                <FaUser size={14} style={{ marginRight: "6px" }} /> {name} ({role === "ADMIN" ? "Doctor" : "Patient"})
              </div>
              {role !== "ADMIN" && (
                <Link to="/book" className="btn-hc-white hc-navbar__mobile-cta" style={{ margin: "12px 16px 4px" }}>
                  <FaCalendarCheck size={14} aria-hidden="true" /> Book Appointment
                </Link>
              )}
              <button onClick={handleLogout} className="btn-hc-white hc-navbar__mobile-cta" style={{ background: "var(--danger)", color: "white", width: "calc(100% - 32px)", margin: "8px 16px" }}>
                <FaSignOutAlt size={14} aria-hidden="true" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-hc-white hc-navbar__mobile-cta" style={{ margin: "12px 16px 4px" }}>
                <FaLock size={14} aria-hidden="true" /> Login
              </Link>
              <Link to="/register" className="btn-hc-white hc-navbar__mobile-cta" style={{ margin: "4px 16px 8px" }}>
                Register
              </Link>
              <Link to="/book" className="btn-hc-white hc-navbar__mobile-cta" style={{ margin: "4px 16px 12px" }}>
                <FaCalendarCheck size={14} aria-hidden="true" /> Book Appointment
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
