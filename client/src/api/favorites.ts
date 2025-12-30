const API_BASE = "http://localhost:5000/api/favorites";

function authHeader() {
  const token = localStorage.getItem("authToken");
  if (!token) return { "Content-Type": "application/json" };
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export async function getFavorites() {
  const res = await fetch(`${API_BASE}`, {
    headers: authHeader(),
  });
  return res.json();
}

export async function addFavorite(song: { id: string; title: string; artist: string; album?: string; cover?: string }) {
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
