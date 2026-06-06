import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaCalendarCheck,
  FaUser,
  FaUserMd,
  FaCheckCircle,
  FaLock,
  FaComments,
  FaPills,
  FaClock,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from "../utils/icons";
import "./BookAppointment.css";

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientName: "",
    doctorId: searchParams.get("doctorId") || "",
    appointmentDate: "",
  });

  useEffect(() => {
    axios.get("http://localhost:8080/api/doctors")
      .then((res) => setDoctors(res.data))
      .catch(() => {})
      .finally(() => setFormLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.doctorId || !formData.appointmentDate) {
      setAlert({ type: "error", msg: "Please fill in all fields.", icon: FaExclamationTriangle });
      return;
    }
    setLoading(true);
    setAlert(null);
    try {
      await axios.post("http://localhost:8080/api/appointments", formData);
      setAlert({ type: "success", msg: "Appointment booked successfully!", icon: FaCheckCircle });
      setFormData({ patientName: "", doctorId: "", appointmentDate: "" });
      setTimeout(() => navigate("/appointments"), 1800);
    } catch {
      setAlert({ type: "error", msg: "Failed to book appointment. Please try again.", icon: FaTimesCircle });
    } finally {
      setLoading(false);
    }
  };

  const selectedDoc = doctors.find((d) => String(d.id) === String(formData.doctorId));
  const today = new Date().toISOString().split("T")[0];

  const whyItems = [
    { icon: FaCheckCircle, text: "Verified & Certified Doctors" },
    { icon: FaLock, text: "Secure & Private Booking" },
    { icon: FaComments, text: "Instant Confirmation" },
    { icon: FaPills, text: "Post-consultation Support" },
    { icon: FaClock, text: "No Long Wait Times" },
  ];

  return (
    <div className="page-enter">
      <div className="book-header">
        <div className="container">
          <span className="badge-pill book-header__badge">
            <FaCalendarCheck size={14} aria-hidden="true" /> Easy Booking
          </span>
          <h1 className="section-title mt-3" style={{ color: "white" }}>Book an Appointment</h1>
          <p className="mt-2" style={{ color: "rgba(255,255,255,0.8)" }}>
            Fill in the details below and confirm your visit.
          </p>
        </div>
      </div>

      <div className="container book-body">
        <div className="book-grid">
          <div className="hc-card book-form-card">
            <h4 className="book-form-title">Appointment Details</h4>

            {alert && (
              <div className={`hc-alert hc-alert-${alert.type}`}>
                <alert.icon size={16} aria-hidden="true" /> {alert.msg}
              </div>
            )}

            {formLoading ? (
              <div className="spinner-wrapper book-spinner">
                <div className="hc-spinner" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="book-form">
                <div className="book-form__field">
                  <label className="form-label" htmlFor="patientName">
                    <FaUser size={14} aria-hidden="true" /> Patient Name
                  </label>
                  <input
                    id="patientName"
                    type="text"
                    name="patientName"
                    className="hc-input"
                    placeholder="Enter your full name"
                    value={formData.patientName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="book-form__field">
                  <label className="form-label" htmlFor="doctorId">
                    <FaUserMd size={14} aria-hidden="true" /> Select Doctor
                  </label>
                  <select
                    id="doctorId"
                    name="doctorId"
                    className="hc-input"
                    value={formData.doctorId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose a specialist...</option>
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} — {doc.specialization} (₹{doc.fees})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="book-form__field">
                  <label className="form-label" htmlFor="appointmentDate">
                    <FaCalendarCheck size={14} aria-hidden="true" /> Appointment Date
                  </label>
                  <input
                    id="appointmentDate"
                    type="date"
                    name="appointmentDate"
                    className="hc-input"
                    min={today}
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn-hc-primary book-submit" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="hc-spinner hc-spinner--sm" aria-hidden="true" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <FaCalendarCheck size={16} aria-hidden="true" /> Confirm Appointment
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="book-right">
            {selectedDoc && (
              <div className="hc-card book-doctor-preview">
                <h5 className="book-doctor-preview__title">Selected Doctor</h5>
                <div className="book-doctor-preview__body">
                  <div className="book-doctor-preview__avatar"><FaUserMd size={28} aria-hidden="true" /></div>
                  <div>
                    <div className="book-doctor-preview__name">{selectedDoc.name}</div>
                    <div className="book-doctor-preview__spec">{selectedDoc.specialization}</div>
                    <div className="book-doctor-preview__fee">₹{selectedDoc.fees} / consultation</div>
                  </div>
                </div>
              </div>
            )}

            <div className="hc-card book-why">
              <h5 className="book-why__title">Why Book with Us?</h5>
              {whyItems.map(({ icon: Icon, text }) => (
                <div key={text} className="book-why__item">
                  <Icon size={16} aria-hidden="true" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <div className="book-notice">
              <FaInfoCircle size={18} aria-hidden="true" />
              <p>Please arrive 10 minutes early. Bring a government-issued ID and any prior medical reports.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;
