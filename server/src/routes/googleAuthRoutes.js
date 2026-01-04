const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Google OAuth redirect to Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    try {
      const user = req.user;
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      // Redirect to frontend with token and user info
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const userJson = JSON.stringify({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      });

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

router.post("/google", async (req, res) => {
  const { email, username, googleId } = req.body;

  try {
    // 🔍 1. Check if Google user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // 👤 2. Create new user if not found
      user = await User.create({
        email,
        username,
        googleId,
        password: null
      });
    }

    // 🎟 3. Generate JWT
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
