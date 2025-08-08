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
} from 'firebase/firestore';

function MessagerieGroupe({ userData }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!userData.matiere) return;

    const q = query(
      collection(db, 'messagesGroupes'),
      where('groupe', '==', userData.matiere),
      orderBy('timestamp')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [userData.matiere]);

  const envoyerMessage = async () => {
    if (!message.trim()) return;

    await addDoc(collection(db, 'messagesGroupes'), {
      groupe: userData.matiere,
      expediteurNom: `${userData.nom} ${userData.prenom}`,
      texte: message,
      timestamp: serverTimestamp(),
    });

    setMessage('');
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Discussion du groupe : {userData.matiere}</h2>

      <div style={styles.messagesContainer}>
        {messages.map((msg) => (
          <div key={msg.id} style={styles.messageBubble}>
            <div style={styles.messageHeader}>
              <strong>{msg.expediteurNom}</strong>
              <span style={styles.timestamp}>{formatDate(msg.timestamp)}</span>
            </div>
            <div>{msg.texte}</div>
          </div>
        ))}
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Écrire un message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.input}
        />
        <button onClick={envoyerMessage} style={styles.button}>
          Envoyer
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  messagesContainer: {
    maxHeight: '400px',
    overflowY: 'auto',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    background: '#f9f9f9',
    marginBottom: '20px',
  },
  messageBubble: {
    background: '#fff',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
  },
  timestamp: {
    fontSize: '0.8em',
    color: '#888',
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    background: '#004080',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default MessagerieGroupe;
