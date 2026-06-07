import { Link } from "react-router-dom";
import { FaCheckCircle, SpecIcon } from "../utils/icons";
import "./DoctorCard.css";

const AVATAR_COLORS = [
  ["#dbeafe","#1a56db"], ["#d1fae5","#059669"], ["#fce7f3","#be185d"],
  ["#ede9fe","#7c3aed"], ["#fef3c7","#b45309"], ["#cffafe","#0e7490"],
];

function DoctorCard({ doctor, index = 0 }) {
  const [bg, text] = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const rating = (4.5 + (index % 5) * 0.1).toFixed(1);
  const experience = 3 + (index % 15);

  return (
    <div className="doctor-card hc-card">
      <div className="doctor-card__top">
        <span className="badge-pill badge-success doctor-card__available">
          <FaCheckCircle size={12} aria-hidden="true" /> Available
        </span>
        <span className="doctor-card__exp">{experience} yrs exp</span>
      </div>

      <div className="doctor-card__avatar" style={{ background: bg, color: text }}>
        <SpecIcon specialization={doctor.specialization} size={28} />
        <div className="doctor-card__online" />
      </div>

      <div className="doctor-card__info">
        <h4 className="doctor-card__name">{doctor.name}</h4>
        <p className="doctor-card__spec">{doctor.specialization || "General Physician"}</p>

        <div className="doctor-card__rating">
          <div className="doctor-card__stars">
            {"★★★★★".split("").map((s, i) => (
              <span key={i} style={{ color: i < Math.floor(rating) ? "#f59e0b" : "#e2e8f0" }}>{s}</span>
            ))}
          </div>
          <span className="doctor-card__rating-text">{rating}</span>
          <span className="doctor-card__reviews">({20 + index * 7})</span>
        </div>

        <div className="doctor-card__fee">
          <div>
            <span className="doctor-card__fee-amount">₹{doctor.fees}</span>
            <span className="doctor-card__fee-label"> / consultation</span>
          </div>
        </div>

        <div className="doctor-card__actions">
          <Link to={`/doctors/${doctor.id}`} className="btn-hc-outline doctor-card__btn">
            View Profile
          </Link>
          <Link to={`/book?doctorId=${doctor.id}`} className="btn-hc-primary doctor-card__btn">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DoctorCard;
