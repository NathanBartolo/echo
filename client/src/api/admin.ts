const API_BASE = "http://localhost:5000/api/admin";

function authHeader() {
  const token = localStorage.getItem("authToken");
  if (!token) return { "Content-Type": "application/json" };
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export async function listUsers() {
  const res = await fetch(`${API_BASE}/users`, { headers: authHeader() });
  return res.json();
}

export async function getUser(id: string) {
  const res = await fetch(`${API_BASE}/users/${id}`, { headers: authHeader() });
  return res.json();
}

export async function updateUserRole(id: string, role: string) {
  const res = await fetch(`${API_BASE}/users/${id}/role`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify({ role }),
  });
  return res.json();
}

export async function deleteUser(id: string) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  return res.json();
}

export async function getStats() {
  const res = await fetch(`${API_BASE}/stats`, { headers: authHeader() });
  return res.json();
}
