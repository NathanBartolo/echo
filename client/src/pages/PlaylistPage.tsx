import { useEffect, useState, useRef } from "react";
import { getPlaylists, createPlaylist, deletePlaylist, updatePlaylistCover } from "../api/playlists";
import NavBar from "../components/NavBar";
import CreatePlaylistModal from "../components/CreatePlaylistModal";
import "../styles/playlist.css";

export default function PlaylistPage() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlistCovers, setPlaylistCovers] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    setLoading(true);
    const data = await getPlaylists();
    setPlaylists(data);
    
    // Load cover images from playlists
    const covers: { [key: string]: string } = {};
    data.forEach((p: any) => {
      if (p.coverImage) {
        covers[p._id] = p.coverImage;
      }
    });
    setPlaylistCovers(covers);
    setLoading(false);
  };

  const handleCreate = async (name: string) => {
    await createPlaylist(name);
    setIsModalOpen(false);
    fetchList();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete playlist?")) return;
    await deletePlaylist(id);
    fetchList();
  };

  const handleCoverClick = (playlistId: string) => {
    setSelectedPlaylistId(playlistId);
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPlaylistId) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageData = event.target?.result as string;
      setPlaylistCovers((prev) => ({
        ...prev,
        [selectedPlaylistId]: imageData,
      }));
      
      // Save to backend
      try {
        const result = await updatePlaylistCover(selectedPlaylistId, imageData);
        console.log("Cover image saved:", result);
        // Reload playlists to ensure data is synced
        fetchList();
      } catch (err) {
        console.error("Failed to save cover image:", err);
      }
    };
    reader.readAsDataURL(file);
    setSelectedPlaylistId(null);
  };

  return (
    <>
      <NavBar />
      <div className="playlist-page">
        <div className="playlists-container">
          <div className="playlists-header">
            <h1>Your Playlists</h1>
            <p>Curate your own collections of favorite tracks and create the perfect soundtrack for every moment.</p>
          </div>

          <div className="playlist-actions-header">
            <button className="create-btn" onClick={() => setIsModalOpen(true)}>+ Create New Playlist</button>
          </div>

          {loading ? (
            <p className="loading">Loading...</p>
          ) : playlists.length === 0 ? (
            <div className="empty-state">
              <p>No playlists yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="playlists-list">
              {playlists.map((p) => (
                <div key={p._id} className="playlist-item">
                  <div className="playlist-cover" onClick={() => handleCoverClick(p._id)}>
                    {playlistCovers[p._id] ? (
                      <img src={playlistCovers[p._id]} alt={p.name} className="cover-image" />
                    ) : (
                      <div className="cover-placeholder">
                        <span>♪</span>
                      </div>
                    )}
                  </div>
                  <div className="playlist-details">
                    <h2>{p.name}</h2>
                    <p className="song-count">{p.songs?.length || 0} songs</p>
                    <div className="playlist-item-actions">
                      <button className="open-btn" onClick={() => (window.location.href = `/playlist/${p._id}`)}>Open</button>
                      <button className="delete-btn" onClick={() => handleDelete(p._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CreatePlaylistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreate} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
    </>
  );
}
