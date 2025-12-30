import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getPlaylists, createPlaylist, deletePlaylist, updatePlaylistCover } from "../api/playlists";
import { useAuth } from "../context/AuthContext";
import NavBar from "../components/NavBar";
import CreatePlaylistModal from "../components/CreatePlaylistModal";
import "../styles/playlist.css";

export default function PlaylistPage() {
  const navigate = useNavigate();
  const { favorites } = useAuth();
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

        <div className="playlists-container">
          <div className="playlists-header">
            <div className="header-top">
              <span className="playlist-badge">Your Library</span>
              <h1 className="playlists-title">
                Playlists<span className="title-dot">.</span>
              </h1>
            </div>
            <div className="header-bottom">
              <p className="playlists-description">
                Curate your own collections and create the perfect soundtrack for every moment.
              </p>
              <button className="create-btn" onClick={() => setIsModalOpen(true)}>
                <span>+</span> New Playlist
              </button>
            </div>
          </div>

          {loading ? (
            <p className="loading">Loading...</p>
          ) : (
            <>
              <div className="playlists-list">
                {/* Liked Songs - Always First */}
                <div 
                  className="playlist-item liked-songs" 
                  onClick={() => navigate('/playlist/favorites')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="playlist-cover liked-cover">
                    <div className="liked-heart">♥</div>
                  </div>
                  <div className="playlist-details">
                    <h2>Liked Songs</h2>
                    <p className="song-count">{favorites?.length || 0} songs</p>
                    <div className="playlist-item-actions">
                      <button 
                        className="open-btn" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          navigate('/playlist/favorites'); 
                        }}
                      >
                        Open
                      </button>
                    </div>
                  </div>
                </div>

                {/* User Created Playlists */}
                {playlists.map((p, index) => (
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
                        <button className="open-btn" onClick={() => (window.location.href = `/playlist/${p._id}`)}>
                          Open
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(p._id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show message if no user playlists */}
              {playlists.length === 0 && (
                <div className="empty-message">
                  <p>Create your first playlist to organize your music</p>
                </div>
              )}
            </>
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
