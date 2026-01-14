// Restricts route access to authenticated admin users only
// Should be used after auth middleware to ensure user is already authenticated

const admin = (req, res, next) => {
  // Check if user is authenticated
  if (!req.user) return res.status(401).json({ error: "Not authorized" });
  // Check if user has admin role
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only" });
  // User is authorized admin, proceed to next handler
  next();
};

module.exports = { admin };
