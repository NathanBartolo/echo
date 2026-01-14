// Handles OAuth flow with Google for user authentication

const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Step 1: Redirect user to Google login page
// Requests profile and email scope
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Google callback after user authenticates
// Generates JWT and redirects to frontend with credentials
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    // If Google auth fails, send the user back to the frontend login with an error message
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=Google%20login%20failed`,
  }),
  (req, res) => {
    try {
      const user = req.user;
      // Generate JWT token for subsequent API requests
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      // Prepare user data to send to frontend
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const userJson = JSON.stringify({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      });

      // Redirect back to frontend with token and user info in query parameters
      res.redirect(
        `${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(userJson)}`
      );
    } catch (err) {
      console.error("Google callback error:", err);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(err.message)}`);
    }
  }
);

// Alternative POST endpoint for Google login (currently not in use)
router.post("/google", async (req, res) => {
  const { email, username, googleId } = req.body;

  try {
    // Check if Google user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not found
      user = await User.create({
        email,
        username,
        googleId,
        password: null
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Google login success",
      user,
      token,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Google auth error", error: err });
  }
});

module.exports = router;
