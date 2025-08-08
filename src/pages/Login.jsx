// src/pages/Login.jsx
import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "../style.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // état pour afficher/masquer
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirection via UserContext
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <div className="form-style">
        <h2 className="form-title">Connexion</h2>
        <form onSubmit={handleLogin}>
          {error && <p className="error-message">{error}</p>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>

          <button type="submit" className="btn-submit">Se connecter</button>

          <p className="link-register">
            Pas encore de compte ? <a href="/register">S’inscrire</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
