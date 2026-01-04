// ============================================
// AUTH CALLBACK - OAuth callback handler
// ============================================

import { useEffect, useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [hasNavigated, setHasNavigated] = useState(false);
  const [status, setStatus] = useState("Completing sign-in...");

  useEffect(() => {
    if (hasNavigated) return;
    const token = searchParams.get("token");
    const userJson = searchParams.get("user");

    if (token) {
      try {
        let parsedUser = null;
        if (userJson) {
          parsedUser = JSON.parse(decodeURIComponent(userJson));
        }
        login(token, parsedUser);
        setStatus("Redirecting...");
        setHasNavigated(true);
        navigate("/");
        return;
      } catch (err) {
        console.error("Auth callback parse error:", err);
        setStatus("Invalid auth response. Returning to login...");
        setHasNavigated(true);
        navigate("/login?error=Invalid%20auth%20response");
        return;
      }
    }

    const error = searchParams.get("error");
    setStatus("Auth failed. Returning to login...");
    setHasNavigated(true);
    navigate(`/login?error=${error || "Auth failed"}`);
    // eslint-disable-next-line
  }, [searchParams, login, navigate, hasNavigated]);

  return <div style={{ padding: "2rem", textAlign: "center" }}>{status}</div>;
};

export default AuthCallback;
