import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  APPOINTMENT_STATUSES,
  formatStatus,
  getStatusBadgeClass,
} from "../utils/appointmentStatus";
import { FaEdit, FaTrash, FaPlus, FaCalendarCheck } from "../utils/icons";
import "./ManageAppointments.css";

const API = "http://localhost:8080/api/appointments";
const DOCTORS_API = "http://localhost:8080/api/doctors";

const EMPTY_FORM = {
  patientName: "",
  doctorId: "",
  appointmentDate: "",
  status: "PENDING",
};

function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const doctorMap = doctors.reduce((acc, doc) => {
    acc[doc.id] = doc.name;
    return acc;
  }, {});

  const fetchData = () => {
    setLoading(true);
    Promise.all([axios.get(API), axios.get(DOCTORS_API)])
      .then(([apptRes, docRes]) => {
        setAppointments(apptRes.data);
        setDoctors(docRes.data);
      })
      .catch(() => setError("Failed to load appointments"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openEditModal = (appointment) => {
    setEditingId(appointment.id);
    setForm({
      patientName: appointment.patientName || "",
      doctorId: String(appointment.doctorId ?? ""),
      appointmentDate: appointment.appointmentDate || "",
      status: appointment.status || "PENDING",
    });
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      patientName: form.patientName.trim(),
      doctorId: parseInt(form.doctorId, 10),
      appointmentDate: form.appointmentDate,
      status: form.status,
    };

    if (!payload.patientName) {
      setError("Patient name is required");
      setSaving(false);
      return;
    }
    if (!payload.doctorId) {
      setError("Please select a doctor");
      setSaving(false);
      return;
    }
    if (!payload.appointmentDate) {
      setError("Appointment date is required");
      setSaving(false);
      return;
    }

    try {
      await axios.put(`${API}/${editingId}`, payload);
      setSuccess("Appointment updated successfully");
      closeModal();
      fetchData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update appointment");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (appointment, newStatus) => {
    if (appointment.status === newStatus) return;

    setError("");
    try {
      await axios.patch(`${API}/${appointment.id}/status`, { status: newStatus });
      setSuccess(`Status updated to ${formatStatus(newStatus)}`);
      fetchData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
      setTimeout(() => setError(""), 4000);
    }
  };

  const handleDelete = async (appointment) => {
    const confirmed = window.confirm(
      `Delete appointment #${appointment.id} for ${appointment.patientName}? This cannot be undone.`
    );
    if (!confirmed) return;

    setError("");
    try {
      await axios.delete(`${API}/${appointment.id}`);
      setSuccess("Appointment deleted successfully");
      fetchData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete appointment");
      setTimeout(() => setError(""), 4000);
    }
  };

  return (
    <div className="page-enter">
      <div className="manage-header">
        <div className="container">
          <div className="manage-header__inner">
            <div>
              <Link to="/admin-dashboard" className="manage-back">← Back to Dashboard</Link>
              <h1 className="section-title mt-2" style={{ color: "white" }}>Manage Appointments</h1>
              <p style={{ color: "rgba(255,255,255,0.75)", marginTop: "4px" }}>
                Edit, update status, or remove appointments.
              </p>
            </div>
            <Link to="/book" className="btn-hc-white" title="Book new appointment">
              <FaPlus size={14} aria-hidden="true" /> New Appointment
            </Link>
          </div>
        </div>
      </div>

      <div className="container manage-body">
        {success && <div className="hc-alert hc-alert-success">{success}</div>}
        {error && !modalOpen && <div className="hc-alert hc-alert-error">{error}</div>}

        {loading ? (
          <div className="spinner-wrapper">
            <div className="hc-spinner" />
            <span style={{ color: "var(--gray-600)" }}>Loading appointments...</span>
          </div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <h4>No appointments found</h4>
            <p>Book the first appointment to get started.</p>
            <Link to="/book" className="btn-hc-primary mt-3">
              <FaCalendarCheck size={14} aria-hidden="true" /> Book Appointment
            </Link>
          </div>
        ) : (
          <div className="hc-card hc-card--static manage-table-wrap">
            <table className="manage-table manage-appt-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.id}>
                    <td>#{appt.id}</td>
                    <td><strong>{appt.patientName}</strong></td>
                    <td>{doctorMap[appt.doctorId] || `Doctor #${appt.doctorId}`}</td>
                    <td>{appt.appointmentDate}</td>
                    <td>
                      <select
                        className={`manage-status-select ${getStatusBadgeClass(appt.status)}`}
                        value={appt.status || "PENDING"}
                        onChange={(e) => handleStatusChange(appt, e.target.value)}
                      >
                        {APPOINTMENT_STATUSES.map((s) => (
                          <option key={s} value={s}>{formatStatus(s)}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="manage-actions">
                        <button
                          className="manage-btn manage-btn--edit"
                          onClick={() => openEditModal(appt)}
                          title="Edit appointment"
                        >
                          <FaEdit size={13} aria-hidden="true" /> Edit
                        </button>
                        <button
                          className="manage-btn manage-btn--delete"
                          onClick={() => handleDelete(appt)}
                          title="Delete appointment"
                        >
                          <FaTrash size={13} aria-hidden="true" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="manage-modal-overlay" onClick={closeModal}>
          <div className="manage-modal" onClick={(e) => e.stopPropagation()}>
            <div className="manage-modal__header">
              <h3>Edit Appointment #{editingId}</h3>
              <button className="manage-modal__close" onClick={closeModal} aria-label="Close">×</button>
            </div>

            <form onSubmit={handleSubmit} className="manage-modal__form">
              {error && <div className="hc-alert hc-alert-error">{error}</div>}

              <div className="manage-field">
                <label htmlFor="patientName">Patient Name *</label>
                <input
                  id="patientName"
                  className="hc-input"
                  value={form.patientName}
                  onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                  required
                />
              </div>

              <div className="manage-field">
                <label htmlFor="doctorId">Doctor *</label>
                <select
                  id="doctorId"
                  className="hc-input"
                  value={form.doctorId}
                  onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                  required
                >
                  <option value="">Select doctor...</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} — {doc.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div className="manage-field">
                <label htmlFor="appointmentDate">Appointment Date *</label>
                <input
                  id="appointmentDate"
                  type="date"
                  className="hc-input"
                  value={form.appointmentDate}
                  onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                  required
                />
              </div>

              <div className="manage-field">
                <label htmlFor="status">Status *</label>
                <select
                  id="status"
                  className="hc-input"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  required
                >
                  {APPOINTMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>{formatStatus(s)}</option>
                  ))}
                </select>
              </div>

              <div className="manage-modal__actions">
                <button type="button" className="btn-hc-outline" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-hc-primary" disabled={saving}>
                  {saving ? "Saving..." : "Update Appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageAppointments;
