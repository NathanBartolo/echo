const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
  trackId: { type: String }, // iTunes trackId
  title: { type: String, required: true },
  artist: { type: String },
  album: { type: String },
  cover: { type: String },
  previewUrl: { type: String },
}, { _id: true }); // each song will have an id for removal

const PlaylistSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // "demo-user" for now
  name: { type: String, required: true },
  description: { type: String, default: "" },
  coverImage: { type: String, default: "" }, // base64 or image URL
  createdAt: { type: Date, default: Date.now },
  songs: [SongSchema]
});

module.exports = mongoose.model("Playlist", PlaylistSchema);
