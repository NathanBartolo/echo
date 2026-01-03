import "./../styles/footer.css";

// ============================================
// FOOTER - Site footer with navigation
// ============================================

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-text">ech o</span>
          </div>
          <p className="footer-tagline">
            Where music meets memory — create playlists that tell your story
          </p>
        </div>

        <div className="footer-sections">
          <div className="footer-section">
            <h4>Quick Links</h4>
            <div className="footer-links">
              <a href="/discover">Discover</a>
              <a href="/playlists">My Playlists</a>
              <a href="/about">About Echo</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <div className="footer-links">
              <a href="#">Help Center</a>
              <a href="#">Contact Us</a>
              <a href="#">Feedback</a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Follow</h4>
            <div className="footer-links">
              <a href="https://www.facebook.com/dope1512/" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://www.instagram.com/tuneechiiii/" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://github.com/NathanBartolo" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} Echo. Made by music lovers for music lovers.</p>
          <div className="footer-social">
            <span>Where music meets memories</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
