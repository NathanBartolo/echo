// Validates JWT token from request header and attaches user to request object

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Middleware to protect routes - requires valid JWT token
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Extract token from "Bearer <token>" format
      token = req.headers.authorization.split(" ")[1];
      // Verify token signature and expiration
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Fetch user from database and attach to request
      const user = await User.findById(decoded.id).select("-passwordHash");
      if (!user) return res.status(401).json({ error: "Not authorized" });
      req.user = user;
      return next();
    } catch (err) {
      console.error("Auth middleware error:", err);
      return res.status(401).json({ error: "Not authorized" });
    }
  }

  // If no valid token, allow request to proceed without user (optional auth)
  req.user = null;
  next();
};

module.exports = { protect };
