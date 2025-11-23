const API_BASE = "http://localhost:5000/api/playlists";

export async function createPlaylist(name: string, description = "", userId = "demo-user") {
  const res = await fetch(`${API_BASE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, description, userId }),
  });
  return res.json();
}

export async function getPlaylists(userId = "demo-user") {
  const res = await fetch(`${API_BASE}/user/${userId}`);
  return res.json();
}

export async function getPlaylist(id: string) {
  const res = await fetch(`${API_BASE}/${id}`);
  return res.json();
}

export async function deletePlaylist(id: string) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  return res.json();
}

export async function addSongToPlaylist(id: string, song: any) {
  const res = await fetch(`${API_BASE}/${id}/song`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ song }),
  });
  return res.json();
}

export async function removeSongFromPlaylist(id: string, songId: string) {
  const res = await fetch(`${API_BASE}/${id}/song/${songId}`, { method: "DELETE" });
  return res.json();
}
