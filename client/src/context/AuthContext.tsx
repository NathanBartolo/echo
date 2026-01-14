// Authentication context provider

import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import { getFavorites } from "../api/favorites";

type Song = {
  id: string;
  title: string;
  artist: string;
  album?: string;
  cover?: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string | null;
} | null;

// Context type for auth state and functions
type AuthContextType = {
  user: User;
  token: string | null;
  favorites: Song[];
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  setFavorites: (favorites: Song[]) => void;
  isFavorite: (songId: string) => boolean;
};

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  favorites: [],
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  setFavorites: () => {},
  isFavorite: () => false,
});

// Auth provider component that wraps the app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize user from localStorage
  const [user, setUser] = useState<User | null>(() => {
    const rawUser = localStorage.getItem("authUser");
    return rawUser ? JSON.parse(rawUser) : null;
  });
  // Initialize token from localStorage
  const [token, setToken] = useState<string | null>(() => {
    const rawToken = localStorage.getItem("authToken");
    return rawToken || null;
  });
  // Store user's favorite songs
  const [favorites, setFavorites] = useState<Song[]>([]);

  // Persist token to localStorage when it changes
  useEffect(() => {
    if (token) localStorage.setItem("authToken", token);
    else localStorage.removeItem("authToken");
  }, [token]);

  // Persist user to localStorage when it changes
  useEffect(() => {
    if (user) localStorage.setItem("authUser", JSON.stringify(user));
    else localStorage.removeItem("authUser");
  }, [user]);

  // Load favorites when user logs in
  useEffect(() => {
    const loadFavorites = async () => {
      if (token && user) {
        try {
          const data = await getFavorites();
          setFavorites(data);
        } catch (err) {
          console.error("Failed to load favorites:", err);
        }
      } else {
        setFavorites([]);
      }
    };
    loadFavorites();
  }, [token, user]);

  // Handle user login
  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
  };

  // Handle user logout
  const logout = () => {
    setToken(null);
    setUser(null);
    setFavorites([]);
  };

  // Update user profile
  const updateUser = (newUser: User) => {
    setUser(newUser);
  };

  // Check if song is in favorites
  const isFavorite = (songId: string) => {
    return favorites.some(fav => fav.id === songId);
  };

  return (
    <AuthContext.Provider value={{ user, token, favorites, login, logout, updateUser, setFavorites, isFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context - throws error if used outside provider
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export default AuthProvider;
