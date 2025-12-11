const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-passwordHash");
      if (!user) return res.status(401).json({ error: "Not authorized" });
      req.user = user;
      return next();
    } catch (err) {
      console.error("Auth middleware error:", err);
      return res.status(401).json({ error: "Not authorized" });
    }
  }

  return res.status(401).json({ error: "Not authorized, token missing" });
};

module.exports = { protect };
