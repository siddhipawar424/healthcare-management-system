import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  FaUserMd,
  FaCheckCircle,
  FaStar,
  FaUsers,
  FaCalendarCheck,
  FaMapMarkerAlt,
  FaClock,
  FaComments,
  FaPills,
  FaSearch,
  SpecIcon,
} from "../utils/icons";
import "./DoctorDetails.css";

const AVATAR_COLORS = [
  ["#dbeafe","#1a56db"], ["#d1fae5","#059669"], ["#fce7f3","#be185d"],
  ["#ede9fe","#7c3aed"], ["#fef3c7","#b45309"], ["#cffafe","#0e7490"],
];

function DoctorDetails() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8080/api/doctors")
      .then((res) => {
        const found = res.data.find((d) => String(d.id) === String(id));
        setDoctor(found || null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="spinner-wrapper" style={{ minHeight: "60vh" }}>
      <div className="hc-spinner" />
    </div>
  );

  if (!doctor) return (
    <div className="empty-state" style={{ minHeight: "60vh" }}>
      <div className="empty-state-icon"><FaSearch size={32} /></div>
      <h4>Doctor not found</h4>
      <Link to="/doctors" className="btn-hc-primary mt-3">Back to Doctors</Link>
    </div>
  );

  const [bg, text] = AVATAR_COLORS[Number(id) % AVATAR_COLORS.length];
  const rating = (4.5 + (Number(id) % 5) * 0.1).toFixed(1);
  const experience = 3 + (Number(id) % 15);

  return (
    <div className="page-enter">
      <div className="doctor-details-header">
        <div className="container">
          <Link to="/doctors" className="doctor-details__back">Back to Doctors</Link>
        </div>
      </div>

      <div className="container doctor-details-body">
        <div className="doctor-details-grid">
          <div>
            <div className="hc-card doctor-details-profile">
              <div className="doctor-details-avatar" style={{ background: bg, color: text }}>
                <SpecIcon specialization={doctor.specialization} size={36} />
              </div>
              <h2 className="doctor-details-name">{doctor.name}</h2>
              <p className="doctor-details-spec">{doctor.specialization || "General Physician"}</p>
              <div className="doctor-details-rating">
                {"★★★★★".split("").map((s, i) => (
                  <span key={i} style={{ color: i < Math.floor(rating) ? "#f59e0b" : "#e2e8f0" }}>{s}</span>
                ))}
                <span className="doctor-details-rating-text">{rating} ({20 + Number(id) * 7} reviews)</span>
              </div>
              <div className="doctor-details-badges">
                <span className="badge-pill badge-success">
                  <FaCheckCircle size={12} aria-hidden="true" /> Available
                </span>
                <span className="badge-pill badge-primary">
                  <FaStar size={12} aria-hidden="true" /> Top Rated
                </span>
              </div>
              <div className="doctor-details-stats">
                <div className="doctor-details-stat">
                  <FaUserMd size={18} aria-hidden="true" />
                  <strong>{experience} yrs</strong>
                  <small>Experience</small>
                </div>
                <div className="doctor-details-stat">
                  <FaUsers size={18} aria-hidden="true" />
                  <strong>{300 + Number(id) * 50}+</strong>
                  <small>Patients</small>
                </div>
                <div className="doctor-details-stat">
                  <FaStar size={18} aria-hidden="true" />
                  <strong>{rating}</strong>
                  <small>Rating</small>
                </div>
              </div>
              <div className="doctor-details-fee">
                <span className="doctor-details-fee-amount">₹{doctor.fees}</span>
                <span className="doctor-details-fee-label">Consultation Fee</span>
              </div>
              <Link to={`/book?doctorId=${doctor.id}`} className="btn-hc-primary doctor-details-book">
                <FaCalendarCheck size={16} aria-hidden="true" /> Book Appointment
              </Link>
            </div>
          </div>

          <div className="doctor-details-right">
            <div className="hc-card doctor-details-section">
              <h4 className="doctor-details-section-title">About Doctor</h4>
              <p className="doctor-details-text">
                Dr. {doctor.name} is a highly experienced {doctor.specialization || "physician"} with over {experience} years of practice. Dedicated to providing compassionate, evidence-based care to each patient.
              </p>
            </div>

            <div className="hc-card doctor-details-section">
              <h4 className="doctor-details-section-title">Specializations</h4>
              <div className="doctor-details-tags">
                {[doctor.specialization, "General Medicine", "Preventive Care", "Patient Counseling"].filter(Boolean).map((tag) => (
                  <span key={tag} className="badge-pill badge-primary">{tag}</span>
                ))}
              </div>
            </div>

            <div className="hc-card doctor-details-section">
              <h4 className="doctor-details-section-title">Education & Qualifications</h4>
              {[
                { degree: "MBBS", college: "AIIMS New Delhi", year: "2008" },
                { degree: "MD Medicine", college: "PGI Chandigarh", year: "2012" },
              ].map((edu) => (
                <div key={edu.degree} className="doctor-details-edu">
                  <div className="doctor-details-edu-icon"><FaUserMd size={18} aria-hidden="true" /></div>
                  <div>
                    <strong>{edu.degree}</strong>
                    <div className="doctor-details-edu-sub">{edu.college} · {edu.year}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hc-card doctor-details-section">
              <h4 className="doctor-details-section-title">Consultation Details</h4>
              <div className="doctor-details-info-grid">
                {[
                  { icon: FaMapMarkerAlt, key: "Location", val: "City Hospital, Block A, Room 204" },
                  { icon: FaClock, key: "Timing", val: "Mon–Sat, 9:00 AM – 6:00 PM" },
                  { icon: FaComments, key: "Languages", val: "Hindi, English, Marathi" },
                  { icon: FaPills, key: "Fee", val: `₹${doctor.fees}` },
                ].map(({ icon: Icon, key, val }) => (
                  <div key={key} className="doctor-details-info-item">
                    <span className="doctor-details-info-label">
                      <Icon size={14} aria-hidden="true" /> <strong>{key}</strong>
                    </span>
                    <span>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDetails;
