import "./../styles/navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <nav className="main-navbar">
      <div className="logo">
        <span className="logo-text">ech o</span>
      </div>

      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/discover">Discover</Link></li>
        <li><Link to="/playlists">Playlists</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>

      <div className="nav-auth">
        {token && user ? (
          <div className="user-menu">
            <button className="user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <span className="user-name">{user.name}</span>
              <span className="dropdown-icon">▼</span>
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={() => {
                  navigate("/dashboard");
                  setDropdownOpen(false);
                }}>Dashboard</button>
                {user.role === "admin" && (
                  <button onClick={() => {
                    navigate("/admin");
                    setDropdownOpen(false);
                  }}>Admin Panel</button>
                )}
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="auth-link">Login</Link>
            <Link to="/signup" className="auth-link signup-link">Sign up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
