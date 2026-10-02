import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "./Home.css";

const CATEGORIES = ["Top", "Bottom", "Dress", "Outerwear", "Footwear", "Accessory"];

function Home() {
  const name = localStorage.getItem("userName") || "there";
  const [items, setItems] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/api/closet"), api.get("/api/outfits")])
      .then(([closetRes, outfitRes]) => {
        setItems(closetRes.data);
        setOutfits(outfitRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const recentItems = items.slice(0, 4);
  const recentOutfits = outfits.slice(0, 3);

  const categoryCards = CATEGORIES.map((cat) => {
    const inCat = items.filter((i) => i.category === cat);
    return { name: cat, count: inCat.length, image: inCat[0]?.imageUrl };
  });

  return (
    <div className="app-shell home-page">
      <Navbar />

      <div className="home-hero">
        <span className="home-hero-word">STYLE</span>
        <div className="home-hero-inner">
          <p className="home-eyebrow">Welcome back</p>
          <h1>Hi {name}, ready to plan today's look?</h1>
          <p className="home-hero-sub">
            Your wardrobe, organised in one place. Catalogue what you own,
            build outfits, and plan ahead.
          </p>
          <div className="home-hero-actions">
            <Link to="/closet" className="home-btn">Go to Closet</Link>
            <Link to="/outfits" className="home-btn-ghost">Build an Outfit</Link>
          </div>
        </div>
      </div>

      <div className="home-content">
        <div className="home-stats">
          <div className="home-stat">
            <span className="home-stat-number">{items.length}</span>
            <span className="home-stat-label">Items in Closet</span>
          </div>
          <div className="home-stat">
            <span className="home-stat-number">{outfits.length}</span>
            <span className="home-stat-label">Saved Outfits</span>
          </div>
          <div className="home-stat">
            <span className="home-stat-number">
              {new Set(items.map((i) => i.category)).size}
            </span>
            <span className="home-stat-label">Categories</span>
          </div>
        </div>

        <div className="home-section-head">
          <p className="home-section-eyebrow">Shop by category</p>
          <h2 className="home-section-title">Find Your Perfect Style</h2>
        </div>
        <div className="home-cats">
          {categoryCards.map((c) => (
            <Link to="/closet" className="home-cat" key={c.name}>
              {c.image ? (
                <img src={c.image} alt={c.name} />
              ) : (
                <div className="home-cat-empty" />
              )}
              <div className="home-cat-label">
                <span className="home-cat-name">{c.name}</span>
                <span className="home-cat-count">{c.count} items</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="home-section-head">
          <p className="home-section-eyebrow">Quick access</p>
          <h2 className="home-section-title">Plan Your Look</h2>
        </div>
        <div className="home-shortcuts">
          <Link to="/closet" className="home-shortcut">
            <span className="home-shortcut-icon">👕</span>
            <h3>My Closet</h3>
            <p>View and manage your clothing items</p>
          </Link>
          <Link to="/outfits" className="home-shortcut">
            <span className="home-shortcut-icon">✨</span>
            <h3>Outfit Builder</h3>
            <p>Combine items into saved looks</p>
          </Link>
          <Link to="/calendar" className="home-shortcut">
            <span className="home-shortcut-icon">📅</span>
            <h3>Style Calendar</h3>
            <p>Plan what to wear, day by day</p>
          </Link>
        </div>

        {!loading && recentItems.length > 0 && (
          <>
            <div className="home-section-head">
              <p className="home-section-eyebrow">Fresh in your closet</p>
              <h2 className="home-section-title">Recently Added</h2>
              <Link to="/closet" className="home-section-link">View all</Link>
            </div>
            <div className="home-items">
              {recentItems.map((item) => (
                <div className="home-item" key={item._id}>
                  <div className="home-item-img">
                    <img src={item.imageUrl} alt={item.name} />
                    <span className="home-item-tag">{item.category}</span>
                  </div>
                  <div className="home-item-body">
                    <h3>{item.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && recentOutfits.length > 0 && (
          <>
            <div className="home-section-head">
              <p className="home-section-eyebrow">Curated looks</p>
              <h2 className="home-section-title">Your Outfits</h2>
              <Link to="/outfits" className="home-section-link">View all</Link>
            </div>
            <div className="home-outfits">
              {recentOutfits.map((outfit) => (
                <div className="home-outfit" key={outfit._id}>
                  <div className="home-outfit-thumbs">
                    {outfit.items.filter(Boolean).map((item) => (
                      <img key={item._id} src={item.imageUrl} alt={item.name} />
                    ))}
                  </div>
                  <div className="home-outfit-body">
                    <h3>{outfit.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && items.length === 0 && (
          <p className="home-empty">
            Your closet is empty. <Link to="/closet">Add your first item</Link> to get started.
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;