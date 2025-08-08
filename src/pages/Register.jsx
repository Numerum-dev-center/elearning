import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "../style.css";

const Register = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    role: "étudiant",
    filiere: "",    // pour étudiant
    specialite: "", // pour professeur
    niveau: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // État pour afficher/masquer le mot de passe

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const { nom, prenom, email, password, role, filiere, specialite, niveau } = formData;

    if (
      !nom ||
      !prenom ||
      !email ||
      !password ||
      (role === "étudiant" && (!niveau || !filiere)) ||
      (role === "professeur" && !specialite)
    ) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userDoc = { nom, prenom, email, role, uid };

      if (role === "étudiant") {
        userDoc.niveau = niveau;
        userDoc.filiere = filiere;
      } else if (role === "professeur") {
        userDoc.specialite = specialite;
      }

      await setDoc(doc(db, "utilisateurs", uid), userDoc);
      // Redirection gérée ailleurs
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="inscription-wrapper">
      <div className="inscription-container">
        <h2 className="inscription-title">Inscription</h2>
        <form className="register-form" onSubmit={handleRegister}>
          {error && <p className="error-message">{error}</p>}

          <input name="nom" placeholder="Nom" onChange={handleChange} value={formData.nom} />
          <input name="prenom" placeholder="Prénom" onChange={handleChange} value={formData.prenom} />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} value={formData.email} />

          {/* Champ mot de passe avec bouton afficher/masquer */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              onChange={handleChange}
              value={formData.password}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                padding: "6px 10px",
                cursor: "pointer",
                backgroundColor: "#003366",
                color: "white",
                border: "none",
                borderRadius: "4px"
              }}
            >
              {showPassword ? "Masquer" : "Afficher"}
            </button>
          </div>

          <select name="role" onChange={handleChange} value={formData.role}>
            <option value="étudiant">Étudiant</option>
            <option value="professeur">Professeur</option>
          </select>

          {formData.role === "étudiant" && (
            <>
              <select name="niveau" onChange={handleChange} value={formData.niveau}>
                <option value="">-- Sélectionnez un niveau --</option>
                <option value="L1">L1</option>
                <option value="L2">L2</option>
                <option value="L3">L3</option>
                <option value="M1">M1</option>
                <option value="M2">M2</option>
              </select>
              <input
                name="filiere"
                placeholder="Filière"
                onChange={handleChange}
                value={formData.filiere}
              />
            </>
          )}

          {formData.role === "professeur" && (
            <input
              name="specialite"
              placeholder="Spécialité"
              onChange={handleChange}
              value={formData.specialite}
            />
          )}

          <button type="submit" className="btn-submit">S'inscrire</button>

          <p className="link-register">
            Déjà un compte ? <a href="/login">Se connecter</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
