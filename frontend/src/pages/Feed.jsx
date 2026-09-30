import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

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

  return (
    <div className="app-shell">
      <Navbar />

      <div className="page-content">
        <div className="page-header">
          <h1>Home Feed</h1>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : outfits.length === 0 ? (
          <p className="empty-text">
            No outfits saved yet. <Link to="/outfits">Build your first outfit</Link>.
          </p>
        ) : (
          <div className="feed-list">
            {outfits.map((outfit) => (
              <div className="feed-card" key={outfit._id}>
                <div className="feed-thumbs">
                  {outfit.items.filter(Boolean).map((item) => (
                    <img key={item._id} src={item.imageUrl} alt={item.name} />
                  ))}
                </div>
                <div className="feed-card-body">
                  <h2>{outfit.name}</h2>
                  {outfit.notes && <p className="closet-card-meta">{outfit.notes}</p>}
                  <p className="feed-items-list">
                    {outfit.items.filter(Boolean).map((item) => item.name).join(" · ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;