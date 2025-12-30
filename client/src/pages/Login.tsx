import React, { useState, useContext } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { login as apiLogin } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import GoogleSignIn from "../components/GoogleSignIn";
import "../styles/auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Check for auth errors from callback
  React.useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) setError(errorParam);
  }, [searchParams]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await apiLogin(email, password);
    if (res && res.token) {
      login(res.token, res.user);
      navigate("/");
    } else {
      setError(res?.error || res?.message || "Login failed");
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

      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
        {error && <div className="error">{error}</div>}
      </form>

      <div className="divider">OR</div>

      <GoogleSignIn />

      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
