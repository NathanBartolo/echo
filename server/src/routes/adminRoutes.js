const express = require("express");
const router = express.Router();
const { listUsers, getUserById, updateUserRole, deleteUser, getStats } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// All admin routes require authentication and admin role
router.use(protect, admin);

// List all users
router.get("/users", listUsers);

// Get single user by id
router.get("/users/:id", getUserById);

// Update user role
router.put("/users/:id/role", updateUserRole);

// Delete user
router.delete("/users/:id", deleteUser);

// Get admin stats
router.get("/stats", getStats);

module.exports = router;
