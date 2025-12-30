import "./../styles/navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <nav className="main-navbar">
      <button 
        className="hamburger-btn"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className={mobileMenuOpen ? "active" : ""}></span>
        <span className={mobileMenuOpen ? "active" : ""}></span>
        <span className={mobileMenuOpen ? "active" : ""}></span>
      </button>

      <div className="logo">
        <span className="logo-text">ech o</span>
      </div>

      <ul className={mobileMenuOpen ? "mobile-open" : ""}>
        <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
        <li><Link to="/discover" onClick={() => setMobileMenuOpen(false)}>Discover</Link></li>
        <li><Link to="/playlists" onClick={() => setMobileMenuOpen(false)}>Playlists</Link></li>
        <li><Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link></li>
      </ul>

      <div className="nav-auth">
        {token && user ? (
          <div className="user-menu">
            <button className="user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {user.avatar && (
                <img src={user.avatar} alt={user.name} className="user-avatar" />
              )}
              <span className="user-name">{user.name}</span>
              <span className="dropdown-icon">▼</span>
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={() => {
                  navigate("/dashboard");
                  setDropdownOpen(false);
                }}>Dashboard</button>
                <button onClick={() => {
                  navigate("/profile");
                  setDropdownOpen(false);
                }}>Profile</button>
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
          <>
            <div className="auth-links desktop-auth">
              <Link to="/login" className="auth-link">Login</Link>
              <Link to="/signup" className="auth-link signup-link">Sign up</Link>
            </div>
            <div className="auth-links mobile-auth">
              <Link to="/login" className="auth-link signup-link">Account</Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
