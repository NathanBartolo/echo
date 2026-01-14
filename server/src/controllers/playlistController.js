const Playlist = require("../models/Playlist");

// Create a playlist for a user
exports.createPlaylist = async (req, res) => {
  try {
    const userId = (req.user && req.user._id) || req.body.userId || "demo-user";
    const name = req.body.name;
    const description = req.body.description || "";

    if (!name) return res.status(400).json({ message: "Playlist name required" });

    const playlist = new Playlist({ userId, name, description, songs: [] });
    await playlist.save();
    res.status(201).json(playlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not create playlist" });
  }
};

// Get all playlists for a user 
exports.getPlaylistsForUser = async (req, res) => {
  try {
    const userId = (req.user && req.user._id) || req.params.userId || "demo-user";
    const playlists = await Playlist.find({ userId }).sort({ createdAt: -1 });
    res.json(playlists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch playlists" });
  }
};

// Get single playlist by id function
exports.getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    // enforce ownership unless admin
    if (req.user && req.user.role !== "admin") {
      if (playlist.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    res.json(playlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch playlist" });
  }
};

// Delete playlist function
exports.deletePlaylist = async (req, res) => {
  try {
    const id = req.params.id;
    const playlist = await Playlist.findById(id);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    if (req.user && req.user.role !== "admin") {
      if (playlist.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    await Playlist.findByIdAndDelete(id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not delete playlist" });
  }
};

// Update playlist (cover image, name, description)
exports.updatePlaylist = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Updating playlist:", id, "with data:", req.body);
    
    const playlist = await Playlist.findById(id);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    if (req.user && req.user.role !== "admin") {
      if (playlist.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    if (req.body.coverImage) playlist.coverImage = req.body.coverImage;
    if (req.body.name) playlist.name = req.body.name;
    if (req.body.description !== undefined) playlist.description = req.body.description;

    await playlist.save();
    console.log("Playlist updated successfully:", playlist);
    res.json(playlist);
  } catch (err) {
    console.error("Error updating playlist:", err);
    res.status(500).json({ error: "Could not update playlist" });
  }
};

// Add song to playlist
exports.addSongToPlaylist = async (req, res) => {
  try {
    const playlistId = req.params.id;
    const song = req.body.song;
    if (!song || !song.title) return res.status(400).json({ message: "Song data required" });

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    if (req.user && req.user.role !== "admin") {
      if (playlist.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    playlist.songs.push(song);
    await playlist.save();
    res.json(playlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not add song" });
  }
};

// Remove song from playlist
exports.removeSongFromPlaylist = async (req, res) => {
  try {
    const playlistId = req.params.id;
    const songId = req.params.songId;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    if (req.user && req.user.role !== "admin") {
      if (playlist.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    playlist.songs = playlist.songs.filter(s => s._id.toString() !== songId);
    await playlist.save();
    res.json(playlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not remove song" });
  }
};
