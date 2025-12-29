import { useEffect, useState } from "react";
import "../styles/navbar.css";
import "./../styles/songSearch.css";
import Navbar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

interface Song {
  trackId?: number | string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  previewUrl?: string | null;
  year?: string;
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
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
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
          "Taylor Swift",
          "The Weeknd",
          "Billie Eilish",
          "Dua Lipa",
          "Post Malone",
          "Ariana Grande",
          "Drake",
          "Kendrick Lamar",
          "Ed Sheeran",
          "Harry Styles"
        ];
        let allFamousSongs: Song[] = [];

        for (const artist of modernArtists) {
          const res = await fetch(
            `http://localhost:5000/api/search?q=${encodeURIComponent(artist)}&limit=15`
          );
          const data = await res.json();
          const list = Array.isArray(data) ? data : [data];
          allFamousSongs = [...allFamousSongs, ...list];
        }

        // Shuffle songs to mix artists
        const shuffled = shuffleSongs(allFamousSongs.slice(0, 60));
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
          // Swap with a random song
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

  // Apply filters
  const applyFilters = () => {
    let filtered = allSongs;

    if (selectedGenre) {
      // Simple genre mapping based on artist
      const genreMap: { [key: string]: string[] } = {
        "Pop": ["Taylor Swift", "Dua Lipa", "Ariana Grande", "Harry Styles", "Ed Sheeran"],
        "Hip-Hop": ["Drake", "Kendrick Lamar", "Post Malone"],
        "R&B": ["The Weeknd", "Drake"],
        "Electronic": ["Billie Eilish", "The Weeknd"],
        "Alternative": ["Billie Eilish"]
      };
      const artistsInGenre = genreMap[selectedGenre] || [];
      filtered = filtered.filter((s) =>
        artistsInGenre.some((artist) =>
          s.artist.toLowerCase().includes(artist.toLowerCase())
        )
      );
    }

    if (selectedCountry) {
      // Simple country mapping based on artist origin
      const countryMap: { [key: string]: string[] } = {
        "USA": ["Taylor Swift", "Billie Eilish", "Ariana Grande", "Drake", "Kendrick Lamar", "Post Malone"],
        "UK": ["Ed Sheeran", "Harry Styles"],
        "Canada": ["Drake"],
        "Australia": ["Dua Lipa"],
        "Asia": [],
        "France": [],
        "Arab": [],
        "Spain": [],
      };
      const artistsInCountry = countryMap[selectedCountry] || [];
      filtered = filtered.filter((s) =>
        artistsInCountry.some((artist) =>
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
          // Handle specific year filtering
          return s.year === selectedYear;
        }
      });
    }

    // Create results with mixed songs and albums
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
        `http://localhost:5000/api/search?q=${encodeURIComponent(query)}&limit=30`
      );
      const data = await res.json();
      const songList = Array.isArray(data) ? data : [data];

      // Update allSongs with search results so filters work on them
      setAllSongs(songList);

      // Extract unique albums from search results
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
  const countries = ["USA", "UK", "Canada", "Australia", "Asia", "France", "Arab", "Spain"];
  const decades = ["2020s", "2010s", "2000s", "1990s", "1980s", "1970s", "1960s", "1950s"];

  return (
    <>
      <Navbar />
      <div className="song-search-container">
        <div className="search-section">
          <div className="search-bar-wrapper">
            <input
              type="text"
              placeholder="Search songs, artists..."
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
                      setSelectedCountry("");
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
              <label>By Country</label>
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${selectedCountry === "" ? "active" : ""}`}
                  onClick={() => {
                    setSelectedCountry("");
                  }}
                >
                  All Countries
                </button>
                {countries.map((country) => (
                  <button
                    key={country}
                    className={`filter-btn ${selectedCountry === country ? "active" : ""}`}
                    onClick={() => setSelectedCountry(country)}
                  >
                    {country}
                  </button>
                ))}
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
                    <div className="song-card-overlay">
                      <span className="play-icon">▶</span>
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
                    <div className="song-card-overlay">
                      <span className="play-icon">▶</span>
                    </div>
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
