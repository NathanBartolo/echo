// Restricts access to authenticated users - redirects to login if no token

import type { JSX } from "react";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useContext(AuthContext);
  // Redirect to login if user is not authenticated
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
