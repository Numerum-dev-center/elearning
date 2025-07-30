import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../style.css";

function Login() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErreur("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, motDePasse);
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.role === "etudiant") {
          navigate("/dashboard-etudiant");
        } else if (userData.role === "professeur") {
          navigate("/dashboard-prof");
        } else {
          setErreur("Rôle utilisateur inconnu.");
        }
      } else {
        setErreur("Profil utilisateur introuvable.");
      }
    } catch (error) {
      setErreur("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleLogin} className="form-style">
        <h2 className="form-title">Connexion</h2>

        {erreur && <p className="error-message">{erreur}</p>}

        <div className="form-group">
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Mot de passe :</label>
          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-submit">Se connecter</button>

        <p className="link-register">
          Pas encore de compte ? <a href="/register">S’inscrire</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
