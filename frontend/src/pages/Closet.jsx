import { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "./Closet.css";

const CATEGORIES = ["Top", "Bottom", "Dress", "Outerwear", "Footwear", "Accessory"];

function Closet() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

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
      const params = {};
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;
      const res = await api.get("/api/closet", { params });
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchItems();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, categoryFilter]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ name: "", category: "Top", brand: "", fabric: "", color: "" });
    setImageFile(null);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const handleStartEdit = (item) => {
    setForm({
      name: item.name,
      category: item.category,
      brand: item.brand || "",
      fabric: item.fabric || "",
      color: item.color || "",
    });
    setImageFile(null);
    setEditingId(item._id);
    setShowForm(true);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!editingId && !imageFile) {
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
      if (imageFile) data.append("image", imageFile);

      if (editingId) {
        await api.put(`/api/closet/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/api/closet", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      resetForm();
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save item");
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
    <div className="app-shell closet-page">
      <Navbar />

      <div className="page-content">
        <div className="closet-head">
          <div>
            <p className="closet-eyebrow">Your collection</p>
            <h1 className="closet-title">My Closet</h1>
            <p className="closet-sub">
              {items.length} {items.length === 1 ? "piece" : "pieces"}
              {categoryFilter ? ` in ${categoryFilter}` : " in your wardrobe"}
            </p>
          </div>
          <button
            className="primary-btn"
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
          >
            {showForm ? "Cancel" : "+ Add Item"}
          </button>
        </div>

        {showForm && (
          <form className="item-form" onSubmit={handleSubmit}>
            <h2 className="builder-card-title">
              {editingId ? "Edit item" : "Add a new item"}
            </h2>

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
              <label>Photo{editingId ? " (leave empty to keep current photo)" : ""}</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                required={!editingId}
              />
            </div>

            <button type="submit" className="primary-btn" disabled={submitting}>
              {submitting
                ? "Saving..."
                : editingId
                ? "Save Changes"
                : "Add to Closet"}
            </button>
          </form>
        )}

        <div className="filter-bar">
          <input
            className="search-input"
            placeholder="Search your closet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="pill-row">
            <button
              className={`pill ${categoryFilter === "" ? "active" : ""}`}
              onClick={() => setCategoryFilter("")}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`pill ${categoryFilter === c ? "active" : ""}`}
                onClick={() => setCategoryFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="empty-text">Loading your closet...</p>
        ) : items.length === 0 ? (
          <p className="empty-text">
            {search || categoryFilter
              ? "No items match your search."
              : "Your closet is empty. Add your first piece above."}
          </p>
        ) : (
          <div className="closet-grid">
            {items.map((item) => (
              <div className="closet-card" key={item._id}>
                <div className="closet-card-img">
                  <img src={item.imageUrl} alt={item.name} />
                  <span className="closet-card-tag">{item.category}</span>
                  <div className="closet-card-actions">
                    <button
                      className="closet-action"
                      onClick={() => handleStartEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="closet-action danger"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="closet-card-body">
                  <h3>{item.name}</h3>
                  {item.brand && <p className="closet-card-meta">{item.brand}</p>}
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