import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

function Messagerie() {
  const [messages, setMessages] = useState([]);
  const [texte, setTexte] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });

    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeMessages();
    };
  }, []);

  const envoyerMessage = async () => {
    if (texte.trim() === '' || !user) return;
    await addDoc(collection(db, "messages"), {
      uid: user.uid,
      email: user.email,
      texte: texte,
      timestamp: new Date()
    });
    setTexte('');
  };

  const handleDelete = async (messageId) => {
    try {
      await deleteDoc(doc(db, "messages", messageId));
      console.log("Message supprimé");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Messagerie</h2>
      <div style={{
        border: "1px solid #ccc",
        padding: "10px",
        height: "300px",
        overflowY: "scroll",
        marginBottom: "10px"
      }}>
        {messages.map((msg) => (
          <div key={msg.id} className="message-bulle" style={{ marginBottom: "8px" }}>
            <p><strong>{msg.email}</strong> : {msg.texte}</p>
            {user && msg.uid === user.uid && (
              <button onClick={() => handleDelete(msg.id)} className="btn-supprimer">
                🗑️ Supprimer
              </button>
            )}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        placeholder="Écris ton message..."
        style={{ width: "70%", padding: "8px" }}
      />
      <button onClick={envoyerMessage} style={{ padding: "8px 16px", marginLeft: "10px" }}>Envoyer</button>
    </div>
  );
}

export default Messagerie;
