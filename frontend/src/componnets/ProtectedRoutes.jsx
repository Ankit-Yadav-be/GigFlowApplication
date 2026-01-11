import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import React from "react";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Tailwind spinner while checking auth
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Once loading is done, allow access if user exists
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
