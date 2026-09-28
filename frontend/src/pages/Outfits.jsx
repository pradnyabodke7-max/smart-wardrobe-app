import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function Outfits() {
  const [items, setItems] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <div className="app-shell">
      <Navbar />

      <div className="page-content">
        <div className="page-header">
          <h1>Outfit Builder</h1>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <form className="builder-card" onSubmit={handleSave}>
              <h2>Create a new outfit</h2>

              {error && <p className="error-text">{error}</p>}

              <div className="form-row">
                <div className="form-group">
                  <label>Outfit name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. College day look"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Notes (optional)</label>
                  <input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Good for cool weather"
                  />
                </div>
              </div>

              <label className="pick-label">
                Pick items from your closet ({selected.length} selected)
              </label>

              {items.length === 0 ? (
                <p className="empty-text">
                  Your closet is empty. <Link to="/closet">Add items first</Link>.
                </p>
              ) : (
                <div className="pick-grid">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className={
                        selected.includes(item._id)
                          ? "pick-card selected"
                          : "pick-card"
                      }
                      onClick={() => toggleItem(item._id)}
                    >
                      <img src={item.imageUrl} alt={item.name} />
                      <p>{item.name}</p>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                className="primary-btn"
                disabled={saving || items.length === 0}
              >
                {saving ? "Saving..." : "Save Outfit"}
              </button>
            </form>

            <h2 className="section-title">Saved outfits</h2>

            {outfits.length === 0 ? (
              <p className="empty-text">No outfits saved yet.</p>
            ) : (
              <div className="outfit-grid">
                {outfits.map((outfit) => (
                  <div className="outfit-card" key={outfit._id}>
                    <div className="outfit-thumbs">
                      {outfit.items.filter(Boolean).map((item) => (
                        <img key={item._id} src={item.imageUrl} alt={item.name} />
                      ))}
                    </div>
                    <div className="outfit-card-body">
                      <h3>{outfit.name}</h3>
                      {outfit.notes && (
                        <p className="closet-card-meta">{outfit.notes}</p>
                      )}
                      <button
                        className="delete-btn"
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