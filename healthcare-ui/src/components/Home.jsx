import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import DoctorCard from "./DoctorCard";
import {
  FaHospital,
  FaPills,
  FaFlask,
  FaAmbulance,
  FaStethoscope,
  FaMobileAlt,
  FaUsers,
  FaUserMd,
  FaClock,
  FaSearch,
  FaCalendarCheck,
  FaComments,
  FaCheckCircle,
  FaStar,
  FaPlug,
  FaUser,
} from "../utils/icons";
import "./Home.css";

const SERVICES = [
  { icon: FaHospital, title: "General Consultation", desc: "Connect with experienced physicians for all health concerns." },
  { icon: FaPills, title: "Prescription & Meds", desc: "Get digital prescriptions and medication guidance instantly." },
  { icon: FaFlask, title: "Lab & Diagnostics", desc: "Book lab tests and get reports delivered digitally." },
  { icon: FaAmbulance, title: "Emergency Care", desc: "24/7 emergency care guidance and immediate doctor access." },
  { icon: FaStethoscope, title: "Specialist Connect", desc: "Consult specialists across 40+ medical specializations." },
  { icon: FaMobileAlt, title: "Teleconsultation", desc: "Video and chat consultations from the comfort of home." },
];

const STATS = [
  { value: "50K+", label: "Happy Patients", icon: FaUsers },
  { value: "500+", label: "Expert Doctors", icon: FaUserMd },
  { value: "40+", label: "Specializations", icon: FaStethoscope },
  { value: "24/7", label: "Always Available", icon: FaClock },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", role: "Patient", text: "Healthcare+ made it so easy to find the right specialist. Booked an appointment in under 2 minutes!", initial: "P" },
  { name: "Rajan Mehta", role: "Patient", text: "The best platform I've used. Doctors are responsive and the UI is incredibly simple to navigate.", initial: "R" },
  { name: "Anjali Gupta", role: "Patient", text: "I was able to consult a cardiologist the same day. Absolutely life-changing experience.", initial: "A" },
];

const HOW_STEPS = [
  { step: "01", icon: FaSearch, title: "Find a Doctor", desc: "Browse our network of verified specialists." },
  { step: "02", icon: FaCalendarCheck, title: "Book Appointment", desc: "Pick your preferred date and time slot." },
  { step: "03", icon: FaComments, title: "Get Consultation", desc: "Meet the doctor in-person or online." },
  { step: "04", icon: FaPills, title: "Stay Healthy", desc: "Follow the treatment plan and recover fast." },
];

