import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import StudentDashboard from "../pages/StudentDashboard";
import FacultyDashboard from "../pages/FacultyDashboard";
import AdminDashboard from "../pages/AdminDashboard";

/**
 * Minimal router that keeps user in state and redirects by role.
 * We'll keep it small and explicit so it's easy to debug.
 */
export default function AppRouter() {
  const [user, setUser] = useState(null);

  // restore from localStorage if present
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem("token", token || "");
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Login onLogin={handleLogin} />}
        />

        <Route
          path="/student"
          element={user?.role === "student" ? <StudentDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />}
        />

        <Route
          path="/faculty"
          element={user?.role === "faculty" ? <FacultyDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />}
        />

        <Route
          path="/admin"
          element={user?.role === "admin" ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />}
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
 