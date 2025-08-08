import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import ProfilSidebar from "../components/ProfilSidebar";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

const DashboardProf = ({ userData }) => {
  const navigate = useNavigate();
  const [cours, setCours] = useState([]);
  const [loadingCours, setLoadingCours] = useState(true);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const allerAuxCours = () => {
    navigate("/cours");
  };

  useEffect(() => {
    if (!userData || !userData.uid) {
      setCours([]);
      setLoadingCours(false);
      return;
    }

    setLoadingCours(true);

    const q = query(
      collection(db, "cours"),
      where("uidProf", "==", userData.uid)
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
          👨‍🏫 Bienvenue, {userData.prenom} {userData.nom?.toUpperCase()} !
        </h2>
        <p style={{ fontSize: "1.1rem", color: "#555" }}>
          Prêt à gérer vos cours et interagir avec vos étudiants.
        </p>

        <div style={{ marginTop: "30px", marginBottom: "30px" }}>
          <button
            onClick={allerAuxCours}
            className="primary-btn"
            style={{ padding: "10px 20px", cursor: "pointer" }}
          >
            Accéder aux cours
          </button>
          <button
            onClick={handleLogout}
            className="secondary-btn"
            style={{ marginLeft: "10px", padding: "10px 20px", cursor: "pointer" }}
          >
            Se déconnecter
          </button>
        </div>

        <section>
          <h3 style={{ color: "#003366" }}>Vos cours postés</h3>

          {loadingCours ? (
            <p>Chargement des cours...</p>
          ) : cours.length === 0 ? (
            <p>Vous n’avez pas encore posté de cours.</p>
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
};

export default DashboardProf;
