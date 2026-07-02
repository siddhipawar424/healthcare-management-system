import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

function Register() {
  const [role, setRole] = useState("PATIENT"); // PATIENT or ADMIN (Doctor)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [fees, setFees] = useState("");
  
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let endpoint = "http://localhost:8080/api/auth/register";
      let payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password
      };

      if (role === "ADMIN") {
        endpoint = "http://localhost:8080/api/auth/register-doctor";
        payload = {
          ...payload,
          specialization: specialization.trim(),
          fees: parseFloat(fees) || 0
        };

        if (!payload.specialization) {
          setError("Specialization is required for Doctors");
          setLoading(false);
          return;
        }
        if (isNaN(payload.fees) || payload.fees < 0) {
          setError("Consultation fee must be a valid non-negative number");
          setLoading(false);
          return;
        }
      }

      const response = await axios.post(endpoint, payload);
      const { token, role: userRole, name: userName, email: userEmail } = response.data;

      // Save credentials in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", userRole);
      localStorage.setItem("name", userName);
      localStorage.setItem("email", userEmail);

      // Set admin flag to maintain backward compatibility
      if (userRole === "ADMIN") {
        localStorage.setItem("admin", "true");
        navigate("/admin-dashboard");
      } else {
        localStorage.removeItem("admin");
        navigate("/appointments");
      }
    } catch (err) {
      setLoading(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      const errMsg = err.response?.data?.message || "Registration failed. Please check your inputs.";
      setError(errMsg);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-bg-grid" />

      <div className={`auth-card ${shake ? "auth-shake" : ""}`}>
        <div className="auth-header">
          <div className="auth-badge">
            <span className="auth-badge-dot" />
            REGISTRATION
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join Healthcare+ to manage consultations</p>
        </div>

        {error && (
          <div className="hc-alert hc-alert-error" style={{ marginBottom: "1.2rem" }}>
            {error}
          </div>
        )}

        {/* Role Switcher tabs */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${role === "PATIENT" ? "auth-tab--active" : ""}`}
            onClick={() => { setRole("PATIENT"); setError(""); }}
          >
            Register as Patient
          </button>
          <button
            type="button"
            className={`auth-tab ${role === "ADMIN" ? "auth-tab--active" : ""}`}
            onClick={() => { setRole("ADMIN"); setError(""); }}
          >
            Register as Doctor
          </button>
        </div>

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="name">
              Full Name
            </label>
            <div className="auth-input-wrap">
              <svg className="auth-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                id="name"
                type="text"
                className="auth-input"
                placeholder={role === "ADMIN" ? "Dr. Jane Smith" : "John Doe"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="email">
              Email Address
            </label>
            <div className="auth-input-wrap">
              <svg className="auth-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                id="email"
                type="email"
                className="auth-input"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">
              Password (min 6 chars)
            </label>
            <div className="auth-input-wrap">
              <svg className="auth-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="password"
                type="password"
                className="auth-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
          </div>

          {/* Render Doctor-only fields */}
          {role === "ADMIN" && (
            <div className="auth-doctor-fields">
              <div className="auth-field">
                <label className="auth-label" htmlFor="specialization">
                  Specialization
                </label>
                <div className="auth-input-wrap">
                  <svg className="auth-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                  <input
                    id="specialization"
                    type="text"
                    className="auth-input"
                    placeholder="e.g. Cardiologist"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="fees">
                  Consultation Fee (₹)
                </label>
                <div className="auth-input-wrap">
                  <svg className="auth-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  <input
                    id="fees"
                    type="number"
                    min="0"
                    step="50"
                    className="auth-input"
                    placeholder="500"
                    value={fees}
                    onChange={(e) => setFees(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <button className={`auth-btn ${loading ? "auth-btn--loading" : ""}`} type="submit" disabled={loading}>
            {loading ? (
              <span className="auth-spinner" />
            ) : (
              <>
                Register Account
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>

        <p className="auth-switch-link">
          Already have an account?
          <Link to="/login">Sign in instead</Link>
        </p>

        <p className="auth-footer">© {new Date().getFullYear()} Healthcare+ · Secure Authentication</p>
      </div>
    </div>
  );
}

export default Register;
