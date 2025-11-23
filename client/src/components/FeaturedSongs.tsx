import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/featured.css";

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  cover: string;
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
      <div className="featured-header">
        <div className="featured-desc">
          <h2>Discover the Vibe</h2>
          <p>
            Handpicked tracks that set the tone — from modern hits to timeless
            classics. Click on any to explore more!
          </p>
        </div>
        <div className="featured-label">
          <h3> Featured Songs</h3>
        </div>
      </div>

      <div className="featured-grid">
        {featured.map((song) => (
          <div
            key={song.id}
            className="featured-card"
            onClick={() =>
              navigate(`/song/${song.id}`, { state: { song } })
            }
          >
            <img src={song.cover} alt={song.title} />
            <div className="overlay">
              <p>{song.title}</p>
              <span>{song.artist}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedSongs;
