// ============================================
// FEATURED SONGS - Display featured songs grid
// ============================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeartButton from "./HeartButton";
import "./../styles/featured.css";

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  cover: string;
  previewUrl?: string | null;
}

const FeaturedSongs = () => {
  const [featured, setFeatured] = useState<Song[]>([]);
  const navigate = useNavigate();

  // Fetch featured songs from backend
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/featured");
        const data = await res.json();
        setFeatured(data);
      } catch (err) {
        console.error("Error fetching featured songs:", err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="featured-section">
      <div className="featured-container">
        <div className="featured-header">
          <div className="header-top">
            <span className="featured-badge">Curated Weekly</span>
            <h2 className="featured-title">
              Staff Picks<span className="title-dot">.</span>
            </h2>
          </div>
          <p className="featured-description">
            Songs we can't stop playing. Fresh discoveries and timeless favorites 
            in heavy rotation.
          </p>
        </div>

        <div className="featured-grid">
          {featured.map((song, index) => (
            <div
              key={song.id}
              className={`featured-card card-${(index % 4) + 1}`}
              onClick={() =>
                navigate(`/song/${song.id}`, { state: { song } })
              }
            >
              <div className="card-image">
                <img src={song.cover} alt={song.title} />
                <div className="card-heart">
                  <HeartButton
                    song={{
                      id: String(song.id),
                      title: song.title,
                      artist: song.artist,
                      album: song.album,
                      cover: song.cover,
                      previewUrl: song.previewUrl,
                    }}
                    size="medium"
                  />
                </div>
              </div>
              <div className="card-content">
                <h3 className="card-title">{song.title}</h3>
                <p className="card-artist">{song.artist}</p>
              </div>
              <div className="card-number">{String(index + 1).padStart(2, '0')}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSongs;
