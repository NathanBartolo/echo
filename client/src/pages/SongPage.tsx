// ============================================
// SONG PAGE - Song details and controls
// ============================================

import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import "../styles/song.css";
import NavBar from "../components/NavBar";
import HeartButton from "../components/HeartButton";
import { getPlaylists, addSongToPlaylist } from "../api/playlists";

interface Song {
  title: string;
  artist: string;
  album: string;
  cover: string;
  previewUrl?: string;
}

const SongPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [song, setSong] = useState<Song | null>(location.state?.song || null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [playlistMsg, setPlaylistMsg] = useState<string | null>(null);

  // debug: show incoming navigation state
  useEffect(() => {
    if (location.state && (location.state as any).song) {
      console.debug("SongPage: received song in location.state:", (location.state as any).song);
    } else {
      console.debug("SongPage: no song in location.state, id=", id);
    }
  }, [location.state, id]);

  useEffect(() => {
    const needsFetch = !song || !song.previewUrl || !song.cover || !song.album;
    console.debug("SongPage: needsFetch=", needsFetch, "current song:", song, "id:", id);
    if (needsFetch && id) {
      fetch(`http://localhost:5000/api/song/${id}`)
        .then((res) => res.json())
        .then((data) => setSong(data))
        .catch((err) => console.error(err));
    }
  }, [id, song]);

  // load user's playlists for add-to-playlist dropdown
  useEffect(() => {
    (async () => {
      try {
        const data = await getPlaylists();
        setPlaylists(data || []);
        if (data && data.length) setSelectedPlaylist(data[0]._id);
      } catch (err) {
        console.error("Error loading playlists", err);
      }
    })();
  }, []);

  if (!song) return <div>Loading...</div>;

  return (
    <div className="song-page">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="sound-waves">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="wave-bar"
              style={{
                height: `${Math.random() * 120 + 60}px`,
                animationDelay: `${Math.random() * 0.8}s`,
              }}
            />
          ))}
        </div>

        <div className="vinyl-record">
          <div className="record-center"></div>
        </div>

        {Array.from({ length: 20 }).map((_, i) => {
          const notes = ['♪', '♫', '♬', '𝄞'];
          return (
            <div
              key={i}
              className="floating-note"
              style={{
                left: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 40 + 25}px`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${Math.random() * 5 + 6}s`,
              }}
            >
              {notes[Math.floor(Math.random() * notes.length)]}
            </div>
          );
        })}
      </div>

      <NavBar />

      {/* SONG DETAILS */}
      <section className="song-content">
        <div className="album-cover">
          <img src={song.cover} alt={song.title} />
        </div>

        <div className="song-info">
          <h1>{song.title}</h1>
          <h2>{song.artist}</h2>
          <p><em>{song.album}</em></p>

          <div className="song-actions">
            <HeartButton
              song={{
                id: String(id),
                title: song.title,
                artist: song.artist,
                album: song.album,
                cover: song.cover,
                previewUrl: song.previewUrl,
              }}
              size="large"
            />
          </div>

          {song.previewUrl && (
            <audio controls src={song.previewUrl} className="audio-player" />
          )}

          <div className="playlist-controls">
            <select value={selectedPlaylist ?? ""} onChange={(e) => setSelectedPlaylist(e.target.value)}>
              {playlists.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
            <button
              onClick={async () => {
                if (!selectedPlaylist || !song) return setPlaylistMsg("Select a playlist first");
                try {
                  await addSongToPlaylist(selectedPlaylist, song);
                  setPlaylistMsg("Added to playlist");
                } catch (err) {
                  console.error(err);
                  setPlaylistMsg("Failed to add");
                }
                setTimeout(() => setPlaylistMsg(null), 2500);
              }}
            >Add</button>
            {playlistMsg && <div className="playlist-msg">{playlistMsg}</div>}
          </div>
          
          <p className="song-desc">
            This track is part of the album <strong>{song.album}</strong> by{" "}
            <strong>{song.artist}</strong>. Enjoy a preview or add it to your
            playlist to explore more from this artist.
          </p>
        </div>
      </section>
    </div>
  );
};

export default SongPage;
