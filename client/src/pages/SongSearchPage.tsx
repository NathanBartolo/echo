import { useEffect, useState } from "react";
import "../styles/navbar.css";  // load first
import "./../styles/songSearch.css";  // load second
import Navbar from "../components/NavBar";
import { useNavigate } from "react-router-dom";


interface Song {
  trackId?: number | string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  previewUrl?: string | null;
}

const SongSearchPage = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");

  // Fetch featured/default songs on load and when genre changes
  useEffect(() => {
    const fetchDefaultSongs = async (g: string) => {
      try {
        const q = encodeURIComponent(g ? `top hits ${g}` : `top hits`);
        const genreParam = g ? `&genre=${encodeURIComponent(g)}` : "";
        const limitParam = g ? `&limit=8` : `&limit=5`;
        const res = await fetch(`http://localhost:5000/api/search?q=${q}${genreParam}${limitParam}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : [data];
        setSongs(list);
      } catch (err) {
        console.error("Error fetching default songs:", err);
      }
    };

    fetchDefaultSongs(genre);
  }, [genre]);

  const navigate = useNavigate();

  // Handle search
  const handleSearch = async () => {
    if (!query.trim()) return;
    const queryWithGenre = `${query}${genre ? ` ${genre}` : ""}`;
    const limitParam = genre ? `&limit=8` : `&limit=5`;
    const res = await fetch(
      `http://localhost:5000/api/search?q=${encodeURIComponent(queryWithGenre)}${limitParam}`
    );
    const data = await res.json();
    setSongs(Array.isArray(data) ? data : [data]);
  };

  return (
    <>
    <Navbar />
      
      <div className="song-search-container">
        <h1>Search Songs</h1>
        <div className="search-controls">
          <input
            type="text"
            placeholder="Search for songs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="genre-select"
          >
            <option value="">All Genres</option>
            <option value="pop">Pop</option>
            <option value="rock">Rock</option>
            <option value="rnb">R&B</option>
            <option value="hiphop">Hip-Hop</option>
            <option value="country">Country</option>
            <option value="electronic">Electronic</option>
          </select>
          <button onClick={handleSearch}>Search</button>
        </div>

        {/* suggestions removed - using song cards only */}

        <div className="song-grid">
          {songs.map((song, index) => (
            <div
              className="song-card"
              key={index}
              onClick={() => {
                const id = song.trackId ?? song.title;
                navigate(`/song/${encodeURIComponent(String(id))}`, { state: { song } });
              }}
              >
                <img src={song.cover} alt={song.title} />
                <h3>{song.title}</h3>
                <p>{song.artist}</p>
              </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SongSearchPage;
