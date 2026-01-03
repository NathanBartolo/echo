const API_BASE = `${import.meta.env.VITE_API_BASE || 'http://localhost:5000'}/api/auth`;

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

export async function register(name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function me(token: string) {
  const res = await fetch(`${API_BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function updateProfile(name: string, email: string) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify({ name, email }),
  });
  return res.json();
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const res = await fetch(`${API_BASE}/profile/password`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return res.json();
}

export async function updateAvatar(avatar: string) {
  const res = await fetch(`${API_BASE}/profile/avatar`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify({ avatar }),
  });
  return res.json();
}

export async function removeAvatar() {
  const res = await fetch(`${API_BASE}/profile/avatar`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return res.json();
}

export async function deleteAccount(password?: string) {
  const res = await fetch(`${API_BASE}/profile`, {
    method: "DELETE",
    headers: authHeader(),
    body: JSON.stringify({ password }),
  });
  return res.json();
}
