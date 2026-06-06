import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaCalendarCheck, FaLock, FaHospital } from "../utils/icons";
import "./Navbar.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/doctors", label: "Doctors" },
    { to: "/appointments", label: "Appointments" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

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
            <Link to="/admin-login" className="btn-hc-white hc-navbar__btn" title="Admin login">
              <FaLock size={14} aria-hidden="true" /> Admin
            </Link>
            <Link to="/book" className="btn-hc-white hc-navbar__btn hc-navbar__btn--primary" title="Book appointment">
              <FaCalendarCheck size={14} aria-hidden="true" /> Book Now
            </Link>
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
          <Link to="/book" className="btn-hc-white hc-navbar__mobile-cta">
            <FaCalendarCheck size={14} aria-hidden="true" /> Book Appointment
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
