import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    setLoading(true);

    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        localStorage.setItem("admin", "true");
        navigate("/admin-dashboard");
      } else {
        setLoading(false);
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    }, 800);
  };

  return (
    <div className="al-root">
      <div className="al-bg-grid" />

      <div className={`al-card ${shake ? "al-shake" : ""}`}>
        <div className="al-header">
          <div className="al-badge">
            <span className="al-badge-dot" />
            SECURE ACCESS
          </div>
          <h1 className="al-title">Admin Portal</h1>
          <p className="al-subtitle">Authorized personnel only</p>
        </div>

        <form className="al-form" onSubmit={handleLogin}>
          <div className="al-field">
            <label className="al-label" htmlFor="username">
              Username
            </label>
            <div className="al-input-wrap">
              <svg className="al-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                id="username"
                className="al-input"
                placeholder="Enter username"
                value={username}
                autoComplete="username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="al-field">
            <label className="al-label" htmlFor="password">
              Password
            </label>
            <div className="al-input-wrap">
              <svg className="al-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="password"
                className="al-input"
                type="password"
                placeholder="Enter password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button className={`al-btn ${loading ? "al-btn--loading" : ""}`} type="submit" disabled={loading}>
            {loading ? (
              <span className="al-spinner" />
            ) : (
              <>
                Sign In
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>

        <p className="al-footer">© {new Date().getFullYear()} Admin System · All rights reserved</p>
      </div>
    </div>
  );
}

export default AdminLogin;