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
