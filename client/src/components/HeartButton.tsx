import { useAuth } from "../context/AuthContext";
import { addFavorite, removeFavorite } from "../api/favorites";
import "../styles/heartButton.css";

type HeartButtonProps = {
  song: {
    id: string;
    title: string;
    artist: string;
    album?: string;
    cover?: string;
    previewUrl?: string | null;
  };
  size?: "small" | "medium" | "large";
};

export default function HeartButton({ song, size = "medium" }: HeartButtonProps) {
  const { user, setFavorites, isFavorite } = useAuth();
  
  if (!user) return null;

  const favorited = isFavorite(song.id);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (favorited) {
        const result = await removeFavorite(song.id);
        if (!result.error) {
          setFavorites(result);
        }
      } else {
        const result = await addFavorite({
          id: song.id,
          title: song.title,
          artist: song.artist,
          album: song.album,
          cover: song.cover,
          previewUrl: song.previewUrl,
        });
        if (!result.error) {
          setFavorites(result);
        }
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  return (
    <button
      className={`heart-btn heart-btn-${size} ${favorited ? "favorited" : ""}`}
      onClick={handleToggle}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      title={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        viewBox="0 0 24 24"
        fill={favorited ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
