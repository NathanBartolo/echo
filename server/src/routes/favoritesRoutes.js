const express = require("express");
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite } = require("../controllers/favoritesController");
const { protect } = require("../middleware/authMiddleware");

// All favorites routes require authentication
router.use(protect);

// Get user's favorites
router.get("/", getFavorites);

// Add song to favorites
router.post("/", addFavorite);

// Remove song from favorites
router.delete("/:songId", removeFavorite);

module.exports = router;
