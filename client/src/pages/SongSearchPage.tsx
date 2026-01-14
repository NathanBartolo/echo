// ============================================
// SONG SEARCH PAGE - Discover and filter songs
// ============================================

import { useEffect, useState } from "react";
import "../styles/navbar.css";
import "./../styles/song.css";
import Navbar from "../components/NavBar";
import HeartButton from "../components/HeartButton";
import { useNavigate } from "react-router-dom";

interface Song {
  trackId?: number | string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  previewUrl?: string | null;
  year?: string;
  trackTimeMillis?: number | null;
}

interface Album {
  name: string;
  artist: string;
  cover: string;
  songs?: Song[];
}

interface SearchResult {
  type: "song" | "album";
  data: Song | Album;
}

const SongSearchPage = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<"" | "short" | "medium" | "long">("");
  const [filterType, setFilterType] = useState<"all" | "songs" | "albums">("all");
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentAudio]);

  // Fetch famous modern pop songs on load
  useEffect(() => {
    const fetchFamousSongs = async () => {
      try {
        const modernArtists = [
          "Sabrina Carpenter",
          "Chappel Roan",
          "Raye",
          "Taylor Swift",
          "The Weeknd",
          "Billie Eilish",
          "Dua Lipa",
          "Bruno Mars",
          "Ariana Grande",
          "Drake",
          "Kendrick Lamar",
          "Ed Sheeran",
          "Harry Styles",
          "Travis Scott",
          "J. Cole",
          "Cardi B",
          "Megan Thee Stallion",
          "Lil Baby",
          "Kanye West",
          "Nicki Minaj",
          "Daniel Caesar",
          "H.E.R.",
          "SZA",
          "Jhene Aiko",
          "Giveon",
          "Frank Ocean",
          "Summer Walker",
          "Calvin Harris",
          "Zedd",
          "Marshmello",
          "Kygo",
          "Skrillex",
          "Diplo",
          "Teddy Swims",
          "Tame Impala",
          "Lorde",
          "Imagine Dragons",
          "The Killers",
          "Arctic Monkeys"
        ];
        let allFamousSongs: Song[] = [];

        for (const artist of modernArtists) {
          const res = await fetch(
            `${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/search?q=${encodeURIComponent(artist)}&limit=15`
          );
          const data = await res.json();
          const list = Array.isArray(data) ? data : [data];
          allFamousSongs = [...allFamousSongs, ...list];
        }

        // Shuffle songs to mix artists
        const shuffled = shuffleSongs(allFamousSongs.slice(0, 300));
        setAllSongs(shuffled);
        setResults(
          shuffled.map((song) => ({
            type: "song" as const,
            data: song,
          }))
        );
      } catch (err) {
        console.error("Error fetching famous songs:", err);
      }
    };

    fetchFamousSongs();
  }, []);

  // Shuffle function that avoids consecutive same-artist songs 
  const shuffleSongs = (songsArray: Song[]) => {
    const shuffled = [...songsArray];
    let iterations = 0;
    const maxIterations = 100;

    while (iterations < maxIterations) {
      let isBetter = true;
      for (let i = 0; i < shuffled.length - 1; i++) {
        if (shuffled[i].artist === shuffled[i + 1].artist) {
          isBetter = false;
          // Swap with a random song not the same artist
          const randomIndex = Math.floor(Math.random() * shuffled.length);
          [shuffled[i + 1], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i + 1]];
          break;
        }
      }
      if (isBetter) break;
      iterations++;
    }
    return shuffled;
  };

  const navigate = useNavigate();

  // Play preview on hover
  const playSongPreview = (previewUrl: string | null | undefined) => {
    if (!previewUrl) return;

    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // Create and play new audio
    const audio = new Audio(previewUrl);
    audio.play().catch((err) => console.log("Could not play preview:", err));
    setCurrentAudio(audio);
  };

  // Stop preview on mouse leave
  const stopSongPreview = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
  };

  // Apply filters function
  const applyFilters = () => {
    let filtered = allSongs;

    if (selectedGenre) {
      // Simple genre mapping based on artist
      const genreMap: { [key: string]: string[] } = {
        "Pop": ["Taylor Swift", "Katseye", "Ariana Grande", "Harry Styles", "Ed Sheeran", "Billie Eilish", "Bruno Mars", "Dua Lipa", "Olivia Rodrigo", "Shawn Mendes", "Chappel Roan"],
        "Hip-Hop": ["Drake", "Kendrick Lamar", "Travis Scott", "J. Cole", "Cardi B", "Megan Thee Stallion", "Lil Baby", "Kanye West", "Nicki Minaj"],
        "R&B": ["The Weeknd", "Daniel Caesar", "H.E.R.", "SZA", "Jhene Aiko", "Giveon", "Frank Ocean", "Summer Walker"],
        "Electronic": ["Daft Punk", "The Weeknd", "Calvin Harris", "Zedd", "Marshmello", "Kygo", "Skrillex", "Diplo"],
        "Alternative": ["Teddy Swims", "Tame Impala", "Lorde", "Imagine Dragons", "The Killers", "Arctic Monkeys"],
      };
      const artistsInGenre = genreMap[selectedGenre] || [];
      filtered = filtered.filter((s) =>
        artistsInGenre.some((artist) =>
          s.artist.toLowerCase().includes(artist.toLowerCase())
        )
      );
    }

    if (selectedYear) {
      filtered = filtered.filter((s) => {
        if (selectedYear.endsWith("s")) {
          // Handle decade filtering (e.g., "2020s", "2010s")
          const decadeStr = selectedYear.slice(0, 4); // e.g., "2020" from "2020s"
          const decadeStart = parseInt(decadeStr);
          const decadeEnd = decadeStart + 10;
          const songYear = parseInt(s.year || "0");
          return songYear >= decadeStart && songYear < decadeEnd;
        } else {
          // Handle specific year filtering (e.g., "2021")
          return s.year === selectedYear;
        }
      });
    }

    if (selectedDuration) {
      filtered = filtered.filter((s) => {
        const dur = s.trackTimeMillis || 0;
        if (!dur) return false;
        const shortMax = 150_000; // 2:30
        const mediumMax = 240_000; // 4:00
        if (selectedDuration === "short") return dur < shortMax;
        if (selectedDuration === "medium") return dur >= shortMax && dur <= mediumMax;
        if (selectedDuration === "long") return dur > mediumMax;
        return true;
      });
    }

    // Created results with mixed songs and albums
    const mixed: SearchResult[] = [];
    filtered.forEach((song) => {
      mixed.push({
        type: "song",
        data: song,
      });
    });

    // Extract unique albums from filtered songs
    const albumMap = new Map<string, Album>();
    filtered.forEach((song) => {
      const albumKey = `${song.album}-${song.artist}`;
      if (!albumMap.has(albumKey)) {
        albumMap.set(albumKey, {
          name: song.album,
          artist: song.artist,
          cover: song.cover,
          songs: [],
        });
      }
      const album = albumMap.get(albumKey);
      if (album && album.songs) {
        album.songs.push(song);
      }
    });

    albumMap.forEach((album) => {
      mixed.push({
        type: "album",
        data: album,
      });
    });

    // Apply type filter
    const typeFiltered =
      filterType === "all"
        ? mixed
        : mixed.filter((r) => {
            if (filterType === "songs") return r.type === "song";
            if (filterType === "albums") return r.type === "album";
            return true;
          });

    setResults(typeFiltered);
  };

  // Handle search - both songs and albums
  const handleSearch = async () => {
    if (!query.trim()) {
      setResults(
        allSongs.map((song) => ({
          type: "song" as const,
          data: song,
        }))
      );
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/search?q=${encodeURIComponent(query)}&limit=30`
      );
      const data = await res.json();
      const songList = Array.isArray(data) ? data : [data];


      setAllSongs(songList);

  
      const albumMap = new Map<string, Album>();
      songList.forEach((song: Song) => {
        const albumKey = `${song.album}-${song.artist}`;
        if (!albumMap.has(albumKey)) {
          albumMap.set(albumKey, {
            name: song.album,
            artist: song.artist,
            cover: song.cover,
            songs: [],
          });
        }
        const album = albumMap.get(albumKey);
        if (album && album.songs) {
          album.songs.push(song);
        }
      });

      // Mix songs and albums in results
      const mixed: SearchResult[] = [];
      songList.forEach((song: Song) => {
        mixed.push({
          type: "song",
          data: song,
        });
      });

      albumMap.forEach((album) => {
        mixed.push({
          type: "album",
          data: album,
        });
      });

      setResults(mixed.slice(0, 40));
    } catch (err) {
      console.error("Error searching:", err);
    }
  };

  // Get unique years for filter options
  const uniqueYears = [...new Set(allSongs.map((s) => s.year))].filter(Boolean).sort().reverse();

  const genres = ["Pop", "Hip-Hop", "R&B", "Electronic", "Alternative"];
  const decades = ["2020s", "2010s", "2000s"];

  return (
    <>
      <Navbar />
      <div className="song-search-container">
        {/* Background Elements */}
        <div className="background-elements">
          <div className="sound-waves">
            {Array.from({ length: 80 }).map((_, i) => (
              <div
                key={i}
                className="wave-bar"
                style={{
                  height: `${Math.random() * 120 + 60}px`,
                  animationDelay: `${Math.random() * 0.8}s`,
                }}
              />
            ))}
          </div>

          <div className="vinyl-record">
            <div className="record-center"></div>
          </div>

          {Array.from({ length: 20 }).map((_, i) => {
            const notes = ['♪', '♫', '♬', '𝄞'];
            return (
              <div
                key={i}
                className="floating-note"
                style={{
                  left: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 40 + 25}px`,
                  animationDelay: `${Math.random() * 8}s`,
                  animationDuration: `${Math.random() * 5 + 6}s`,
                }}
              >
                {notes[Math.floor(Math.random() * notes.length)]}
              </div>
            );
          })}
        </div>

        {/* Hero Section */}
        <div className="discover-hero">
          <h1 className="discover-title">
            Discover Music<span className="title-accent">, Your Way</span>
          </h1>
          <p className="discover-subtitle">
            Search, explore, and curate your perfect collection
          </p>
        </div>

        <div className="search-section">
          <div className="search-bar-wrapper">
            <input
              type="text"
              placeholder="Search songs, artists, albums..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="search-input"
            />
          </div>
        </div>

        <div className="filters-section">
          <div className="filters-header">
            <h3>Filter Results</h3>
          </div>

          <div className="filters-grid">
            <div className="filter-group">
              <label>By Type</label>
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${filterType === "all" ? "active" : ""}`}
                  onClick={() => {
                    setFilterType("all");
                  }}
                >
                  All
                </button>
                <button
                  className={`filter-btn ${filterType === "songs" ? "active" : ""}`}
                  onClick={() => {
                    setFilterType("songs");
                  }}
                >
                  Songs Only
                </button>
                <button
                  className={`filter-btn ${filterType === "albums" ? "active" : ""}`}
                  onClick={() => {
                    setFilterType("albums");
                  }}
                >
                  Albums Only
                </button>
              </div>
            </div>

            <div className="filter-group">
              <label>By Genre</label>
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${selectedGenre === "" ? "active" : ""}`}
                  onClick={() => {
                    setSelectedGenre("");
                    setQuery("");
                  }}
                >
                  All Genres
                </button>
                {genres.map((genre) => (
                  <button
                    key={genre}
                    className={`filter-btn ${selectedGenre === genre ? "active" : ""}`}
                    onClick={() => {
                      setSelectedGenre(genre);
                      setSelectedDuration("");
                      setSelectedYear("");
                      setQuery("");
                    }}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>By Duration</label>
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${selectedDuration === "" ? "active" : ""}`}
                  onClick={() => setSelectedDuration("")}
                >
                  All Durations
                </button>
                <button
                  className={`filter-btn ${selectedDuration === "short" ? "active" : ""}`}
                  onClick={() => setSelectedDuration("short")}
                >
                  Short (&lt; 2:30)
                </button>
                <button
                  className={`filter-btn ${selectedDuration === "medium" ? "active" : ""}`}
                  onClick={() => setSelectedDuration("medium")}
                >
                  Medium (2:30–4:00)
                </button>
                <button
                  className={`filter-btn ${selectedDuration === "long" ? "active" : ""}`}
                  onClick={() => setSelectedDuration("long")}
                >
                  Long (&gt; 4:00)
                </button>
              </div>
            </div>

            <div className="filter-group">
              <label>By Year</label>
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${selectedYear === "" ? "active" : ""}`}
                  onClick={() => {
                    setSelectedYear("");
                  }}
                >
                  All Years
                </button>
                {decades.map((decade) => (
                  <button
                    key={decade}
                    className={`filter-btn ${selectedYear === decade ? "active" : ""}`}
                    onClick={() => setSelectedYear(decade)}
                  >
                    {decade}
                  </button>
                ))}
                {uniqueYears.slice(0, 8).map((year) => (
                  <button
                    key={year}
                    className={`filter-btn ${selectedYear === year ? "active" : ""}`}
                    onClick={() => setSelectedYear(year as string)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button className="apply-filters-btn" onClick={applyFilters}>
            Apply Filters
          </button>
        </div>

        <div className="songs-count">
          <p>Showing {results.length} results</p>
        </div>

        <div className="song-grid">
          {results.length > 0 ? (
            results.map((result, index) =>
              result.type === "song" ? (
                <div
                  className="song-card"
                  key={index}
                  onClick={() => {
                    const song = result.data as Song;
                    const id = song.trackId ?? song.title;
                    navigate(`/song/${encodeURIComponent(String(id))}`, { state: { song } });
                  }}
                  onMouseEnter={() => playSongPreview((result.data as Song).previewUrl)}
                  onMouseLeave={stopSongPreview}
                >
                  <div className="song-card-image">
                    <img src={(result.data as Song).cover} alt={(result.data as Song).title} />
                    <div className="card-heart">
                      <HeartButton
                        song={{
                          id: String((result.data as Song).trackId ?? (result.data as Song).title),
                          title: (result.data as Song).title,
                          artist: (result.data as Song).artist,
                          album: (result.data as Song).album,
                          cover: (result.data as Song).cover,
                          previewUrl: (result.data as Song).previewUrl,
                        }}
                        size="medium"
                      />
                    </div>
                  </div>
                  <div className="song-card-info">
                    <h3>{(result.data as Song).title}</h3>
                    <p className="artist">{(result.data as Song).artist}</p>
                    <p className="album">{(result.data as Song).album}</p>
                  </div>
                </div>
              ) : (
                <div
                  className="album-card"
                  key={index}
                  onClick={() => {
                    const album = result.data as Album;
                    navigate(`/album/${encodeURIComponent(album.name)}/${encodeURIComponent(album.artist)}`, {
                      state: { album },
                    });
                  }}
                >
                  <div className="album-card-image">
                    <img src={(result.data as Album).cover} alt={(result.data as Album).name} />
                    <div className="album-badge">Album</div>
                  </div>
                  <div className="album-card-info">
                    <h3>{(result.data as Album).name}</h3>
                    <p className="artist">{(result.data as Album).artist}</p>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="no-songs">
              <p>No results found. Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SongSearchPage;
