import type { JSX } from "react";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// ============================================
// ADMIN ROUTE - Authorization guard
// ============================================

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { token, user } = useContext(AuthContext);
  
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;
  
  return children;
};

export default AdminRoute;
