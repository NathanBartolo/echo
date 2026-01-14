// Handles routing, middleware setup, iTunes API integration, and server initialization

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const googleAuthRoutes = require("./routes/googleAuthRoutes");
const adminRoutes = require("./routes/adminRoutes");
const playlistRoutes = require("./routes/playlistRoutes");
const favoritesRoutes = require("./routes/favoritesRoutes");

dotenv.config();
connectDB();

// Load passport after environment variables are available
const passport = require("./config/passport");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
// Allow larger JSON bodies so base64 playlist cover uploads are not rejected (413)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(passport.initialize());

// Root route - basic health check
app.get("/", (req, res) => res.send("Echo API is running..."));

// Mount all route handlers
app.use("/api/users", userRoutes);
// Auth routes (register, login, me)
app.use("/api/auth", authRoutes);
// Google OAuth routes
app.use("/api/auth", googleAuthRoutes);
// Admin routes (protected, admin-only)
app.use("/api/admin", adminRoutes);
// Favorites routes
app.use("/api/favorites", favoritesRoutes);

// Test route - simple backend check
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Search endpoint - autocomplete suggestions from iTunes
// Returns 5 results by default with track info for autocomplete UI
app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  const limit = parseInt(req.query.limit, 10) || 5;
  if (!query) return res.status(400).json({ error: "Missing search query" });

  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=${limit}`
    );
    const data = await response.json();

    // Map to small objects for autocomplete - return only essential info
    const suggestions = (data.results || []).map((s) => ({
      trackId: s.trackId,
      title: s.trackName,
      artist: s.artistName,
      album: s.collectionName,
      cover: s.artworkUrl100?.replace("100x100", "300x300") || "",
      previewUrl: s.previewUrl || null, // 30s preview if available
      year: s.releaseDate ? new Date(s.releaseDate).getFullYear().toString() : "",
      trackTimeMillis: s.trackTimeMillis || null,
    }));

    res.json(suggestions);
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

// Get full song details by iTunes track ID
// Used when user clicks on a song to view full details page
app.get("/api/song/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: "Missing track id" });

  try {
    const response = await fetch(
      `https://itunes.apple.com/lookup?id=${encodeURIComponent(id)}&entity=song`
    );
    const data = await response.json();
    if (!data.results || !data.results.length) return res.status(404).json({ error: "Song not found" });

    const s = data.results[0];
    // Format full song data with larger artwork
    const song = {
      trackId: s.trackId,
      title: s.trackName,
      artist: s.artistName,
      album: s.collectionName,
      cover: s.artworkUrl100?.replace("100x100", "600x600") || "",
      previewUrl: s.previewUrl || null,
      releaseDate: s.releaseDate,
      genre: s.primaryGenreName,
      trackTimeMillis: s.trackTimeMillis,
    };

    res.json(song);
  } catch (err) {
    console.error("Error fetching song details:", err);
    res.status(500).json({ error: "Failed to fetch song details" });
  }
});

// Featured songs endpoint - returns curated list of popular songs
// Used on homepage to display trending/featured tracks
app.get("/api/featured", async (req, res) => {
  const featuredQueries = [
    "Gameboy Katseye",
    "Opalite Taylor Swift",
    "I Just Might Bruno Mars",
    "Purple Rain Prince",
    "Multo Cup Of Joe",
    "back to friends sombr",
    "Where is my husband Raye",
    "CHANEL Tyla"
  ];

  try {
    // Fetch featured songs in parallel and filter out nulls
    const promises = featuredQueries.map(async (query) => {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=1`
      );
      const data = await response.json();
      if (data.results.length > 0) {
        const song = data.results[0];
        return {
          id: song.trackId,
          title: song.trackName,
          artist: song.artistName,
          album: song.collectionName,
          cover: song.artworkUrl100.replace("100x100", "300x300"),
        };
      }
      return null;
    });

    const featured = (await Promise.all(promises)).filter(Boolean);
    res.json(featured);
  } catch (error) {
    console.error("Error fetching featured songs:", error);
    res.status(500).json({ error: "Failed to fetch featured songs" });
  }
});

// Mount playlist routes
app.use("/api/playlists", playlistRoutes);

// Start the server and listen on configured port
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
