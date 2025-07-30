import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function DashboardProf() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.error("Aucune donnée trouvée.");
        }
      } else {
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (!userData) {
    return <div>Chargement...</div>;
  }

  return (
    <div style={styles.container}>
      <h2>Bienvenue, Prof. {userData.prenom} {userData.nom}</h2>
      <p><strong>Email :</strong> {userData.email}</p>
      <p><strong>Matière / Spécialité :</strong> {userData.specialite}</p>
      <button onClick={handleLogout} style={styles.button}>Se déconnecter</button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 500,
    margin: '50px auto',
    padding: 20,
    border: '1px solid #ccc',
    borderRadius: 10,
    backgroundColor: '#f4f8fb',
  },
  button: {
    marginTop: 20,
    padding: '10px 20px',
    backgroundColor: '#003366',
    color: 'white',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  }
};

export default DashboardProf;
