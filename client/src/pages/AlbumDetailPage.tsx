import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import { getPlaylists, addSongToPlaylist } from "../api/playlists";
import "../styles/albumDetail.css";

interface Song {
  trackId?: number | string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  previewUrl?: string | null;
  year?: string;
  duration?: number | string;
}

interface Album {
  name: string;
  artist: string;
  cover: string;
  songs?: Song[];
  releaseDate?: string;
  genre?: string;
  totalSongs?: number;
}

const AlbumDetailPage = () => {
  const { albumName, artistName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Play preview on hover
  const playSongPreview = (previewUrl: string | null | undefined) => {
    if (!previewUrl) return;

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

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
  const [songs, setSongs] = useState<Song[]>([]);
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState<number | null>(null);
  const [addMessage, setAddMessage] = useState<{ index: number; message: string } | null>(null);

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentAudio]);

  // Load user playlists
  useEffect(() => {
    (async () => {
      try {
        const data = await getPlaylists();
        setPlaylists(data || []);
      } catch (err) {
        console.error("Error loading playlists", err);
      }
    })();
  }, []);

  // Handle adding song to playlist
  const handleAddToPlaylist = async (song: Song, playlistId: string, index: number) => {
    try {
      await addSongToPlaylist(playlistId, song);
      setAddMessage({ index, message: "Added!" });
      setTimeout(() => setAddMessage(null), 2000);
      setShowPlaylistMenu(null);
    } catch (err) {
      console.error(err);
      setAddMessage({ index, message: "Failed" });
      setTimeout(() => setAddMessage(null), 2000);
    }
  };

  useEffect(() => {
    const fetchAlbumSongs = async () => {
      try {
        // Try to get album data from location state first
        if (location.state?.album?.songs) {
          setAlbum(location.state.album);
          setSongs(location.state.album.songs);
        } else {
          // Fetch songs by album name and artist
          const decodedAlbum = decodeURIComponent(albumName || "");
          const decodedArtist = decodeURIComponent(artistName || "");
          
          const res = await fetch(
            `http://localhost:5000/api/search?q=${encodeURIComponent(`${decodedAlbum} ${decodedArtist}`)}&limit=50`
          );
          const data = await res.json();
          const songList = Array.isArray(data) ? data : [data];
          
          // Filter songs from the same album
          const albumSongs = songList.filter(
            (song: Song) =>
              song.album.toLowerCase() === decodedAlbum.toLowerCase() &&
              song.artist.toLowerCase() === decodedArtist.toLowerCase()
          );

          setSongs(albumSongs);
          setAlbum({
            name: decodedAlbum,
            artist: decodedArtist,
            cover: albumSongs[0]?.cover || "",
            songs: albumSongs,
          });
        }
      } catch (err) {
        console.error("Error fetching album songs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumSongs();
  }, [albumName, artistName, location.state]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="album-detail-container">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="album-detail-container">
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

        <div className="album-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div className="album-hero">
            <div className="album-cover">
              <img src={album?.cover} alt={album?.name} />
            </div>
            <div className="album-info">
              <p className="album-label">Album</p>
              <h1>{album?.name}</h1>
              <p className="album-artist">{album?.artist}</p>
              <p className="song-count">{songs.length} songs</p>
              <div className="album-description">
                {album?.releaseDate && (
                  <div className="description-item">
                    <strong>Release Date:</strong>
                    <p>{album.releaseDate}</p>
                  </div>
                )}
                {album?.genre && (
                  <div className="description-item">
                    <strong>Genre:</strong>
                    <p>{album.genre}</p>
                  </div>
                )}
              </div>
              <div className="album-bio">
                <p>
                  Explore the full album <strong>{album?.name}</strong> by <strong>{album?.artist}</strong>. This collection features {songs.length} amazing tracks.
                  Enjoy previews by hovering over each song or add your favorites to your playlist to discover more from this artist.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="album-songs">
          <h2>All Songs</h2>
          {songs.length > 0 ? (
            <div className="songs-list">
              {songs.map((song, index) => (
                <div
                  key={index}
                  className="song-list-item"
                  onMouseEnter={() => playSongPreview(song.previewUrl)}
                  onMouseLeave={stopSongPreview}
                >
                  <div className="song-number">{index + 1}</div>
                  <div className="song-thumbnail">
                    <img src={song.cover} alt={song.title} />
                  </div>
                  <div 
                    className="song-details"
                    onClick={() => {
                      const id = song.trackId ?? song.title;
                      navigate(`/song/${encodeURIComponent(String(id))}`, { state: { song } });
                    }}
                  >
                    <h3>{song.title}</h3>
                    <p>{song.artist}</p>
                  </div>
                  <div className="song-duration">
                    {song.duration ? (
                      <span>{song.duration}</span>
                    ) : (
                      <span>--:--</span>
                    )}
                  </div>
                  <div className="song-actions">
                    <button 
                      className="song-play-btn"
                      onClick={() => {
                        const id = song.trackId ?? song.title;
                        navigate(`/song/${encodeURIComponent(String(id))}`, { state: { song } });
                      }}
                    >
                      ▶
                    </button>
                    <div className="add-to-playlist-container">
                      <button
                        className="add-to-playlist-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPlaylistMenu(showPlaylistMenu === index ? null : index);
                        }}
                      >
                        + Add
                      </button>
                      {showPlaylistMenu === index && playlists.length > 0 && (
                        <div className="playlist-dropdown">
                          {playlists.map((playlist) => (
                            <div
                              key={playlist._id}
                              className="playlist-option"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToPlaylist(song, playlist._id, index);
                              }}
                            >
                              {playlist.name}
                            </div>
                          ))}
                        </div>
                      )}
                      {addMessage && addMessage.index === index && (
                        <span className="add-message">{addMessage.message}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-songs">
              <p>No songs found for this album.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AlbumDetailPage;
