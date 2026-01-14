// Admin-only endpoints: user management and system statistics

const API_BASE = `${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/admin`;

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

// Get all users in system
export async function listUsers() {
  const res = await fetch(`${API_BASE}/users`, { headers: authHeader() });
  return res.json();
}

// Get user by ID
export async function getUser(id: string) {
  const res = await fetch(`${API_BASE}/users/${id}`, { headers: authHeader() });
  return res.json();
}

// Update user role (promote/demote)
export async function updateUserRole(id: string, role: string) {
  const res = await fetch(`${API_BASE}/users/${id}/role`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify({ role }),
  });
  return res.json();
}

// Delete user account
export async function deleteUser(id: string) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return res.json();
}

// Get system statistics
export async function getStats() {
  const res = await fetch(`${API_BASE}/stats`, { headers: authHeader() });
  return res.json();
}
