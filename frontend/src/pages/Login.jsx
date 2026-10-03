import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.name);
      navigate("/closet");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sw-auth">
      <div className="sw-auth-art">
        <span className="sw-auth-word">STYLE</span>
        <div className="sw-auth-brand">Smart Wardrobe</div>

        <div className="sw-auth-tagline">
          <h1>Your closet, organised at last.</h1>
          <p>
            Catalogue what you own, build outfits you'll actually wear, and
            plan ahead with your own style calendar.
          </p>
        </div>

        <div className="sw-auth-foot">Wear more. Think less.</div>
      </div>

      <div className="sw-auth-panel">
        <form className="sw-auth-form" onSubmit={handleSubmit}>
          <p className="sw-auth-eyebrow">Welcome back</p>
          <h2 className="sw-auth-title">Log In</h2>
          <p className="sw-auth-sub">Log in to your wardrobe</p>

          {error && <p className="sw-auth-error">{error}</p>}

          <div className="sw-auth-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="sw-auth-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="sw-auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>

          <p className="sw-auth-switch">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;