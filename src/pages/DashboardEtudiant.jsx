import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import "../style.css";

function DashboardEtudiant({ userData }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(getAuth()).then(() => {
      navigate("/login");
    });
  };

  const goToMessagerie = () => {
    navigate("/messagerie");
  };

  if (!userData) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Chargement...</div>;
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f0f2f5",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "#fff",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        maxWidth: "600px",
        width: "100%",
        textAlign: "center"
      }}>
        <h2 style={{ color: "#003366", marginBottom: "20px" }}>
          Bienvenue Étudiant, {userData.prenom} {userData.nom?.toUpperCase()}
        </h2>
        <p><strong>Email :</strong> {userData.email}</p>
        <p><strong>Spécialité :</strong> {userData.specialite}</p>
        <p><strong>Niveau :</strong> {userData.niveau}</p>

        <button onClick={goToMessagerie} style={{
          marginTop: "20px",
          backgroundColor: "#007acc",
          color: "#fff",
          padding: "12px 28px",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer",
          marginRight: "10px"
        }}>
          Accéder à la messagerie
        </button>

        <button onClick={handleLogout} style={{
          marginTop: "20px",
          backgroundColor: "#003366",
          color: "#fff",
          padding: "12px 28px",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer"
        }}>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}

export default DashboardEtudiant;
