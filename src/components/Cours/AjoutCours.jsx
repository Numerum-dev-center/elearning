import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import './cours.css'; // (crée ce fichier si tu veux styliser)

function AjoutCours({ userData }) {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titre || !description) {
      setMessage("Veuillez remplir tous les champs.");
      return;
    }

    try {
      await addDoc(collection(db, 'cours'), {
        titre,
        description,
        specialite: userData.specialite,
        profId: userData.uid,
        profNom: `${userData.prenom} ${userData.nom}`,
        date: Timestamp.now(),
      });
      setMessage("Cours ajouté avec succès !");
      setTitre('');
      setDescription('');
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      setMessage("Erreur lors de l'ajout du cours.");
    }
  };

  return (
    <div className="cours-form-container">
      <h2>Ajouter un cours</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Titre du cours"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
        />
        <textarea
          placeholder="Description du cours"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
}

export default AjoutCours;
