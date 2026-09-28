import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const name = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <nav className="topbar">
      <div className="topbar-brand">Smart Wardrobe</div>

      <div className="topbar-links">
        <NavLink to="/closet">Closet</NavLink>
        <NavLink to="/outfits">Outfits</NavLink>
      </div>

      <div className="topbar-right">
        <span>Hi, {name}</span>
        <button className="link-btn" onClick={handleLogout}>Log out</button>
      </div>
    </nav>
  );
}

export default Navbar;