import { Link } from "react-router-dom";
import { FaHospital, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from "../utils/icons";
import "./Footer.css";

function Footer() {
  return (
    <footer className="hc-footer">
      <div className="hc-footer__wave">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 30C240 60 480 0 720 30C960 60 1200 0 1440 30V60H0V30Z" fill="#0f172a"/>
        </svg>
      </div>

      <div className="hc-footer__body">
        <div className="container">
          <div className="hc-footer__grid">
            <div className="hc-footer__brand-col">
              <Link to="/" className="hc-footer__brand" aria-label="Healthcare+ Home">
                <div className="hc-footer__logo">
                  <FaHospital size={18} aria-hidden="true" />
                </div>
                Healthcare+
              </Link>
              <p className="hc-footer__tagline">
                Your trusted partner for seamless healthcare access. Connecting patients with the best doctors.
              </p>
            </div>

            <div>
              <h5 className="hc-footer__heading">Quick Links</h5>
              <ul className="hc-footer__list">
                {[
                  ["/", "Home"],
                  ["/doctors", "Find Doctors"],
                  ["/book", "Book Appointment"],
                  ["/appointments", "My Appointments"],
                  ["/admin-dashboard", "Admin Dashboard"],
                ].map(([to, label]) => (
                  <li key={to}><Link to={to} className="hc-footer__link">{label}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="hc-footer__heading">Specializations</h5>
              <ul className="hc-footer__list">
                {["Cardiology","Dermatology","Neurology","Orthopedics","Pediatrics","Oncology"].map(s => (
                  <li key={s}><Link to="/doctors" className="hc-footer__link">{s}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="hc-footer__heading">Contact Us</h5>
              <div className="hc-footer__contact-list">
                {[
                  [FaMapMarkerAlt, "123 Health Ave, Medical City"],
                  [FaPhone, "+91 98765 43210"],
                  [FaEnvelope, "care@healthcareplus.in"],
                  [FaClock, "24/7 Available"],
                ].map(([Icon, text]) => (
                  <div key={text} className="hc-footer__contact-item">
                    <Icon size={14} aria-hidden="true" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hc-footer__bottom">
            <p>© 2026 Healthcare+. All rights reserved.</p>
            <div className="hc-footer__bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
