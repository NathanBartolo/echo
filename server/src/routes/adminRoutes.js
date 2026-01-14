// Handles user management and system statistics

const express = require("express");
const router = express.Router();
const { listUsers, getUserById, updateUserRole, deleteUser, getStats } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// All admin routes require authentication and admin role
router.use(protect, admin);

// List all users in system
router.get("/users", listUsers);

// Get single user by id
router.get("/users/:id", getUserById);

// Update user role (promote/demote)
router.put("/users/:id/role", updateUserRole);

// Delete user account
router.delete("/users/:id", deleteUser);

// Get system statistics
router.get("/stats", getStats);

module.exports = router;
