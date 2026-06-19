import React, { useState, useEffect } from 'react';
import './App.css';
import Medicaments from './Medicaments';
import Urgences from './Urgences';
import Nutrition from './Nutrition';
import Emploi from './Emploi';
import Films from './Films';
import Etudiant from './Etudiant';
import Business from './Business';
import Sport from './Sport';
import Game from './Game';
import Vehicule from './Vehicule';
import Justice from './Justice';
import { supabase } from './supabase';
import Auth from './Auth';


const assistants = [
  { id: 'medicaments', emoji: '💊', title: 'Médicaments', desc: 'Posologie, recommandations, pharmacies', color: '#667eea' },
  { id: 'nutrition', emoji: '🥗', title: 'Nutrition', desc: 'Calories, aliments, conseils nutritionnels', color: '#43e97b' },
  { id: 'urgences', emoji: '🚨', title: 'Urgences', desc: 'Premiers secours, numéros utiles', color: '#f5365c' },
  { id: 'emploi', emoji: '💼', title: 'Emploi', desc: 'CV, offres, conseils carrière', color: '#fb6340' },
  { id: 'films', emoji: '🎭', title: 'Audiovisuel', desc: 'Films, Séries, Acteurs, Musique', color: '#8965e0' },
  { id: 'etudiant', emoji: '🎓', title: 'Étudiant', desc: 'Cours, révisions, organisation', color: '#11cdef' },
  { id: 'business', emoji: '📈', title: 'Business', desc: 'Stratégie, finances, marketing', color: '#2dce89' },
  { id: 'sport', emoji: '🏅', title: 'Sport', desc: 'Résultats, palmarès, coaching', color: '#f5365c' },
  { id: 'game', emoji: '🎮', title: 'Gaming', desc: 'Jeux, Esports, IA Gaming', color: '#7928ca' },
  { id: 'vehicule', emoji: '🚗', title: 'Véhicule', desc: 'F1, Mécanicien IA, VIN, Auto', color: '#e74c3c' },
  { id: 'justice', emoji: '⚖️', title: 'Justice', desc: 'Avocat IA · Lois · Courriers', color: '#1a1a2e' },
];

function Home({ onSelect }) {
  return (
    <div className="home">
      <div className="header">
        <h1>🧠 Mes Assistants</h1>
        <p>Choisissez un assistant pour commencer</p>
      </div>
      <div className="grid">
        {assistants.map(a => (
          <div key={a.id} className="card" onClick={() => onSelect(a.id)} style={{ borderTop: `4px solid ${a.color}` }}>
            <div className="card-emoji">{a.emoji}</div>
            <div className="card-title">{a.title}</div>
            <div className="card-desc">{a.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Assistant({ id, onBack }) {
  const a = assistants.find(x => x.id === id);

  if (id === 'medicaments') return <Medicaments onBack={onBack} />;
  if (id === 'urgences') return <Urgences onBack={onBack} />;
  if (id === 'nutrition') return <Nutrition onBack={onBack} />;
  if (id === 'emploi') return <Emploi onBack={onBack} />;
  if (id === 'films') return <Films onBack={onBack} />;
  if (id === 'etudiant') return <Etudiant onBack={onBack} />;
  if (id === 'business') return <Business onBack={onBack} />;
  if (id === 'sport') return <Sport onBack={onBack} />;
  if (id === 'game') return <Game onBack={onBack} />;
  if (id === 'vehicule') return <Vehicule onBack={onBack} />;
  if (id === 'justice') return <Justice onBack={onBack} />;
  return (
    <div className="assistant">
      <button className="back-btn" onClick={onBack}>← Retour</button>
      <div className="assistant-header" style={{ background: a.color }}>
        <div className="assistant-emoji">{a.emoji}</div>
        <h2>{a.title}</h2>
      </div>
      <div className="coming-soon">
        <p>🚧 En construction</p>
        <p>Cet assistant arrive bientôt !</p>
      </div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!session) return <Auth />;

  return (
    <div className="app">
      {current ? (
        <Assistant id={current} onBack={() => setCurrent(null)} />
      ) : (
        <Home onSelect={setCurrent} />
      )}
    </div>
  );
}


export default App;