import { useState, useEffect } from "react";
import api from "../api/axios";

const CATEGORIES = ["Top", "Bottom", "Dress", "Outerwear", "Footwear", "Accessory"];

function Closet() {
  const name = localStorage.getItem("userName");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "Top",
    brand: "",
    fabric: "",
    color: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/closet");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    window.location.href = "/login";
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setError("");

    if (!imageFile) {
      setError("Please choose a photo for this item.");
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("category", form.category);
      data.append("brand", form.brand);
      data.append("fabric", form.fabric);
      data.append("color", form.color);
      data.append("image", imageFile);

      await api.post("/api/closet", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm({ name: "", category: "Top", brand: "", fabric: "", color: "" });
      setImageFile(null);
      setShowForm(false);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/closet/${id}`);
      setItems(items.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-shell">
      <nav className="topbar">
        <div className="topbar-brand">Smart Wardrobe</div>
        <div className="topbar-right">
          <span>Hi, {name}</span>
          <button className="link-btn" onClick={handleLogout}>Log out</button>
        </div>
      </nav>

      <div className="page-content">
        <div className="page-header">
          <h1>My Closet</h1>
          <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Add Item"}
          </button>
        </div>

        {showForm && (
          <form className="item-form" onSubmit={handleAddItem}>
            {error && <p className="error-text">{error}</p>}

            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Brand</label>
                <input name="brand" value={form.brand} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Color</label>
                <input name="color" value={form.color} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Fabric</label>
                <input name="fabric" value={form.fabric} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                required
              />
            </div>

            <button type="submit" className="primary-btn" disabled={submitting}>
              {submitting ? "Adding..." : "Add to Closet"}
            </button>
          </form>
        )}

        {loading ? (
          <p>Loading your closet...</p>
        ) : items.length === 0 ? (
          <p className="empty-text">Your closet is empty. Add your first item above.</p>
        ) : (
          <div className="closet-grid">
            {items.map((item) => (
              <div className="closet-card" key={item._id}>
                <img src={item.imageUrl} alt={item.name} />
                <div className="closet-card-body">
                  <h3>{item.name}</h3>
                  <p className="closet-card-category">{item.category}</p>
                  {item.brand && <p className="closet-card-meta">{item.brand}</p>}
                  <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Closet;