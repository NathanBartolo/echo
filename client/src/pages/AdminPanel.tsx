import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { listUsers, updateUserRole, deleteUser, getStats } from "../api/admin";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

type Stats = {
  totalUsers: number;
  adminCount: number;
  userCount: number;
};

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersData, statsData] = await Promise.all([listUsers(), getStats()]);
      setUsers(usersData);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!window.confirm(`Change user role to ${newRole}?`)) return;

    try {
      await updateUserRole(id, newRole);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to update user role");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
    }
  };

  if (loading) return <div className="admin-panel"><p>Loading...</p></div>;

  return (
    <>
      <NavBar />
      <div className="admin-panel">
        <div className="admin-container">
          <h1>Admin Panel</h1>

          {error && <div className="error-message">{error}</div>}

          {stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-number">{stats.totalUsers}</p>
              </div>
              <div className="stat-card">
                <h3>Admins</h3>
                <p className="stat-number">{stats.adminCount}</p>
              </div>
              <div className="stat-card">
                <h3>Regular Users</h3>
                <p className="stat-number">{stats.userCount}</p>
              </div>
            </div>
          )}

          <div className="users-section">
            <h2>Manage Users</h2>
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge role-${u.role}`}>{u.role}</span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="actions">
                      <button
                        className="toggle-btn"
                        onClick={() => handleToggleRole(u._id, u.role)}
                      >
                        {u.role === "admin" ? "Make User" : "Make Admin"}
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteUser(u._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
