import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const name = localStorage.getItem("userName") || "Guest";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <nav className="topbar">
      <div className="topbar-brand">Smart Wardrobe</div>

      <div className="topbar-links">
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/closet">Closet</NavLink>
        <NavLink to="/outfits">Outfits</NavLink>
        <NavLink to="/calendar">Calendar</NavLink>
        <NavLink to="/feed">Feed</NavLink>
      </div>

      <div className="topbar-right">
        <div className="topbar-avatar">{name.charAt(0).toUpperCase()}</div>
        <span className="topbar-name">Hi, {name}</span>
        <button className="link-btn" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;