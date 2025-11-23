import "./../styles/navbar.css";
import EchoLogo from "../assets/Echo Logo Black.png";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="main-navbar">
        <div className="logo">
          <img src={EchoLogo} alt="Echo" />
        </div>

        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/discover">Discover</Link></li>
          <li><Link to="/playlists">Playlists</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>

        <div className="search-bar">
          <SearchBar />
        </div>
      </nav>
  );
};

export default NavBar;
