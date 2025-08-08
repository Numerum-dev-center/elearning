import React from 'react';

const ProfilSidebar = ({ userData, onLogout }) => {
  if (!userData) return null;

  return (
    <aside style={styles.sidebar}>
      <div style={styles.profileInfo}>
        {/* Photo de profil optionnelle */}
        {/* <img src={userData.photoURL} alt="Profil" style={styles.avatar} /> */}

        <h2 style={styles.name}>{userData.nom} {userData.prenom}</h2>
        <p><strong>Rôle :</strong> {userData.role}</p>

        {userData.role === 'étudiant' && (
          <>
            <p><strong>Filière :</strong> {userData.filiere || 'Non renseignée'}</p>
            <p><strong>Niveau :</strong> {userData.niveau || 'Non renseigné'}</p>
          </>
        )}

        {userData.role === 'professeur' && (
          <p><strong>Spécialité :</strong> {userData.specialite || 'Non renseignée'}</p>
        )}

        <p><strong>Email :</strong> {userData.email}</p>
      </div>

      <button style={styles.button} onClick={onLogout}>
        Déconnexion
      </button>
      {/* Tu peux ajouter ici un bouton "Modifier profil" plus tard */}
    </aside>
  );
};

const styles = {
  sidebar: {
    width: '260px',
    padding: '20px',
    borderRight: '1px solid #ccc',
    height: '100vh',
    boxSizing: 'border-box',
    backgroundColor: '#f5f7fa',
    color: '#003366', // bleu marine
  },
  profileInfo: {
    marginBottom: '30px',
  },
  name: {
    margin: '0 0 10px 0',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    marginBottom: '15px',
  },
  button: {
    padding: '10px 15px',
    border: 'none',
    backgroundColor: '#003366',
    color: '#fff',
    cursor: 'pointer',
    borderRadius: '4px',
    width: '100%',
  },
};

export default ProfilSidebar;
