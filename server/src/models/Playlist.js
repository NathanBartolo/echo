// Stores user playlists with songs and metadata

const mongoose = require("mongoose");

// Song schema - embedded within playlist
// Each song gets its own MongoDB ID for easy removal
const SongSchema = new mongoose.Schema({
  trackId: { type: String }, // iTunes track ID for linking
  title: { type: String, required: true },
  artist: { type: String },
  album: { type: String },
  cover: { type: String },
  previewUrl: { type: String },
}, { _id: true }); // each song will have an id for removal

// Main playlist schema
const PlaylistSchema = new mongoose.Schema({
  // User ID who owns this playlist
  userId: { type: String, required: true },
  // Playlist name
  name: { type: String, required: true },
  // Optional playlist description
  description: { type: String, default: "" },
  // Base64 or image URL for playlist cover art
  coverImage: { type: String, default: "" },
  // When playlist was created
  createdAt: { type: Date, default: Date.now },
  // Array of songs in the playlist
  songs: [SongSchema]
});

module.exports = mongoose.model("Playlist", PlaylistSchema);
