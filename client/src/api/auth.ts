// Handles all auth-related API calls: register, login, profile management

const API_BASE = `${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/auth`;

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

// Register new user account
export async function register(name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}

// Login user with email and password
export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

// Get current authenticated user info
export async function me(token: string) {
  const res = await fetch(`${API_BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// Update user profile (name, email)
export async function updateProfile(name: string, email: string) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify({ name, email }),
  });
  return res.json();
}

// Change user password
export async function changePassword(currentPassword: string, newPassword: string) {
  const res = await fetch(`${API_BASE}/profile/password`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return res.json();
}

// Update user avatar URL
export async function updateAvatar(avatar: string) {
  const res = await fetch(`${API_BASE}/profile/avatar`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify({ avatar }),
  });
  return res.json();
}

// Remove user avatar
export async function removeAvatar() {
  const res = await fetch(`${API_BASE}/profile/avatar`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return res.json();
}

// Delete user account permanently
export async function deleteAccount(password?: string) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: "DELETE",
    headers: authHeader(),
    body: JSON.stringify({ password }),
  });
  return res.json();
}
