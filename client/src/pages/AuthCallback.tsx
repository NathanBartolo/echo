import React, { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const userJson = searchParams.get("user");

    if (token && userJson) {
      try {
        const user = JSON.parse(decodeURIComponent(userJson));
        login(token, user);
        navigate("/");
      } catch (err) {
        console.error("Auth callback error:", err);
        navigate("/login?error=Invalid auth response");
      }
    } else {
      const error = searchParams.get("error");
      navigate(`/login?error=${error || "Auth failed"}`);
    }
  }, [searchParams, login, navigate]);

  return <div>Processing login...</div>;
};

export default AuthCallback;
