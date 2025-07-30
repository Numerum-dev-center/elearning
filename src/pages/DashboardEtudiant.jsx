import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import"../style.css";

function DashboardEtudiant() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log("Aucune donnée trouvée pour cet utilisateur.");
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des données :", error);
        }
        setLoading(false);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      navigate('/login');
    }).catch((error) => {
      console.error("Erreur lors de la déconnexion :", error);
    });
  };

  if (loading) {
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
        <h2 style={{
          marginBottom: "30px",
          fontSize: "26px",
          color: "#003366"
        }}>
          Bienvenue, {userData?.prenom} {userData?.nom?.toUpperCase()}
        </h2>
        <p style={{ marginBottom: "10px" }}><strong>Email :</strong> {userData?.email}</p>
        <p style={{ marginBottom: "10px" }}><strong>Spécialité :</strong> {userData?.specialite}</p>
        <p style={{ marginBottom: "30px" }}><strong>Niveau d'étude :</strong> {userData?.niveau}</p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#003366",
              color: "#fff",
              padding: "12px 28px",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer",
              transition: "background-color 0.3s ease"
            }}
            onMouseOver={e => e.target.style.backgroundColor = "#002244"}
            onMouseOut={e => e.target.style.backgroundColor = "#003366"}
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardEtudiant;
