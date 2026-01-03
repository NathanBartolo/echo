import { useState } from "react";
import "../styles/createPlaylistModal.css";

// ============================================
// CREATE PLAYLIST MODAL - Modal for playlist creation
// ============================================

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export default function CreatePlaylistModal({ isOpen, onClose, onCreate }: CreatePlaylistModalProps) {
  const [playlistName, setPlaylistName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = playlistName.trim();
    
    if (!trimmedName) {
      setError("Playlist name cannot be empty");
      return;
    }
    
    if (trimmedName.length > 50) {
      setError("Playlist name must be less than 50 characters");
      return;
    }

    onCreate(trimmedName);
    setPlaylistName("");
    setError("");
  };

  const handleClose = () => {
    setPlaylistName("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Playlist</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="playlist-name">Playlist Name</label>
            <input
              id="playlist-name"
              type="text"
              placeholder="Enter playlist name..."
              value={playlistName}
              onChange={(e) => {
                setPlaylistName(e.target.value);
                setError("");
              }}
              maxLength={50}
              autoFocus
              className="playlist-input"
            />
            <div className="char-count">{playlistName.length}/50</div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="create-btn-modal">
              Create Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
