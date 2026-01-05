// ============================================
// PLAYLIST DETAIL PAGE - Playlist songs and management
// ============================================

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import { getPlaylist, removeSongFromPlaylist, updatePlaylistDescription, addSongToPlaylist, reorderPlaylistSongs } from "../api/playlists";
import { removeFavorite } from "../api/favorites";
import "../styles/detail.css";

export default function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favorites, setFavorites } = useAuth();
  const isFavoritesPage = id === 'favorites';
  const [playlist, setPlaylist] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addingMessage, setAddingMessage] = useState<{ [key: string]: string }>({});
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        if (isFavoritesPage) {
          // Create virtual playlist from favorites
          setPlaylist({
            _id: 'favorites',
            name: 'Liked Songs',
            description: 'Your favorite tracks in one place',
            songs: favorites || [],
            coverImage: null
          });
          setDescriptionText('Your favorite tracks in one place');
        } else {
          const data = await getPlaylist(id);
          setPlaylist(data);
          setDescriptionText(data.description || "");
        }
      } catch (err) {
        console.error("Error loading playlist:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, favorites, isFavoritesPage]);

  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = "";
      }
    };
  }, [currentAudio]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const playSongPreview = (previewUrl: string | null | undefined) => {
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
    const confirmMsg = isFavoritesPage 
      ? "Remove from Liked Songs?" 
      : "Remove this song from playlist?";
    if (!confirm(confirmMsg)) return;
    
    try {
      if (isFavoritesPage) {
        // Remove from favorites
        await removeFavorite(songId);
        const updated = (favorites || []).filter(s => s.id !== songId);
        setFavorites(updated);
        // Update local playlist state
        setPlaylist({ ...playlist, songs: updated });
      } else {
        // Remove from regular playlist
        await removeSongFromPlaylist(id, songId);
        const data = await getPlaylist(id);
        setPlaylist(data);
      }
    } catch (err) {
      console.error("Failed to remove song:", err);
    }
  };

  const handleSaveDescription = async () => {
    if (!id) return;
    try {
      await updatePlaylistDescription(id, descriptionText);
      setPlaylist({ ...playlist, description: descriptionText });
      setIsEditingDescription(false);
    } catch (err) {
      console.error("Failed to save description:", err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/search?q=${encodeURIComponent(searchQuery)}&limit=10`);
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddSong = async (song: any) => {
    if (!id) return;
    try {
      await addSongToPlaylist(id, song);
      const updatedPlaylist = await getPlaylist(id);
      setPlaylist(updatedPlaylist);
      
      setAddingMessage({ [song.trackId]: "Added!" });
      setTimeout(() => setAddingMessage({}), 2000);
    } catch (err) {
      console.error("Failed to add song:", err);
      setAddingMessage({ [song.trackId]: "Error adding song" });
      setTimeout(() => setAddingMessage({}), 2000);
    }
  };

  const isSongInPlaylist = (trackId: string) => {
    return playlist?.songs?.some((s: any) => s.trackId === trackId || s._id === trackId);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (isFavoritesPage) return; // Don't allow reordering in favorites
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget.innerHTML);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (isFavoritesPage) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    if (isFavoritesPage || draggedIndex === null || !id) return;
    e.preventDefault();
    
    if (draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Create a new array with reordered songs
    const newSongs = [...playlist.songs];
    const [draggedSong] = newSongs.splice(draggedIndex, 1);
    newSongs.splice(dropIndex, 0, draggedSong);

    // Update local state immediately for responsive UI
    setPlaylist({ ...playlist, songs: newSongs });
    setDraggedIndex(null);
    setDragOverIndex(null);

    // Send update to backend
    try {
      const songIds = newSongs.map((song: any) => song._id);
      await reorderPlaylistSongs(id, songIds);
    } catch (err) {
      console.error("Failed to reorder songs in playlist", id, ":", err);
      // Revert on error
      const data = await getPlaylist(id);
      setPlaylist(data);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
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
              <p className="playlist-label">{isFavoritesPage ? 'Collection' : 'Playlist'}</p>
              <h1>{playlist.name}</h1>
              <p className="song-count">{playlist.songs?.length || 0} songs</p>
              <div className="playlist-description-section">
                {!isFavoritesPage && isEditingDescription ? (
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
                  <div 
                    className="playlist-bio" 
                    onClick={() => !isFavoritesPage && setIsEditingDescription(true)}
                    style={isFavoritesPage ? { cursor: 'default' } : {}}
                  >
                    <p>{playlist.description}</p>
                  </div>
                ) : !isFavoritesPage ? (
                  <div className="description-placeholder" onClick={() => setIsEditingDescription(true)}>
                    <p>Click to add description</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="playlist-songs">
          <div className="songs-header">
            <h2>All Songs</h2>
            {!isFavoritesPage && (
              <div className="search-bar-container" ref={searchContainerRef}>
              <input
                type="text"
                placeholder="Search to add songs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="song-search-input"
              />
              <button onClick={handleSearch} className="search-button">
                {isSearching ? "..." : "Search"}
              </button>
              {searchResults.length > 0 && (
                <div className="search-results-dropdown">
                  {searchResults.map((song: any) => (
                    <div key={song.trackId} className="search-result-item">
                      <div className="result-thumbnail">
                        <img src={song.cover} alt={song.title} />
                      </div>
                      <div className="result-details">
                        <h4>{song.title}</h4>
                        <p>{song.artist}</p>
                      </div>
                      <div className="result-actions">
                        {addingMessage[song.trackId] ? (
                          <span className="add-message">{addingMessage[song.trackId]}</span>
                        ) : isSongInPlaylist(song.trackId) ? (
                          <span className="already-added">✓</span>
                        ) : (
                          <button onClick={() => handleAddSong(song)} className="add-result-btn">
                            +
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            )}
          </div>

          {!isFavoritesPage && searchResults.length > 0 && (
            <div className="search-results-list">
              {searchResults.map((song: any) => (
                <div key={song.trackId} className="search-result-item">
                  <div className="result-thumbnail">
                    <img src={song.cover} alt={song.title} />
                  </div>
                  <div className="result-details">
                    <h4>{song.title}</h4>
                    <p>{song.artist}</p>
                  </div>
                  <div className="result-actions">
                    {addingMessage[song.trackId] ? (
                      <span className="add-message">{addingMessage[song.trackId]}</span>
                    ) : isSongInPlaylist(song.trackId) ? (
                      <span className="already-added">✓</span>
                    ) : (
                      <button onClick={() => handleAddSong(song)} className="add-result-btn">
                        +
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {playlist.songs && playlist.songs.length > 0 ? (
            <div className="songs-list">
              {playlist.songs.map((song: any, index: number) => (
                <div
                  key={song._id}
                  className={`song-list-item ${draggedIndex === index ? 'dragging' : ''} ${dragOverIndex === index ? 'drag-over' : ''} ${!isFavoritesPage ? 'draggable' : ''}`}
                  draggable={!isFavoritesPage}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  onMouseEnter={() => playSongPreview(song.previewUrl)}
                  onMouseLeave={stopSongPreview}
                >
                  {!isFavoritesPage && (
                    <div className="drag-handle" title="Drag to reorder">
                      ⋮⋮
                    </div>
                  )}
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
                      onClick={() => {
                        const songId = isFavoritesPage 
                          ? song.id 
                          : (song.trackId || song._id);
                        navigate(`/song/${encodeURIComponent(songId)}`, { state: { song } });
                      }}
                    >
                      Open
                    </button>
                    <button 
                      className="remove-song-btn" 
                      onClick={() => handleRemove(isFavoritesPage ? song.id : song._id)}
                    >
                      {isFavoritesPage ? 'Unlike' : 'Remove'}
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
