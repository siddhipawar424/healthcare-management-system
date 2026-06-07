import { Link } from "react-router-dom";
import {
  FaHospital,
  FaUserMd,
  FaUsers,
  FaHeart,
  FaFlask,
  FaLock,
  FaRocket,
  FaCalendarCheck,
} from "../utils/icons";
import "./About.css";

const TEAM = [
  { name: "Dr. Arjun Sharma", role: "Chief Medical Officer", initial: "A", spec: "Cardiology" },
  { name: "Priya Mehta", role: "Product Director", initial: "P", spec: "Healthcare Tech" },
  { name: "Dr. Neha Gupta", role: "Lead Physician", initial: "N", spec: "Neurology" },
  { name: "Rahul Verma", role: "CTO", initial: "R", spec: "Software Engineering" },
];

const VALUES = [
  { icon: FaHeart, title: "Compassion", desc: "Every patient is treated with empathy, dignity, and genuine care." },
  { icon: FaFlask, title: "Excellence", desc: "We hold the highest standards in medical practice and technology." },
  { icon: FaLock, title: "Trust", desc: "Privacy, security, and transparency are at the core of everything we do." },
  { icon: FaRocket, title: "Innovation", desc: "We leverage cutting-edge technology to improve healthcare access." },
];

function About() {
  return (
    <div className="page-enter">
      <div className="about-header">
        <div className="container">
          <span className="badge-pill about-header__badge">
            <FaHospital size={14} aria-hidden="true" /> Our Story
          </span>
          <h1 className="section-title mt-3" style={{ color: "white" }}>About Healthcare+</h1>
          <div className="hc-divider" style={{ margin: "16px auto 0" }} />
          <p className="about-header__sub">
            Reimagining healthcare delivery through technology, compassion, and innovation.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="about-mission-grid">
            <div>
              <span className="badge-pill badge-primary">Our Mission</span>
              <h2 className="section-title mt-3">Making Quality Healthcare<br />Accessible to Everyone</h2>
              <p className="about-text mt-4">
                Healthcare+ was founded with a simple vision: no one should struggle to access quality medical care. We connect patients with top-tier doctors, streamline the appointment process, and provide a seamless digital healthcare experience.
              </p>
              <p className="about-text mt-3">
                Since our founding, we've helped over 50,000 patients connect with 500+ verified specialists across 40+ medical disciplines — all through an intuitive, secure platform.
              </p>
              <Link to="/book" className="btn-hc-primary about-cta">
                <FaCalendarCheck size={16} aria-hidden="true" /> Book Your Appointment
              </Link>
            </div>
            <div className="about-mission-visual">
              <div className="about-mission-card">
                <div className="about-mission-icon"><FaHospital size={40} aria-hidden="true" /></div>
                <h3 className="about-mission-title">Healthcare+</h3>
                <p className="about-mission-desc">Transforming healthcare, one appointment at a time.</p>
                <div className="about-mission-stats">
                  {[["50K+","Patients"],["500+","Doctors"],["40+","Specialties"]].map(([val, lab]) => (
                    <div key={lab} className="about-mission-stat">
                      <div className="about-mission-stat-val">{val}</div>
                      <div className="about-mission-stat-lab">{lab}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section about-section-alt">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge-pill badge-primary">What We Stand For</span>
            <h2 className="section-title mt-3">Our Core Values</h2>
            <div className="hc-divider" />
          </div>
          <div className="about-values-grid">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="hc-card about-value-card">
                  <div className="about-value-icon"><Icon size={24} aria-hidden="true" /></div>
                  <h5>{v.title}</h5>
                  <p>{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge-pill badge-primary">The People</span>
            <h2 className="section-title mt-3">Meet Our Leadership</h2>
            <div className="hc-divider" />
          </div>
          <div className="about-team-grid">
            {TEAM.map((member) => (
              <div key={member.name} className="hc-card about-team-card">
                <div className="about-team-avatar">{member.initial}</div>
                <h5>{member.name}</h5>
                <p className="about-team-role">{member.role}</p>
                <span className="badge-pill badge-primary about-team-spec">{member.spec}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
