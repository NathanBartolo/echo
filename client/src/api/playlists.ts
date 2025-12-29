const API_BASE = "http://localhost:5000/api/playlists";

function authHeader() {
  const token = localStorage.getItem("authToken");
  if (!token) return { "Content-Type": "application/json" };
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export async function createPlaylist(name: string, description = "", userId = "demo-user") {
  const res = await fetch(`${API_BASE}`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({ name, description, userId }),
  });
  return res.json();
}

export async function getPlaylists(userId = "demo-user") {
  const token = localStorage.getItem("authToken");
  const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${API_BASE}/user/${userId}`, { headers });
  return res.json();
}

export async function getPlaylist(id: string) {
  const token = localStorage.getItem("authToken");
  const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${API_BASE}/${id}`, { headers });
  return res.json();
}

export async function deletePlaylist(id: string) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE", headers: authHeader() });
  return res.json();
}

export async function addSongToPlaylist(id: string, song: any) {
  const res = await fetch(`${API_BASE}/${id}/song`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({ song }),
  });
  return res.json();
}

export async function removeSongFromPlaylist(id: string, songId: string) {
  const res = await fetch(`${API_BASE}/${id}/song/${songId}`, { method: "DELETE", headers: authHeader() });
  return res.json();
}

export async function updatePlaylistCover(id: string, coverImage: string) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify({ coverImage }),
  });
  return res.json();
}
