import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';

function MessageriePrivee({ userData }) {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [destinataire, setDestinataire] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Récupération des autres utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'utilisateurs'));
      const autres = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((u) => u.uid !== userData.uid);
      setUtilisateurs(autres);
    };
    fetchUsers();
  }, [userData.uid]);

  // Récupération des messages
  useEffect(() => {
    if (!destinataire) return;

    const q = query(
      collection(db, 'messagesPrives'),
      where('participants', 'in', [
        [userData.uid, destinataire.uid],
        [destinataire.uid, userData.uid]
      ]),
      orderBy('timestamp')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [userData.uid, destinataire]);

  const envoyerMessage = async () => {
    if (!message.trim() || !destinataire) return;

    await addDoc(collection(db, 'messagesPrives'), {
      participants: [userData.uid, destinataire.uid],
      expediteur: userData.uid,
      destinataire: destinataire.uid,
      texte: message,
      timestamp: serverTimestamp(),
    });

    setMessage('');
  };

  return (
    <div style={{ display: 'flex', height: '80vh', border: '1px solid #ccc' }}>
      {/* Sidebar des utilisateurs */}
      <div style={{ width: '30%', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
        <h3 style={{ textAlign: 'center' }}>Discussions</h3>
        {utilisateurs.map((u) => (
          <div
            key={u.uid}
            onClick={() => setDestinataire(u)}
            style={{
              padding: '10px',
              cursor: 'pointer',
              backgroundColor: destinataire?.uid === u.uid ? '#f0f0f0' : 'white',
              borderBottom: '1px solid #eee'
            }}
          >
            <strong>{u.nom} {u.prenom}</strong> ({u.role})
          </div>
        ))}
      </div>

      {/* Zone de messages */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
          <h3>
            {destinataire ? `Conversation avec ${destinataire.nom}` : 'Aucune conversation sélectionnée'}
          </h3>
          <div>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  textAlign: msg.expediteur === userData.uid ? 'right' : 'left',
                  margin: '5px 0'
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    padding: '8px 12px',
                    borderRadius: '15px',
                    backgroundColor: msg.expediteur === userData.uid ? '#DCF8C6' : '#E5E5EA',
                    maxWidth: '60%',
                    wordWrap: 'break-word'
                  }}
                >
                  {msg.texte}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Champ de saisie */}
        {destinataire && (
          <div style={{ display: 'flex', padding: '10px', borderTop: '1px solid #ccc' }}>
            <input
              type="text"
              placeholder="Votre message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ flex: 1, padding: '8px' }}
            />
            <button onClick={envoyerMessage} style={{ marginLeft: '10px' }}>
              Envoyer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageriePrivee;
