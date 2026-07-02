import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import StatCard from "./StatCard";
import { formatStatus, getStatusBadgeClass } from "../utils/appointmentStatus";
import {
  FaUserMd,
  FaCalendarCheck,
  FaUsers,
  FaEnvelope,
  FaHourglassHalf,
  FaCheckCircle,
  FaFlagCheckered,
  FaTimesCircle,
  FaClipboardList,
  FaPhone,
  FaPlus,
  FaTrash,
  FaSignOutAlt,
  MdDashboard,
} from "../utils/icons";
import "./Dashboard.css";

function Dashboard() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [contactSuccess, setContactSuccess] = useState("");
  const [contactError, setContactError] = useState("");

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8080/api/doctors"),
      axios.get("http://localhost:8080/api/appointments"),
      axios.get("http://localhost:8080/api/contact"),
    ])
      .then(([dRes, aRes, cRes]) => {
        setDoctors(dRes.data);
        setAppointments(aRes.data);
        setContacts(cRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    setContactError("");
    try {
      await axios.delete(`http://localhost:8080/api/contact/${id}`);
      setContacts((prev) => prev.filter((msg) => msg.id !== id));
      setContactSuccess("Message deleted successfully");
      setTimeout(() => setContactSuccess(""), 3000);
    } catch {
      setContactError("Failed to delete message");
      setTimeout(() => setContactError(""), 4000);
    }
  };

  const uniquePatients = [...new Set(appointments.map((a) => a.patientName))].length;
  const recentAppts = appointments.slice(0, 5);

  const statusCounts = appointments.reduce((acc, appt) => {
    const status = appt.status || "PENDING";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const specializations = doctors.reduce((acc, d) => {
    if (d.specialization) acc[d.specialization] = (acc[d.specialization] || 0) + 1;
    return acc;
  }, {});

  const recentContacts = contacts.slice(-5).reverse();

  const quickActions = [
    { icon: <FaUserMd size={22} />, label: "Manage Doctors", to: "/admin/doctors" },
    { icon: <FaClipboardList size={22} />, label: "Manage Appointments", to: "/admin/appointments" },
    { icon: <FaCalendarCheck size={22} />, label: "Book Appointment", to: "/book" },
    { icon: <FaPhone size={22} />, label: "Contact Us", to: "/contact" },
  ];

  return (
    <div className="page-enter">
      <div className="dashboard-header">
        <div className="container">
          <div className="dashboard-header__inner">
            <div>
              <span className="badge-pill dashboard-header__badge">
                <MdDashboard size={14} aria-hidden="true" /> Admin Panel
              </span>
              <h1 className="section-title mt-2" style={{ color: "white" }}>Dashboard</h1>
              <p style={{ color: "rgba(255,255,255,0.75)", marginTop: "4px" }}>
                Welcome back! Here's what's happening today.
              </p>
            </div>
            <div className="dashboard-header__actions">
              <Link to="/book" className="btn-hc-white" title="Book new appointment">
                <FaPlus size={14} aria-hidden="true" /> New Appointment
              </Link>
              <button
                className="btn-hc-white"
                title="Logout"
                onClick={() => {
                  localStorage.removeItem("admin");
                  localStorage.removeItem("token");
                  localStorage.removeItem("role");
                  localStorage.removeItem("name");
                  localStorage.removeItem("email");
                  window.location.href = "/";
                }}
              >
                <FaSignOutAlt size={14} aria-hidden="true" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container dashboard-body">
        {loading ? (
          <div className="spinner-wrapper">
            <div className="hc-spinner" />
            <span style={{ color: "var(--gray-600)" }}>Loading dashboard...</span>
          </div>
        ) : (
          <>
            <div className="dashboard-stats">
              <StatCard icon={<FaUserMd size={22} />} label="Total Doctors" value={doctors.length} color="blue" trend="Active" />
              <StatCard icon={<FaCalendarCheck size={22} />} label="Total Appointments" value={appointments.length} color="green" trend="All time" />
              <StatCard icon={<FaUsers size={22} />} label="Unique Patients" value={uniquePatients} color="purple" trend="Registered" />
              <StatCard icon={<FaEnvelope size={22} />} label="Contact Messages" value={contacts.length} color="orange" trend="Received" />
            </div>

            <div className="dashboard-status-stats">
              <StatCard icon={<FaHourglassHalf size={22} />} label="Pending" value={statusCounts.PENDING || 0} color="orange" trend="Awaiting" />
              <StatCard icon={<FaCheckCircle size={22} />} label="Approved" value={statusCounts.APPROVED || 0} color="green" trend="Confirmed" />
              <StatCard icon={<FaFlagCheckered size={22} />} label="Completed" value={statusCounts.COMPLETED || 0} color="blue" trend="Done" />
              <StatCard icon={<FaTimesCircle size={22} />} label="Cancelled" value={statusCounts.CANCELLED || 0} color="purple" trend="Closed" />
            </div>

            <div className="dashboard-main-grid">
              <div className="hc-card hc-card--static dashboard-appts">
                <div className="dashboard-section-header">
                  <h5>Recent Appointments</h5>
                  <Link to="/admin/appointments" className="dashboard-see-all">Manage All →</Link>
                </div>
                {recentAppts.length === 0 ? (
                  <div className="empty-state dashboard-empty">
                    <h4>No appointments yet</h4>
                  </div>
                ) : (
                  <div className="dashboard-appts-list">
                    {recentAppts.map((appt) => (
                      <div key={appt.id} className="dashboard-appt-row">
                        <div className="dashboard-appt-num">#{appt.id}</div>
                        <div className="dashboard-appt-info">
                          <strong>{appt.patientName}</strong>
                          <span>Doc ID: {appt.doctorId}</span>
                        </div>
                        <div className="dashboard-appt-date">{appt.appointmentDate}</div>
                        <span className={`badge-pill ${getStatusBadgeClass(appt.status)}`}>
                          {formatStatus(appt.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="dashboard-right">
                <div className="hc-card hc-card--static dashboard-spec">
                  <div className="dashboard-section-header">
                    <h5>Doctors by Specialization</h5>
                    <Link to="/doctors" className="dashboard-see-all">View All →</Link>
                  </div>
                  {Object.keys(specializations).length === 0 ? (
                    <p className="dashboard-no-data">No data</p>
                  ) : (
                    <div className="dashboard-spec-list">
                      {Object.entries(specializations).map(([spec, count]) => (
                        <div key={spec} className="dashboard-spec-row">
                          <span className="dashboard-spec-name">{spec}</span>
                          <div className="dashboard-spec-bar-wrap">
                            <div
                              className="dashboard-spec-bar"
                              style={{ width: `${(count / doctors.length) * 100}%` }}
                            />
                          </div>
                          <span className="dashboard-spec-count">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="hc-card hc-card--static dashboard-quick">
                  <h5 className="dashboard-quick-title">Quick Actions</h5>
                  <div className="dashboard-quick-grid">
                    {quickActions.map((action) => (
                      <Link key={action.to} to={action.to} className="dashboard-quick-btn" title={action.label}>
                        <span className="dashboard-quick-icon">{action.icon}</span>
                        <span>{action.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="hc-card hc-card--static dashboard-contacts">
                  <div className="dashboard-section-header">
                    <h5>Recent Contact Messages</h5>
                  </div>

                  {contactSuccess && (
                    <div className="hc-alert hc-alert-success dashboard-contact-alert">{contactSuccess}</div>
                  )}
                  {contactError && (
                    <div className="hc-alert hc-alert-error dashboard-contact-alert">{contactError}</div>
                  )}

                  {recentContacts.length === 0 ? (
                    <p className="dashboard-contacts-empty">No messages yet</p>
                  ) : (
                    <div className="dashboard-contacts-list">
                      {recentContacts.map((msg) => (
                        <div key={msg.id} className="dashboard-contact-card">
                          <div className="dashboard-contact-top">
                            <div>
                              <strong className="dashboard-contact-name">{msg.name}</strong>
                              <p className="dashboard-contact-email">{msg.email}</p>
                            </div>
                            <button
                              className="dashboard-contact-delete"
                              onClick={() => handleDeleteContact(msg.id)}
                              aria-label={`Delete message from ${msg.name}`}
                              title="Delete message"
                            >
                              <FaTrash size={13} aria-hidden="true" />
                              Delete
                            </button>
                          </div>
                          <p className="dashboard-contact-subject">{msg.subject}</p>
                          <p className="dashboard-contact-message">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
