// ============================================
// HEADER - Hero header with animated background
// ============================================

import "./../styles/header.css";
import NavBar from "../components/NavBar";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const heroRef = useRef<HTMLElement>(null);
  const soundWavesRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Create floating musical notes
    const createFloatingNotes = () => {
      const notes = ['♪', '♫', '♬', '♭', '♯', '𝄞'];
      const hero = heroRef.current;
      if (!hero) return;

      for (let i = 0; i < 15; i++) {
        const note = document.createElement('div');
        note.className = 'floating-note';
        note.textContent = notes[Math.floor(Math.random() * notes.length)];
        note.style.left = Math.random() * 100 + '%';
        note.style.animationDelay = Math.random() * 10 + 's';
        note.style.fontSize = (Math.random() * 20 + 15) + 'px';
        hero.appendChild(note);
      }
    };

    // Click to create musical notes
    const handleHeaderClick = (e: MouseEvent) => {
      const hero = heroRef.current;
      if (!hero) return;
      
      const notes = ['♪', '♫', '♬', '♭', '♯', '𝄞', '𝄢', '𝄡', '♩', '♪'];
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      // Create multiple notes for more impact
      for (let i = 0; i < 3; i++) {
        const clickNote = document.createElement('div');
        clickNote.className = 'click-note';
        clickNote.textContent = notes[Math.floor(Math.random() * notes.length)];
        
        // Position at click location with slight random offset
        clickNote.style.left = (x + (Math.random() - 0.5) * 5) + '%';
        clickNote.style.top = y + '%';
        clickNote.style.fontSize = (Math.random() * 15 + 20) + 'px';
        clickNote.style.animationDelay = (i * 0.1) + 's';
        
        // Random color variations
        const colors = ['#d4a574', '#c19660', '#2c2c2c', '#5a5a5a'];
        clickNote.style.color = colors[Math.floor(Math.random() * colors.length)];
        
        hero.appendChild(clickNote);
        
        // Remove after animation
        setTimeout(() => {
          if (clickNote.parentNode) {
            clickNote.parentNode.removeChild(clickNote);
          }
        }, 2000);
      }
    };

    // Mouse parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      const hero = heroRef.current;
      if (!hero) return;
      
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      const notes = hero.querySelectorAll('.floating-note');
      notes.forEach((note, index) => {
        const speed = (index % 3 + 1) * 0.5;
        const element = note as HTMLElement;
        element.style.transform = `translate(${x * speed * 10}px, ${y * speed * 10}px)`;
      });
    };

    // Animate sound waves
    const animateSoundWaves = () => {
      const waves = soundWavesRef.current;
      if (!waves) return;
      
      const bars = waves.querySelectorAll('.wave-bar');
      bars.forEach((bar, index) => {
        const element = bar as HTMLElement;
        const height = Math.random() * 60 + 20;
        element.style.height = height + 'px';
        element.style.animationDelay = (index * 0.1) + 's';
      });
    };

    createFloatingNotes();
    document.addEventListener('mousemove', handleMouseMove);
    
    // Add click listener to header
    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener('click', handleHeaderClick);
    }
    
    const interval = setInterval(animateSoundWaves, 200);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (hero) {
        hero.removeEventListener('click', handleHeaderClick);
      }
      clearInterval(interval);
    };
  }, []);

  return (
    <header ref={heroRef}>
      <NavBar />
      
      {/* Interactive background elements */}
      <div className="background-elements">
        <div className="sound-waves" ref={soundWavesRef}>
          {Array.from({ length: 50 }, (_, i) => (
            <div key={i} className="wave-bar"></div>
          ))}
        </div>
        <div className="vinyl-record">
          <div className="record-center"></div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="hero-content">
        <div className="title-container">
          <h1 className="main-title">
            <span className="letter">e</span>
            <span className="letter">c</span>
            <span className="letter">h</span>
            <span className="letter space"> </span>
            <span className="letter">o</span>
          </h1>
          <div className="sound-equalizer">
            <div className="eq-bar"></div>
            <div className="eq-bar"></div>
            <div className="eq-bar"></div>
            <div className="eq-bar"></div>
            <div className="eq-bar"></div>
          </div>
        </div>
        <h2>Where Music Meets Memory</h2>
        <p>
          Create playlists that tell your story. Whether it's that perfect road trip mix, 
          late-night study vibes, or songs that bring back memories — Ech o helps you 
          organize your soundtrack to life.
        </p>
        <div className="cta-container">
          <button 
            className="explore-btn"
            onClick={() => navigate('/discover')}
          >
            <span>Start Exploring</span>
            <div className="btn-wave"></div>
          </button>
        </div>
      </section>
    </header>
  );
};

export default Header;
