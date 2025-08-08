import React, { useState } from 'react';
import MessageriePrivee from './MessageriePrivee';
import MessagerieGroupe from './MessagerieGroupe';

function Messagerie({ userData }) {
  const [vue, setVue] = useState('privee');

  return (
    <div style={{ padding: '20px' }}>
      <h2>Messagerie</h2>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setVue('privee')}
          style={{
            marginRight: '10px',
            padding: '8px 16px',
            backgroundColor: vue === 'privee' ? '#0052cc' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Privée
        </button>
        <button
          onClick={() => setVue('groupe')}
          style={{
            padding: '8px 16px',
            backgroundColor: vue === 'groupe' ? '#0052cc' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Groupe
        </button>
      </div>

      {/* Affichage de la messagerie selon le mode choisi */}
      {vue === 'privee' && <MessageriePrivee userData={userData} />}
      {vue === 'groupe' && <MessagerieGroupe userData={userData} />}
    </div>
  );
}

export default Messagerie;