function Home() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8080/api/doctors")
      .then((res) => setDoctors(res.data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home page-enter">
      <section className="hero">
        <div className="hero__bg-shapes">
          <div className="hero__shape hero__shape--1" />
          <div className="hero__shape hero__shape--2" />
          <div className="hero__shape hero__shape--3" />
        </div>
        <div className="container">
          <div className="hero__content">
            <div className="hero__left">
              <span className="hero__eyebrow">
                <FaHospital size={14} aria-hidden="true" /> India's Trusted Healthcare Platform
              </span>
              <h1 className="hero__headline">
                Your Health,<br />
                <span className="hero__headline--accent">Our Priority</span>
              </h1>
              <p className="hero__desc">
                Connect with 500+ verified doctors, book appointments instantly, and manage your entire healthcare journey in one place.
              </p>
              <div className="hero__actions">
                <Link to="/book" className="btn-hc-white">
                  <FaCalendarCheck size={16} aria-hidden="true" /> Book Appointment
                </Link>
                <Link to="/doctors" className="hero__ghost-btn">Find Doctors →</Link>
              </div>
              <div className="hero__trust">
                <div className="hero__avatars">
                  {["P", "R", "A", "S", "M"].map((initial, i) => (
                    <span key={i} className="hero__avatar-item" style={{ zIndex: 5 - i }}>{initial}</span>
                  ))}
                </div>
                <span className="hero__trust-text">Trusted by <strong>50,000+</strong> patients</span>
              </div>
            </div>
            <div className="hero__right">
              <div className="hero__card-wrap">
                <div className="hero__main-card">
                  <div className="hero__main-card-icon"><FaUserMd size={28} aria-hidden="true" /></div>
                  <div>
                    <div className="hero__main-card-title">Verified Doctors</div>
                    <div className="hero__main-card-sub">500+ specialists online</div>
                  </div>
                </div>
                <div className="hero__float-badge hero__float-badge--1">
                  <FaCheckCircle size={14} aria-hidden="true" /> Appointment Confirmed!
                </div>
                <div className="hero__float-badge hero__float-badge--2">
                  <FaStar size={14} aria-hidden="true" /> 4.9 Avg Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-stats section-sm">
        <div className="container">
          <div className="home-stats__grid">
            {STATS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="home-stats__item">
                  <span className="home-stats__icon"><Icon size={24} aria-hidden="true" /></span>
                  <div className="home-stats__value">{s.value}</div>
                  <div className="home-stats__label">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section home-section-alt">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge-pill badge-primary">Our Services</span>
            <h2 className="section-title mt-3">Comprehensive Healthcare<br />Services</h2>
            <div className="hc-divider" />
            <p className="section-subtitle mt-4">Everything you need for your health journey - all in one place.</p>
          </div>
          <div className="services-grid">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="service-card hc-card">
                  <div className="service-card__icon"><Icon size={26} aria-hidden="true" /></div>
                  <h5 className="service-card__title">{s.title}</h5>
                  <p className="service-card__desc">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge-pill badge-primary">Top Doctors</span>
            <h2 className="section-title mt-3">Meet Our Expert Specialists</h2>
            <div className="hc-divider" />
            <p className="section-subtitle mt-4">Highly qualified, experienced, and dedicated to your health.</p>
          </div>
          {loading ? (
            <div className="spinner-wrapper">
              <div className="hc-spinner" />
              <span style={{ color: "var(--gray-600)" }}>Loading doctors...</span>
            </div>
          ) : doctors.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><FaPlug size={32} /></div>
              <h4>Backend not connected</h4>
              <p>Start your Spring Boot server to see doctors here.</p>
            </div>
          ) : (
            <div className="doctors-grid">
              {doctors.map((doc, i) => <DoctorCard key={doc.id} doctor={doc} index={i} />)}
            </div>
          )}
          <div className="text-center mt-5">
            <Link to="/doctors" className="btn-hc-primary">View All Doctors →</Link>
          </div>
        </div>
      </section>

      <section className="section how-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge-pill badge-primary">Simple Process</span>
            <h2 className="section-title mt-3">How It Works</h2>
            <div className="hc-divider" />
          </div>
          <div className="how-grid">
            {HOW_STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="how-card">
                  <div className="how-card__step">{item.step}</div>
                  <div className="how-card__icon"><Icon size={24} aria-hidden="true" /></div>
                  <h5 className="how-card__title">{item.title}</h5>
                  <p className="how-card__desc">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section home-section-alt">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge-pill badge-success">Patient Stories</span>
            <h2 className="section-title mt-3">What Our Patients Say</h2>
            <div className="hc-divider" />
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card hc-card">
                <div className="testimonial-card__stars">{"★★★★★"}</div>
                <p className="testimonial-card__text">"{t.text}"</p>
                <div className="testimonial-card__author">
                  <span className="testimonial-card__avatar">{t.initial}</span>
                  <div>
                    <div className="testimonial-card__name">{t.name}</div>
                    <div className="testimonial-card__role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2 className="cta-box__title">Ready to Take Control<br />of Your Health?</h2>
            <p className="cta-box__desc">Book your first appointment today and experience healthcare like never before.</p>
            <div className="cta-box__actions">
              <Link to="/book" className="btn-hc-white">
                <FaCalendarCheck size={16} aria-hidden="true" /> Book Now - It's Free
              </Link>
              <Link to="/doctors" className="cta-box__link">Explore Doctors →</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
