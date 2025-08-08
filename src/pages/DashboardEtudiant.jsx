import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import ProfilSidebar from "../components/ProfilSidebar";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

function DashboardEtudiant({ userData }) {
  const navigate = useNavigate();
  const [cours, setCours] = useState([]);
  const [loadingCours, setLoadingCours] = useState(true);

  const handleLogout = () => {
    signOut(getAuth()).then(() => {
      navigate("/login");
    });
  };

  const goToMessagerie = () => {
    navigate("/messagerie");
  };

  useEffect(() => {
    // Vérifier que userData et les champs nécessaires sont définis
    if (!userData || !userData.filiere || !userData.niveau) {
      setCours([]); // vide si pas de données
      setLoadingCours(false);
      return;
    }

    setLoadingCours(true);

    const q = query(
      collection(db, "cours"),
      where("filiere", "==", userData.filiere),
      where("niveau", "==", userData.niveau)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const coursData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCours(coursData);
      setLoadingCours(false);
    });

    return () => unsubscribe();
  }, [userData]);

  if (!userData) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Chargement...</div>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <ProfilSidebar userData={userData} onLogout={handleLogout} />

      <main style={{ flexGrow: 1, padding: "30px" }}>
        <h2
          style={{
            fontSize: "2rem",
            color: "#003366",
            marginBottom: "10px",
          }}
        >
          🎓 Bienvenue, {userData.prenom} {userData.nom?.toUpperCase()} !
        </h2>
        <p style={{ fontSize: "1.1rem", color: "#555" }}>
          Heureux de vous revoir dans votre espace étudiant.
        </p>

        <div style={{ marginTop: "30px" }}>
          <button
            onClick={goToMessagerie}
            className="primary-btn"
            style={{ marginRight: "10px", padding: "10px 20px", cursor: "pointer" }}
          >
            Accéder à la messagerie
          </button>

          <button
            onClick={handleLogout}
            className="secondary-btn"
            style={{ padding: "10px 20px", cursor: "pointer" }}
          >
            Se déconnecter
          </button>
        </div>

        <section style={{ marginTop: "40px" }}>
          <h3 style={{ color: "#003366" }}>Cours disponibles</h3>

          {loadingCours ? (
            <p>Chargement des cours...</p>
          ) : cours.length === 0 ? (
            <p>Aucun cours disponible pour votre filière et niveau.</p>
          ) : (
            <ul>
              {cours.map((c) => (
                <li key={c.id} style={{ marginBottom: "10px" }}>
                  <strong>{c.titre}</strong> — {c.description || "Pas de description"}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default DashboardEtudiant;
