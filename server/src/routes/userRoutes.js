// Basic user endpoint for testing

const express = require("express");
const router = express.Router();
const { getUsers } = require("../controllers/userController");

// Get users endpoint
router.get("/", getUsers);

module.exports = router;
