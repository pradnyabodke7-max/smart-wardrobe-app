import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import "./Auth.css";

function Register() {
  const [name, setName] = useState("");
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
      const res = await api.post("/api/auth/register", { name, email, password });
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
          <h1>Plan outfits before you open the closet.</h1>
          <p>
            Create an account to start cataloguing your clothes and building
            looks you'll actually wear.
          </p>
        </div>

        <div className="sw-auth-foot">Wear more. Think less.</div>
      </div>

      <div className="sw-auth-panel">
        <form className="sw-auth-form" onSubmit={handleSubmit}>
          <p className="sw-auth-eyebrow">Get started</p>
          <h2 className="sw-auth-title">Register</h2>
          <p className="sw-auth-sub">Start building your digital wardrobe</p>

          {error && <p className="sw-auth-error">{error}</p>}

          <div className="sw-auth-field">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              minLength={6}
            />
          </div>

          <button type="submit" className="sw-auth-btn" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>

          <p className="sw-auth-switch">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;