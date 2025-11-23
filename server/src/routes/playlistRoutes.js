const express = require("express");
const router = express.Router();
const controller = require("../controllers/playlistController");

// Create playlist
router.post("/", controller.createPlaylist);

// Get all playlists for user (use demo-user if not provided)
router.get("/user/:userId", controller.getPlaylistsForUser);

// Get playlist by id
router.get("/:id", controller.getPlaylistById);

// Delete playlist
router.delete("/:id", controller.deletePlaylist);

// Add song to playlist
router.post("/:id/song", controller.addSongToPlaylist);

// Remove song
router.delete("/:id/song/:songId", controller.removeSongFromPlaylist);

module.exports = router;
