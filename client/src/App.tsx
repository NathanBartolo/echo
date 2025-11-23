// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SongPage from "./pages/SongPage";
import SongSearchPage from "./pages/SongSearchPage";
import PlaylistPage from "./pages/PlaylistPage";
import PlaylistDetail from "./pages/PlaylistDetail";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/discover" element={<SongSearchPage />} /> {/* Song search */}
        <Route path="/playlists" element={<PlaylistPage />} />
        <Route path="/playlist/:id" element={<PlaylistDetail />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/song/:id" element={<SongPage />} />
      </Routes>
    </Router>
  );
}

export default App;
