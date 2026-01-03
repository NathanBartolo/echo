const User = require("../models/userModel");

// Get user's favorites
const getFavorites = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Not authorized" });
    
    const user = await User.findById(req.user._id).select("favorites");
    if (!user) return res.status(404).json({ error: "User not found" });

    let favorites = user.favorites || [];
    
    // Enrich favorites with missing previewUrl from iTunes if needed
    const enrichedFavorites = await Promise.all(
      favorites.map(async (fav) => {
        // If previewUrl is missing, try to fetch it from iTunes
        if (!fav.previewUrl) {
          try {
            const searchResponse = await fetch(
              `https://itunes.apple.com/search?term=${encodeURIComponent(fav.title)}&entity=song&limit=1`
            );
            const searchData = await searchResponse.json();
            const itunesSong = searchData.results?.[0];
            
            if (itunesSong && itunesSong.previewUrl) {
              fav.previewUrl = itunesSong.previewUrl;
            }
          } catch (err) {
            console.error("Error fetching preview URL from iTunes:", err);
          }
        }
        return fav;
      })
    );
    
    res.json(enrichedFavorites);
  } catch (err) {
    console.error("Get favorites error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Add song to favorites
const addFavorite = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Not authorized" });
    
    const { id, title, artist, album, cover, previewUrl } = req.body;
    if (!id || !title || !artist) {
      return res.status(400).json({ error: "Song data required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if already favorited
    const alreadyFavorited = user.favorites.some(fav => fav.id === id);
    if (alreadyFavorited) {
      return res.status(400).json({ error: "Song already in favorites" });
    }

    user.favorites.push({ id, title, artist, album, cover, previewUrl });
    await user.save();

    res.json(user.favorites);
  } catch (err) {
    console.error("Add favorite error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Remove song from favorites
const removeFavorite = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Not authorized" });
    
    const { songId } = req.params;
    if (!songId) return res.status(400).json({ error: "Song ID required" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.favorites = user.favorites.filter(fav => fav.id !== songId);
    await user.save();

    res.json(user.favorites);
  } catch (err) {
    console.error("Remove favorite error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite };
