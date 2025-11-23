import { useEffect, useState } from "react";
import { getPlaylists, createPlaylist, deletePlaylist } from "../api/playlists";
import NavBar from "../components/NavBar";
import "../styles/playlist.css";

export default function PlaylistPage() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    setLoading(true);
    const data = await getPlaylists();
    setPlaylists(data);
    setLoading(false);
  };

  const handleCreate = async () => {
    const name = prompt("Playlist name?");
    if (!name) return;
    await createPlaylist(name);
    fetchList();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete playlist?")) return;
    await deletePlaylist(id);
    fetchList();
  };

  return (
    <>
      <NavBar />
      <div className="playlist-page">
        <div className="playlist-container">
          <div className="playlist-header">
            <h1>Your Playlists</h1>
            <button className="create-btn" onClick={handleCreate}>+ Create Playlist</button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="playlist-list">
              {playlists.map(p => (
                <div key={p._id} className="playlist-card">
                  <div className="playlist-meta">
                    <h3 className="playlist-name">{p.name}</h3>
                    <p className="playlist-count">{p.songs?.length || 0} songs</p>
                  </div>
                  <div className="playlist-actions">
                    <button className="open-btn" onClick={() => (window.location.href = `/playlist/${p._id}`)}>Open</button>
                    <button className="delete-btn" onClick={() => handleDelete(p._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
