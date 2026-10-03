import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "./Outfits.css";

const CATEGORIES = ["Top", "Bottom", "Dress", "Outerwear", "Footwear", "Accessory"];

function Outfits() {
  const [items, setItems] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const loadData = async () => {
    try {
      const [closetRes, outfitRes] = await Promise.all([
        api.get("/api/closet"),
        api.get("/api/outfits"),
      ]);
      setItems(closetRes.data);
      setOutfits(outfitRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleItem = (id) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    if (selected.length === 0) {
      setError("Pick at least one item for this outfit.");
      return;
    }

    setSaving(true);
    try {
      await api.post("/api/outfits", { name, items: selected, notes });
      setName("");
      setNotes("");
      setSelected([]);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save outfit");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/outfits/${id}`);
      setOutfits(outfits.filter((o) => o._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const selectedItems = selected
    .map((id) => items.find((i) => i._id === id))
    .filter(Boolean);

  const visibleItems = categoryFilter
    ? items.filter((i) => i.category === categoryFilter)
    : items;

  return (
    <div className="app-shell outfits-page">
      <Navbar />

      <div className="outfits-content">
        <div className="outfits-head">
          <p className="outfits-eyebrow">Mix &amp; match</p>
          <h1 className="outfits-title">Outfit Builder</h1>
          <p className="outfits-sub">
            Pick pieces from your closet and see the look come together.
          </p>
        </div>

        {loading ? (
          <p className="empty-text">Loading...</p>
        ) : (
          <>
            <div className="builder">
              {/* ---------- Left: look board ---------- */}
              <form className="board" onSubmit={handleSave}>
                <h2 className="board-title">Your Look</h2>
                <p className="board-count">
                  {selected.length} {selected.length === 1 ? "piece" : "pieces"} selected
                </p>

                <div className="board-canvas">
                  {selectedItems.length === 0 ? (
                    <div className="board-empty">
                      Tap pieces on the right to start building your outfit
                    </div>
                  ) : (
                    selectedItems.map((item) => (
                      <div className="board-piece" key={item._id}>
                        <img src={item.imageUrl} alt={item.name} />
                        <span className="board-piece-tag">{item.category}</span>
                        <button
                          type="button"
                          className="board-piece-remove"
                          onClick={() => toggleItem(item._id)}
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {error && <p className="error-text">{error}</p>}

                <div className="board-field">
                  <label>Outfit name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. College day look"
                    required
                  />
                </div>
                <div className="board-field">
                  <label>Notes (optional)</label>
                  <input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Good for cool weather"
                  />
                </div>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={saving || items.length === 0}
                >
                  {saving ? "Saving..." : "Save Outfit"}
                </button>
              </form>

              {/* ---------- Right: closet picker ---------- */}
              <div>
                <h2 className="picker-title">Your Closet</h2>

                <div className="pill-row">
                  <button
                    type="button"
                    className={`pill ${categoryFilter === "" ? "active" : ""}`}
                    onClick={() => setCategoryFilter("")}
                  >
                    All
                  </button>
                  {CATEGORIES.map((c) => (
                    <button
                      type="button"
                      key={c}
                      className={`pill ${categoryFilter === c ? "active" : ""}`}
                      onClick={() => setCategoryFilter(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {items.length === 0 ? (
                  <p className="empty-text">
                    Your closet is empty. <Link to="/closet">Add items first</Link>.
                  </p>
                ) : visibleItems.length === 0 ? (
                  <p className="empty-text">No items in this category.</p>
                ) : (
                  <div className="pick-grid">
                    {visibleItems.map((item) => (
                      <div
                        key={item._id}
                        className={
                          selected.includes(item._id)
                            ? "pick-card selected"
                            : "pick-card"
                        }
                        onClick={() => toggleItem(item._id)}
                      >
                        <div className="pick-card-img">
                          <img src={item.imageUrl} alt={item.name} />
                        </div>
                        <span className="pick-check">✓</span>
                        <p>{item.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ---------- Saved outfits ---------- */}
            <div className="saved-head">
              <p className="outfits-eyebrow">Curated looks</p>
              <h2 className="saved-title">Saved Outfits</h2>
            </div>

            {outfits.length === 0 ? (
              <p className="empty-text">No outfits saved yet.</p>
            ) : (
              <div className="saved-grid">
                {outfits.map((outfit) => (
                  <div className="saved-card" key={outfit._id}>
                    <div className="saved-thumbs">
                      {outfit.items.filter(Boolean).map((item) => (
                        <img key={item._id} src={item.imageUrl} alt={item.name} />
                      ))}
                    </div>
                    <div className="saved-body">
                      <h3>{outfit.name}</h3>
                      {outfit.notes && <p className="saved-notes">{outfit.notes}</p>}
                      <button
                        type="button"
                        className="saved-delete"
                        onClick={() => handleDelete(outfit._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Outfits;