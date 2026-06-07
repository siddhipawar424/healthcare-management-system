import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AppointmentCard from "./AppointmentCard";
import { FaClipboardList, FaSearch, FaCalendarCheck } from "../utils/icons";
import "./Appointments.css";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/appointments")
      .then((res) => setAppointments(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = appointments.filter((a) =>
    a.patientName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-enter">
      <div className="appts-header">
        <div className="container">
          <span className="badge-pill appts-header__badge">
            <FaClipboardList size={14} aria-hidden="true" /> Records
          </span>
          <h1 className="section-title mt-3" style={{ color: "white" }}>Appointment History</h1>
          <p className="mt-2" style={{ color: "rgba(255,255,255,0.8)" }}>
            All your past and upcoming appointments in one place.
          </p>
        </div>
      </div>

      <div className="container appts-body">
        <div className="appts-toolbar">
          <div className="appts-search-wrap">
            <span className="appts-search-icon" aria-hidden="true"><FaSearch size={15} /></span>
            <input
              type="text"
              className="hc-input appts-search-input"
              placeholder="Search by patient name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search appointments"
            />
          </div>
          <Link to="/book" className="btn-hc-primary" title="Book new appointment">
            <FaCalendarCheck size={14} aria-hidden="true" /> New Appointment
          </Link>
        </div>

        {loading ? (
          <div className="spinner-wrapper">
            <div className="hc-spinner" />
            <span style={{ color: "var(--gray-600)" }}>Loading appointments...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><FaCalendarCheck size={32} /></div>
            <h4>{search ? "No results found" : "No Appointments Yet"}</h4>
            <p>{search ? "Try a different search term." : "Book your first appointment to get started."}</p>
            {!search && (
              <Link to="/book" className="btn-hc-primary" style={{ marginTop: "16px" }}>
                <FaCalendarCheck size={14} aria-hidden="true" /> Book Appointment
              </Link>
            )}
          </div>
        ) : (
          <>
            <p className="appts-count">{filtered.length} appointment{filtered.length !== 1 ? "s" : ""} found</p>
            <div className="appts-list">
              {filtered.map((appt) => (
                <AppointmentCard key={appt.id} appointment={appt} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Appointments;
