// Handles getting, adding, and removing favorite songs

const express = require("express");
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite } = require("../controllers/favoritesController");
const { protect } = require("../middleware/authMiddleware");

// All favorites routes require authentication
router.use(protect);

// Get user's favorite songs
router.get("/", getFavorites);

// Add song to favorites
router.post("/", addFavorite);

// Remove song from favorites by ID
router.delete("/:songId", removeFavorite);

module.exports = router;
