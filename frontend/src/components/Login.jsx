import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email: email.trim(),
        password: password
      });

      const { token, role, name, email: userEmail } = response.data;

      // Save credentials in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);
      localStorage.setItem("email", userEmail);

      // Set admin flag to maintain backward compatibility if other code checks for "admin"
      if (role === "ADMIN") {
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
      const errMsg = err.response?.data?.message || "Invalid email or password";
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
            SECURE ACCESS
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to manage your health account</p>
        </div>

        {error && (
          <div className="hc-alert hc-alert-error" style={{ marginBottom: "1.2rem" }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin}>
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
                placeholder="you@example.com"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">
              Password
            </label>
            <div className="auth-input-wrap">
              <svg className="auth-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="password"
                className="auth-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button className={`auth-btn ${loading ? "auth-btn--loading" : ""}`} type="submit" disabled={loading}>
            {loading ? (
              <span className="auth-spinner" />
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

        <p className="auth-switch-link">
          Don't have an account?
          <Link to="/register">Sign up now</Link>
        </p>

        <p className="auth-footer">© {new Date().getFullYear()} Healthcare+ · Secure Authentication</p>
      </div>
    </div>
  );
}

export default Login;
