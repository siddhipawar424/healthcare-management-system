import { formatStatus, getStatusBadgeClass } from "../utils/appointmentStatus";
import "./AppointmentCard.css";

function AppointmentCard({ appointment }) {
  const status = appointment.status || "PENDING";
  const statusClass = getStatusBadgeClass(status);

  const date = new Date(appointment.appointmentDate);
  const isValidDate = !isNaN(date);

  return (
    <div className="appt-card hc-card">
      <div className="appt-card__left">
        <div className="appt-card__date-box">
          <span className="appt-card__date-day">{isValidDate ? date.getDate() : "--"}</span>
          <span className="appt-card__date-month">
            {isValidDate ? date.toLocaleString("default", { month: "short" }) : "---"}
          </span>
        </div>
      </div>

      <div className="appt-card__body">
        <div className="appt-card__top-row">
          <h5 className="appt-card__patient">{appointment.patientName}</h5>
          <span className={`badge-pill ${statusClass}`}>{formatStatus(status)}</span>
        </div>
        <p className="appt-card__doctor">Doctor ID: {appointment.doctorId}</p>
        <div className="appt-card__meta">
          <span>{appointment.appointmentDate || "N/A"}</span>
          <span>Appt #{appointment.id}</span>
        </div>
      </div>
    </div>
  );
}

export default AppointmentCard;
