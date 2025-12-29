
// This file should only export the admin middleware function
// Remove passport and GoogleStrategy logic from here

const admin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Not authorized" });
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only" });
  next();
};

module.exports = { admin };
