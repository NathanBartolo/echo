import "./../styles/header.css";
import NavBar from "../components/NavBar";


const Header = () => {
  return (
    <header>
      {/* NAVBAR */}
    <NavBar />

      {/* HERO SECTION */}
      <section className="hero-content">
        <h1>Music Made Easy</h1>
        <h2>Your Playlist Manager</h2>
        <p>
          Echo is designed to enhance your music experience, allowing you to
          create customized playlists effortlessly. Dive into the world of
          melodies with ease and style.
        </p>
      </section>
    </header>
  );
};

export default Header;
