import React, { useState } from 'react';
import '../style.css';

const Register = () => {
  const [role, setRole] = useState('étudiant');

  return (
    <div className="inscription-wrapper">
      <div className="inscription-container">
        <h2 className="inscription-title">Inscription</h2>
        <form className="register-form">
          <input type="text" placeholder="Nom" required />
          <input type="text" placeholder="Prénom" required />
          <input type="text" placeholder="Nom d'utilisateur" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Mot de passe" required />
          <select
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="étudiant">Étudiant</option>
            <option value="professeur">Professeur</option>
          </select>
          <input
            type="text"
            placeholder={role === 'professeur' ? 'Matière enseignée' : 'Filière / Spécialité'}
            required
          />
          <input type="text" placeholder="Niveau d'étude" required />
          <button type="submit" className="btn-submit">S'inscrire</button>
          <p className="redirect-login">
            Vous avez déjà un compte ? <a href="/login">Connectez-vous ici</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
