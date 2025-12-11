const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const googleAuthRoutes = require("./routes/googleAuthRoutes");
const adminRoutes = require("./routes/adminRoutes");
const playlistRoutes = require("./routes/playlistRoutes");

dotenv.config();
connectDB();

// Load passport after environment variables are available
const passport = require("./config/passport");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(passport.initialize());

// Root route
app.get("/", (req, res) => res.send("Echo API is running..."));

// User routes
app.use("/api/users", userRoutes);
// Auth routes (register, login, me)
app.use("/api/auth", authRoutes);
// Google OAuth routes
app.use("/api/auth", googleAuthRoutes);
// Admin routes (protected, admin-only)
app.use("/api/admin", adminRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  const limit = parseInt(req.query.limit, 10) || 5;
  if (!query) return res.status(400).json({ error: "Missing search query" });

  try {
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=${limit}`
    );
    const data = await response.json();

    // Map to small objects for autocomplete
    const suggestions = (data.results || []).map((s) => ({
      trackId: s.trackId,
      title: s.trackName,
      artist: s.artistName,
      album: s.collectionName,
      cover: s.artworkUrl100?.replace("100x100", "300x300") || "",
      previewUrl: s.previewUrl || null, // 30s preview if available
    }));

    res.json(suggestions);
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

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
      // add any other fields you want
    };

    res.json(song);
  } catch (err) {
    console.error("Error fetching song details:", err);
    res.status(500).json({ error: "Failed to fetch song details" });
  }
});

app.get("/api/featured", async (req, res) => {
  const featuredQueries = [
    "Gnarly Katseye",
    "Juno Sabrina Carpenter",
    "Locked Out Of Heaven Bruno Mars",
    "Iris Goo Goo Dolls",
    "Multo Cup Of Joe",
    "Gravity John Mayer",
    "Come Inside Of My Heart Iv Of Spades",
    "Pantropiko Bini"
  ];

  try {
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

app.use("/api/playlists", playlistRoutes);


// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
