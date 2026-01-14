// Authentication controller
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//  Generate JWT token with user ID and role
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register new user with email and password
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already in use" });

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user in database
    const user = await User.create({ name, email, passwordHash });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Login existing user with email and password
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Check if user has password hash (not OAuth-only account)
    if (!user.passwordHash) return res.status(401).json({ error: "Use social login for this account" });

    // Verify password against hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user._id, user.role);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get current authenticated user's profile
const me = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Not authorized" });
    const user = req.user;
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || null,
    });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update user profile (name and email)
const updateProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Not authorized" });
    
    const { name, email } = req.body;
    const userId = req.user._id;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) return res.status(409).json({ error: "Email already in use" });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || null,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Change password for authenticated user
const changePassword = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Not authorized" });
    
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new password required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if user has a password (not OAuth-only account)
    if (!user.passwordHash) {
      return res.status(400).json({ error: "Cannot change password for social login accounts" });
    }

    // Verify current password before allowing change
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: "Current password is incorrect" });

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    
    user.passwordHash = passwordHash;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update user's avatar URL
const updateAvatar = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Not authorized" });
    
    const { avatar } = req.body;
    if (!avatar) return res.status(400).json({ error: "Avatar URL required" });

    const user = await User.findByIdAndUpdate(
      req.user._id, 
      { avatar }, 
      { new: true }
    ).select("-passwordHash");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || null,
    });
  } catch (err) {
    console.error("Update avatar error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Remove user's avatar
const removeAvatar = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Not authorized" });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: null },
      { new: true }
    ).select("-passwordHash");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: null,
    });
  } catch (err) {
    console.error("Remove avatar error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete user account permanently
// Requires password for email/password accounts, optional for OAuth accounts
const deleteAccount = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Not authorized" });
    
    const { password } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) return res.status(404).json({ error: "User not found" });

    // Verify password if account has one (skip for OAuth accounts)
    if (user.passwordHash) {
      if (!password) return res.status(400).json({ error: "Password required to delete account" });
      
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) return res.status(401).json({ error: "Incorrect password" });
    }

    // Remove user and all associated data
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { register, login, me, updateProfile, changePassword, updateAvatar, removeAvatar, deleteAccount };
