const express = require("express");
const router = express.Router();
const controller = require("../controllers/playlistController");
const { protect } = require("../middleware/authMiddleware");

// Create playlist (authenticated)
router.post("/", protect, controller.createPlaylist);

// Get all playlists for current user
router.get("/user/:userId", protect, controller.getPlaylistsForUser);

// Get playlist by id (must belong to user)
router.get("/:id", protect, controller.getPlaylistById);

// Delete playlist (must belong to user)
router.delete("/:id", protect, controller.deletePlaylist);

// Add song to playlist (must belong to user)
router.post("/:id/song", protect, controller.addSongToPlaylist);

// Remove song (must belong to user)
router.delete("/:id/song/:songId", protect, controller.removeSongFromPlaylist);

module.exports = router;
