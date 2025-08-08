import React from 'react';

const Cours = ({ userData }) => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h2 className="dashboard-title">Espace Cours</h2>
        <p>Bienvenue {userData.prenom}, vos cours seront affichés ici.</p>
      </div>
    </div>
  );
};

export default Cours;
