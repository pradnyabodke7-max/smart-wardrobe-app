import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import "./Feed.css";

function Feed() {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/outfits")
      .then((res) => setOutfits(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const collageClass = (count) => {
    if (count <= 1) return "feed-collage one";
    if (count === 3) return "feed-collage three";
    return "feed-collage";
  };

  return (
    <div className="app-shell feed-page">
      <Navbar />

      <div className="feed-content">
        <div className="feed-head">
          <p className="feed-eyebrow">Lookbook</p>
          <h1 className="feed-title">Home Feed</h1>
          <p className="feed-sub">
            All your saved looks in one place. Get inspired by what you have
            already put together.
          </p>
        </div>

        {loading ? (
          <p className="empty-text">Loading...</p>
        ) : outfits.length === 0 ? (
          <p className="empty-text">
            No outfits saved yet. <Link to="/outfits">Build your first outfit</Link>.
          </p>
        ) : (
          <div className="feed-list">
            {outfits.map((outfit, index) => {
              const pieces = outfit.items.filter(Boolean);
              const collagePieces = pieces.slice(0, 4);

              return (
                <div
                  className={index % 2 === 1 ? "feed-card flip" : "feed-card"}
                  key={outfit._id}
                >
                  <div className={collageClass(collagePieces.length)}>
                    {collagePieces.map((item) => (
                      <img key={item._id} src={item.imageUrl} alt={item.name} />
                    ))}
                  </div>

                  <div className="feed-details">
                    <p className="feed-tag">
                      Look {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2 className="feed-name">{outfit.name}</h2>
                    {outfit.notes && <p className="feed-notes">{outfit.notes}</p>}

                    <p className="feed-pieces-label">
                      Pieces in this look ({pieces.length})
                    </p>
                    {pieces.map((item) => (
                      <div className="feed-piece" key={item._id}>
                        <img src={item.imageUrl} alt={item.name} />
                        <div>
                          <div className="feed-piece-name">{item.name}</div>
                          <div className="feed-piece-cat">{item.category}</div>
                        </div>
                      </div>
                    ))}

                    <Link to="/calendar" className="feed-link">
                      Plan this look
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;