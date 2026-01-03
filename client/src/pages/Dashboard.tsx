// ============================================
// DASHBOARD - User profile and playlists hub
// ============================================

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getPlaylists } from "../api/playlists";
import NavBar from "../components/NavBar";
import "../styles/auth.css";

const Dashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const data = await getPlaylists();
        setPlaylists(data || []);
      } catch (err) {
        console.error("Error fetching playlists:", err);
      }
    };
    fetchPlaylists();
  }, []);

  if (!user) {
    return (
      <>
        <NavBar />
        <div className="dashboard">
          <p>Please login to view your dashboard.</p>
        </div>
      </>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const totalSongs = playlists.reduce((sum, p) => sum + (p.songs?.length || 0), 0);
  const recentPlaylists = playlists.slice(0, 3);

  return (
    <>
      <NavBar />
      <div className="dashboard">
        {/* Background Elements */}
        <div className="background-elements">
          <div className="sound-waves">
            {Array.from({ length: 80 }).map((_, i) => (
              <div
                key={i}
                className="wave-bar"
                style={{
                  height: `${Math.random() * 120 + 60}px`,
                  animationDelay: `${Math.random() * 0.8}s`,
                }}
              />
            ))}
          </div>

          <div className="vinyl-record">
            <div className="record-center"></div>
          </div>

          {Array.from({ length: 20 }).map((_, i) => {
            const notes = ['♪', '♫', '♬', '𝄞'];
            return (
              <div
                key={i}
                className="floating-note"
                style={{
                  left: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 40 + 25}px`,
                  animationDelay: `${Math.random() * 8}s`,
                  animationDuration: `${Math.random() * 5 + 6}s`,
                }}
              >
                {notes[Math.floor(Math.random() * notes.length)]}
              </div>
            );
          })}
        </div>

        <div className="dashboard-container">
          {/* Welcome Section */}
          <div className="dashboard-welcome">
            <h1>Welcome back, {user.name}</h1>
            <p>Ready to discover your next favorite song?</p>
          </div>

          {/* Stats Overview */}
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-info">
                <h3>{playlists.length}</h3>
                <p>Playlists Created</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <h3>{totalSongs}</h3>
                <p>Songs Saved</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-info">
                <h3>{user.role}</h3>
                <p>Account Type</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <div className="action-card" onClick={() => navigate("/discover")}>
                <h3>Discover Music</h3>
                <p>Explore new songs and albums</p>
              </div>
              <div className="action-card" onClick={() => navigate("/playlists")}>
                <h3>My Playlists</h3>
                <p>View and manage your collections</p>
              </div>
              <div className="action-card" onClick={() => navigate("/about")}>
                <h3>About</h3>
                <p>Learn more about Echo</p>
              </div>
            </div>
          </div>

          {/* Recent Playlists */}
          {recentPlaylists.length > 0 && (
            <div className="dashboard-section">
              <div className="section-header">
                <h2>Recent Playlists</h2>
                <button className="view-all-btn" onClick={() => navigate("/playlists")}>
                  View All →
                </button>
              </div>
              <div className="recent-playlists">
                {recentPlaylists.map((playlist) => (
                  <div
                    key={playlist._id}
                    className="playlist-card"
                    onClick={() => navigate(`/playlists/${playlist._id}`)}
                  >
                    <div className="playlist-cover-small">
                      {playlist.coverImage ? (
                        <img src={playlist.coverImage} alt={playlist.name} />
                      ) : (
                        <div className="cover-placeholder-small">
                          <span>♪</span>
                        </div>
                      )}
                    </div>
                    <div className="playlist-card-info">
                      <h4>{playlist.name}</h4>
                      <p>{playlist.songs?.length || 0} songs</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Account Actions */}
          <div className="dashboard-actions">
            {user.role === "admin" && (
              <button onClick={() => navigate("/admin")} className="admin-btn">
                Admin Panel
              </button>
            )}
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
