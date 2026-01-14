// Main app router



import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SongPage from "./pages/SongPage";
import SongSearchPage from "./pages/SongSearchPage";
import PlaylistPage from "./pages/PlaylistPage";
import PlaylistDetail from "./pages/PlaylistDetail";
import AboutPage from "./pages/AboutPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import ProfilePage from "./pages/ProfilePage";
import AuthCallback from "./pages/AuthCallback";
import AlbumDetailPage from "./pages/AlbumDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/discover" element={<SongSearchPage />} /> {/* Song search and filtering */}
        <Route path="/playlists" element={<ProtectedRoute>{<PlaylistPage />}</ProtectedRoute>} />
        <Route path="/playlist/:id" element={<ProtectedRoute>{<PlaylistDetail />}</ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute>{<ProfilePage />}</ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dashboard" element={<ProtectedRoute>{<Dashboard />}</ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute>{<AdminPanel />}</AdminRoute>} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/song/:id" element={<SongPage />} />
        <Route path="/album/:albumName/:artistName" element={<AlbumDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
