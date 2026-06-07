import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaTimes, FaEdit, FaTrash, FaPlus } from "../utils/icons";
import "./ManageDoctors.css";

const API = "http://localhost:8080/api/doctors";

const EMPTY_FORM = { name: "", specialization: "", fees: "" };

const DEFAULT_SPECIALIZATIONS = [
  "Cardiologist",
  "Neurologist",
  "Dermatologist",
  "Orthopedic",
  "Pediatrician",
];

function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  const fetchDoctors = () => {
    setLoading(true);
    axios
      .get(API)
      .then((res) => setDoctors(res.data))
      .catch(() => setError("Failed to load doctors"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const specializationOptions = useMemo(() => {
    const fromData = doctors.map((d) => d.specialization).filter(Boolean);
    return [...new Set([...DEFAULT_SPECIALIZATIONS, ...fromData])].sort();
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const term = searchTerm.toLowerCase().trim();
      const matchSearch =
        !term ||
        doc.name?.toLowerCase().includes(term) ||
        doc.specialization?.toLowerCase().includes(term);

      const matchSpecialization =
        !selectedSpecialization || doc.specialization === selectedSpecialization;

      return matchSearch && matchSpecialization;
    });
  }, [doctors, searchTerm, selectedSpecialization]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSpecialization("");
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (doctor) => {
    setEditingId(doctor.id);
    setForm({
      name: doctor.name || "",
      specialization: doctor.specialization || "",
      fees: String(doctor.fees ?? ""),
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
      name: form.name.trim(),
      specialization: form.specialization.trim(),
      fees: parseFloat(form.fees),
    };

    if (!payload.name) {
      setError("Doctor name is required");
      setSaving(false);
      return;
    }
    if (isNaN(payload.fees) || payload.fees < 0) {
      setError("Please enter a valid consultation fee");
      setSaving(false);
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, payload);
        setSuccess("Doctor updated successfully");
      } else {
        await axios.post(API, payload);
        setSuccess("Doctor added successfully");
      }
      closeModal();
      fetchDoctors();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || "Operation failed. Please try again.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (doctor) => {
    if (!window.confirm(`Delete Dr. ${doctor.name}? This cannot be undone.`)) return;

    setError("");
    try {
      await axios.delete(`${API}/${doctor.id}`);
      setSuccess("Doctor deleted successfully");
      fetchDoctors();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete doctor";
      setError(msg);
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
              <h1 className="section-title mt-2" style={{ color: "white" }}>Manage Doctors</h1>
              <p style={{ color: "rgba(255,255,255,0.75)", marginTop: "4px" }}>
                Add, edit, or remove doctors from the system.
              </p>
            </div>
            <button className="btn-hc-white" onClick={openAddModal} title="Add new doctor">
              <FaPlus size={14} aria-hidden="true" /> Add Doctor
            </button>
          </div>
        </div>
      </div>

      <div className="container manage-body">
        {success && <div className="hc-alert hc-alert-success">{success}</div>}
        {error && !modalOpen && <div className="hc-alert hc-alert-error">{error}</div>}

        {loading ? (
          <div className="spinner-wrapper">
            <div className="hc-spinner" />
            <span style={{ color: "var(--gray-600)" }}>Loading doctors...</span>
          </div>
        ) : doctors.length === 0 ? (
          <div className="empty-state">
            <h4>No doctors found</h4>
            <p>Add your first doctor to get started.</p>
            <button className="btn-hc-primary mt-3" onClick={openAddModal}>
              <FaPlus size={14} aria-hidden="true" /> Add Doctor
            </button>
          </div>
        ) : (
          <>
            <div className="manage-filters hc-card">
              <div className="manage-search-wrap">
                <span className="manage-search-icon" aria-hidden="true"><FaSearch size={15} /></span>
                <input
                  type="text"
                  className="manage-search-input"
                  placeholder="Search by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="manage-search-clear"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                  >
                    <FaTimes size={12} />
                  </button>
                )}
              </div>

              <select
                className="manage-filter-select"
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                aria-label="Filter by specialization"
              >
                <option value="">All Specializations</option>
                {specializationOptions.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div className="manage-results-meta">
              <span className="manage-results-count">
                Showing {filteredDoctors.length} of {doctors.length} doctors
              </span>
              {(searchTerm || selectedSpecialization) && (
                <button className="manage-clear-filters" onClick={clearFilters}>
                  Clear filters
                </button>
              )}
            </div>

            {filteredDoctors.length === 0 ? (
              <div className="empty-state">
                <h4>No doctors found</h4>
                <p>Try adjusting your search or filter criteria.</p>
                <button className="btn-hc-outline mt-3" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="hc-card hc-card--static manage-table-wrap">
                <table className="manage-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Specialization</th>
                      <th>Fees (₹)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDoctors.map((doc) => (
                      <tr key={doc.id}>
                        <td>#{doc.id}</td>
                        <td><strong>{doc.name}</strong></td>
                        <td>
                          <span className="badge-pill badge-primary">{doc.specialization || "—"}</span>
                        </td>
                        <td>₹{doc.fees?.toLocaleString()}</td>
                        <td>
                          <div className="manage-actions">
                            <button className="manage-btn manage-btn--edit" onClick={() => openEditModal(doc)} title="Edit doctor">
                              <FaEdit size={13} aria-hidden="true" /> Edit
                            </button>
                            <button className="manage-btn manage-btn--delete" onClick={() => handleDelete(doc)} title="Delete doctor">
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
          </>
        )}
      </div>

      {modalOpen && (
        <div className="manage-modal-overlay" onClick={closeModal}>
          <div className="manage-modal" onClick={(e) => e.stopPropagation()}>
            <div className="manage-modal__header">
              <h3>{editingId ? "Edit Doctor" : "Add Doctor"}</h3>
              <button className="manage-modal__close" onClick={closeModal} aria-label="Close">×</button>
            </div>

            <form onSubmit={handleSubmit} className="manage-modal__form">
              {error && <div className="hc-alert hc-alert-error">{error}</div>}

              <div className="manage-field">
                <label htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  className="hc-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Dr. Jane Smith"
                  required
                />
              </div>

              <div className="manage-field">
                <label htmlFor="specialization">Specialization</label>
                <input
                  id="specialization"
                  className="hc-input"
                  value={form.specialization}
                  onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                  placeholder="Cardiology"
                />
              </div>

              <div className="manage-field">
                <label htmlFor="fees">Consultation Fee (₹) *</label>
                <input
                  id="fees"
                  type="number"
                  min="0"
                  step="50"
                  className="hc-input"
                  value={form.fees}
                  onChange={(e) => setForm({ ...form, fees: e.target.value })}
                  placeholder="500"
                  required
                />
              </div>

              <div className="manage-modal__actions">
                <button type="button" className="btn-hc-outline" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-hc-primary" disabled={saving}>
                  {saving ? "Saving..." : editingId ? "Update Doctor" : "Add Doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageDoctors;
