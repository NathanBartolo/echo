import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { getPlaylist, removeSongFromPlaylist, updatePlaylistCover } from "../api/playlists";
import "../styles/playlistDetail.css";

export default function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const data = await getPlaylist(id);
      setPlaylist(data);
      setDescriptionText(data.description || "");
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = "";
      }
    };
  }, [currentAudio]);

  const playSongPreview = (previewUrl: string) => {
    if (!previewUrl) return;
    if (currentAudio) {
      currentAudio.pause();
    }
    const audio = new Audio(previewUrl);
    audio.play().catch((err) => console.error("Error playing preview:", err));
    setCurrentAudio(audio);
  };

  const stopSongPreview = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = "";
      setCurrentAudio(null);
    }
  };

  const handleRemove = async (songId: string) => {
    if (!id) return;
    if (!confirm("Remove this song from playlist?")) return;
    await removeSongFromPlaylist(id, songId);
    const data = await getPlaylist(id);
    setPlaylist(data);
  };

  const handleSaveDescription = async () => {
    if (!id) return;
    try {
      await updatePlaylistCover(id, descriptionText);
      setPlaylist({ ...playlist, description: descriptionText });
      setIsEditingDescription(false);
    } catch (err) {
      console.error("Failed to save description:", err);
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="playlist-detail-container">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  if (!playlist) {
    return (
      <>
        <NavBar />
        <div className="playlist-detail-container">
          <p>Playlist not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="playlist-detail-container">
        <div className="playlist-header">
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <div className="playlist-hero">
            <div className="playlist-cover">
              {playlist.coverImage ? (
                <img src={playlist.coverImage} alt={playlist.name} />
              ) : (
                <div className="cover-placeholder">
                  <span>♪</span>
                </div>
              )}
            </div>
            <div className="playlist-info">
              <p className="playlist-label">Playlist</p>
              <h1>{playlist.name}</h1>
              <p className="song-count">{playlist.songs?.length || 0} songs</p>
              <div className="playlist-description-section">
                {isEditingDescription ? (
                  <div className="description-editor">
                    <textarea
                      value={descriptionText}
                      onChange={(e) => setDescriptionText(e.target.value)}
                      placeholder="Add an optional description to your playlist..."
                      maxLength={300}
                    />
                    <div className="char-count">{descriptionText.length}/300</div>
                    <div className="editor-actions">
                      <button className="cancel-desc-btn" onClick={() => setIsEditingDescription(false)}>Cancel</button>
                      <button className="save-desc-btn" onClick={handleSaveDescription}>Save</button>
                    </div>
                  </div>
                ) : playlist.description ? (
                  <div className="playlist-bio" onClick={() => setIsEditingDescription(true)}>
                    <p>{playlist.description}</p>
                  </div>
                ) : (
                  <div className="description-placeholder" onClick={() => setIsEditingDescription(true)}>
                    <p>Click to add description</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="playlist-songs">
          <h2>All Songs</h2>
          {playlist.songs && playlist.songs.length > 0 ? (
            <div className="songs-list">
              {playlist.songs.map((song: any, index: number) => (
                <div
                  key={song._id}
                  className="song-list-item"
                  onMouseEnter={() => playSongPreview(song.previewUrl)}
                  onMouseLeave={stopSongPreview}
                >
                  <div className="song-number">{index + 1}</div>
                  <div className="song-thumbnail">
                    <img src={song.cover} alt={song.title} />
                  </div>
                  <div className="song-details">
                    <h3>{song.title}</h3>
                    <p>{song.artist}</p>
                  </div>
                  <div className="song-list-actions">
                    <button
                      className="open-song-btn"
                      onClick={() => navigate(`/song/${encodeURIComponent(song.trackId || song._id)}`, { state: { song } })}
                    >
                      Open
                    </button>
                    <button className="remove-song-btn" onClick={() => handleRemove(song._id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-songs">
              <p>No songs in this playlist. Add some to get started!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
