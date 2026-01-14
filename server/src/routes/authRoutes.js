// Handles user registration, login, and profile management

const express = require("express");
const router = express.Router();
const { register, login, me, updateProfile, changePassword, updateAvatar, removeAvatar, deleteAccount } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes - no authentication required
router.post("/register", register);
router.post("/login", login);

// Protected routes - require valid JWT token
router.get("/me", protect, me);

// Profile management routes - all require authentication
router.put("/profile", protect, updateProfile);
router.put("/profile/password", protect, changePassword);
router.put("/profile/avatar", protect, updateAvatar);
router.delete("/profile/avatar", protect, removeAvatar);
router.delete("/profile", protect, deleteAccount);

module.exports = router;
