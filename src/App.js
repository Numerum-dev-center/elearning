// src/App.js
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { UserProvider, UserContext } from "./context/UserContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardEtudiant from "./pages/DashboardEtudiant";
import DashboardProf from "./pages/DashboardProf";

function AppRoutes() {
  const { user, userData, loading } = useContext(UserContext);

  if (loading) return <p>Chargement...</p>;

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  if (userData?.role === "étudiant") {
    return (
      <Routes>
        <Route path="/dashboard-etudiant" element={<DashboardEtudiant userData={userData} />} />
        <Route path="*" element={<Navigate to="/dashboard-etudiant" />} />
      </Routes>
    );
  }

  if (userData?.role === "professeur") {
    return (
      <Routes>
        <Route path="/dashboard-prof" element={<DashboardProf userData={userData} />} />
        <Route path="*" element={<Navigate to="/dashboard-prof" />} />
      </Routes>
    );
  }

  return <p>Rôle utilisateur non reconnu</p>;
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}

export default App;
