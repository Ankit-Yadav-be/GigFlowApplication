import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/DashBoard";
import CreateGig from "./pages/CreateGig";
import GigDetail from "./pages/GigDetail";
import ProtectedRoute from "./componnets/ProtectedRoutes"; 

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-gig"
        element={
          <ProtectedRoute>
            <CreateGig />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gig/:id"
        element={
          <ProtectedRoute>
            <GigDetail />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
