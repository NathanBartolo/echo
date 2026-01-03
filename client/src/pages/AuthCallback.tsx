// ============================================
// AUTH CALLBACK - OAuth callback handler
// ============================================

import React, { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [hasNavigated, setHasNavigated] = React.useState(false);

  useEffect(() => {
    if (hasNavigated) return;
    const token = searchParams.get("token");
    const userJson = searchParams.get("user");

    if (token && userJson) {
      try {
        const userObj = JSON.parse(decodeURIComponent(userJson));
        login(token, userObj);
        navigate("/");
        setHasNavigated(true);
      } catch (err) {
        console.error("Auth callback error:", err);
        navigate("/login?error=Invalid auth response");
        setHasNavigated(true);
      }
    } else {
      const error = searchParams.get("error");
      navigate(`/login?error=${error || "Auth failed"}`);
      setHasNavigated(true);
    }
    // eslint-disable-next-line
  }, [searchParams, login, navigate, hasNavigated]);

  return null;
};

export default AuthCallback;
