// ============================================
// SIGNUP PAGE - User registration
// ============================================

import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register as apiRegister } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import GoogleSignIn from "../components/GoogleSignIn";
import "../styles/auth.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await apiRegister(name, email, password);
    if (res && res.token) {
      login(res.token, res.user);
      navigate("/");
    } else {
      setError(res?.error || res?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-page">
      {/* Background Elements */}
      <div className="background-elements">
        <div className="sound-waves">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="wave-bar"
              style={{
                height: `${Math.random() * 120 + 60}px`,
                animationDelay: `${Math.random() * 0.8}s`,
              }}
            />
          ))}
        </div>

        <div className="vinyl-record">
          <div className="record-center"></div>
        </div>

        {Array.from({ length: 20 }).map((_, i) => {
          const notes = ['♪', '♫', '♬', '𝄞'];
          return (
            <div
              key={i}
              className="floating-note"
              style={{
                left: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 40 + 25}px`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${Math.random() * 5 + 6}s`,
              }}
            >
              {notes[Math.floor(Math.random() * notes.length)]}
            </div>
          );
        })}
      </div>

      <h2>Sign up</h2>
      <form onSubmit={onSubmit}>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Create account</button>
        {error && <div className="error">{error}</div>}
      </form>

      <div className="divider">OR</div>

      <GoogleSignIn />

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
