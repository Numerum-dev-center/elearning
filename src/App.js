import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

import Register from './pages/Register';
import Login from './pages/Login';
import DashboardEtudiant from './pages/DashboardEtudiant';
import DashboardProf from './pages/DashboardProf';

function App() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // facultatif

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const firestore = getFirestore();
        const docRef = doc(firestore, "utilisateurs", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Chargement...</div>; // ou spinner si tu préfères

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard-etudiant"
          element={<DashboardEtudiant userData={userData} />}
        />
        <Route
          path="/dashboard-prof"
          element={<DashboardProf userData={userData} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
