// Handles all playlist operations: CRUD and song management

const API_BASE = `${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/playlists`;

// Helper to build auth headers with JWT token
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

// Create new playlist
export async function createPlaylist(name: string, description = "", userId = "demo-user") {
  const res = await fetch(`${API_BASE}`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({ name, description, userId }),
  });
  return res.json();
}

// Get all playlists for user
export async function getPlaylists(userId = "demo-user") {
  const token = localStorage.getItem("authToken");
  const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${API_BASE}/user/${userId}`, { headers });
  return res.json();
}

// Get single playlist by ID
export async function getPlaylist(id: string) {
  const token = localStorage.getItem("authToken");
  const headers: any = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${API_BASE}/${id}`, { headers });
  return res.json();
}

// Delete playlist
export async function deletePlaylist(id: string) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE", headers: authHeader() });
  return res.json();
}

// Add song to playlist
export async function addSongToPlaylist(id: string, song: any) {
  const res = await fetch(`${API_BASE}/${id}/song`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({ song }),
  });
  return res.json();
}

// Remove song from playlist
export async function removeSongFromPlaylist(id: string, songId: string) {
  const res = await fetch(`${API_BASE}/${id}/song/${songId}`, { method: "DELETE", headers: authHeader() });
  return res.json();
}

// Update playlist cover image
export async function updatePlaylistCover(id: string, coverImage: string) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify({ coverImage }),
  });

  const data = await res.json();
  if (!res.ok) {
    const reason = (data && data.error) || res.statusText || "Failed to update cover";
    throw new Error(reason);
  }
  return data;
}

// Update playlist description
export async function updatePlaylistDescription(id: string, description: string) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify({ description }),
  });
  return res.json();
}
