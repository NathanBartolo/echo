const API_BASE = `${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/favorites`;

function authHeader() {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function getFavorites() {
  const res = await fetch(`${API_BASE}`, {
    headers: authHeader(),
  });
  return res.json();
}

export async function addFavorite(song: { id: string; title: string; artist: string; album?: string; cover?: string; previewUrl?: string | null }) {
  const res = await fetch(`${API_BASE}`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(song),
  });
  return res.json();
}

export async function removeFavorite(songId: string) {
  const res = await fetch(`${API_BASE}/${songId}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return res.json();
}
