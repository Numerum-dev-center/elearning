// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

import Login from './pages/Login';
import Register from './pages/Register';
import DashboardEtudiant from './pages/DashboardEtudiant';
import DashboardProf from './pages/DashboardProf';
import Messagerie from './pages/Messagerie';

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log('No user data found');
            setUserData(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/register" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard-etudiant"
          element={
            user && userData?.role === 'etudiant' ? (
              <DashboardEtudiant userData={userData} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/dashboard-prof"
          element={
            user && userData?.role === 'professeur' ? (
              <DashboardProf userData={userData} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/messagerie"
          element={
          user ? (
          <Messagerie />
          ) : (
      <Navigate to="/login" />
    )
  }
/>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
