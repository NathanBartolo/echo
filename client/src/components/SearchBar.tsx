// ============================================
// SEARCH BAR - Global search with autocomplete
// ============================================

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/searchbar.css";

type Suggestion = {
  trackId: number;
  title: string;
  artist: string;
  album: string;
  cover: string;
  previewUrl?: string | null;
};

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef<number | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // close dropdown on outside click
    const onDoc = (e: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    // debounce
    setLoading(true);
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/search?q=${encodeURIComponent(query)}&limit=5`
        );
        const data = await res.json();
        setSuggestions(data || []);
        setOpen(true);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [query]);

  const choose = (s: Suggestion) => {
    // navigate to song page; pass object in state for instant display
    console.debug("SearchBar.choose -> navigating to:", s.trackId, s.title);
    navigate(`/song/${s.trackId}`, { state: { song: s } });
    setOpen(false);
    setQuery("");
    setSuggestions([]);
  };

  return (
    <div className="searchbar-wrapper" ref={listRef}>
      <input
        className="search-input"
        value={query}
        placeholder="Search for music..."
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { if (suggestions.length) setOpen(true); }}
      />
      {loading && <div className="spinner">…</div>}

      {open && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((s) => (
            <div key={s.trackId} className="suggestion-item" onClick={() => choose(s)}>
              <img src={s.cover} alt={s.title} className="suggestion-cover" />
              <div className="suggestion-meta">
                <div className="suggestion-title">{s.title}</div>
                <div className="suggestion-sub">{s.artist} — {s.album}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && !loading && suggestions.length === 0 && (
        <div className="suggestions-dropdown">
          <div className="suggestion-item">No results</div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
