import "./../styles/footer.css";
import EchoLogoWhite from "../assets/Echo Logo White.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <img src={EchoLogoWhite} alt="Echo" />
        <p>
          Your personal music companion — explore, create, and enjoy playlists
          with ease and style.
        </p>
      </div>

      <div className="footer-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Contact</a>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Echo. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
