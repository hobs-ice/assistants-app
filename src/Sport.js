import React, { useState } from 'react';



const sportsPopulaires = [
  { id: 'soccer', label: '⚽ Football', query: 'Soccer' },
  { id: 'tennis', label: '🎾 Tennis', query: 'Tennis' },
  { id: 'basketball', label: '🏀 Basketball', query: 'Basketball' },
  { id: 'rugby', label: '🏉 Rugby', query: 'Rugby' },
  { id: 'cycling', label: '🚴 Cyclisme', query: 'Cycling' },
  { id: 'athletics', label: '🏃 Athlétisme', query: 'Athletics' },
  { id: 'swimming', label: '🏊 Natation', query: 'Swimming' },
  { id: 'boxing', label: '🥊 Boxe', query: 'Boxing' },
  { id: 'mma', label: '🥋 MMA', query: 'MMA' },
  { id: 'formula1', label: '🏎️ F1', query: 'Motorsport' },
  { id: 'golf', label: '⛳ Golf', query: 'Golf' },
  { id: 'volleyball', label: '🏐 Volleyball', query: 'Volleyball' },
];

export default function Sport({ onBack }) {
  const [section, setSection] = useState('actu');
  const [sportSelec, setSportSelec] = useState('soccer');
  const [searchQuery, setSearchQuery] = useState('');
  const [equipeResult, setEquipeResult] = useState(null);
  const [sportifResult, setSportifResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchType, setSearchType] = useState('equipe');
  
  const [sportifAge, setSportifAge] = useState('');
  const [sportifNiveau, setSportifNiveau] = useState('debutant');
  const [sportifObjectif, setSportifObjectif] = useState('');
  const [sportifContraintes, setSportifContraintes] = useState([]);
  const [sportifResult2, setSportifResult2] = useState('');
  const [sportifLoading, setSportifLoading] = useState(false);

  const contraintes = [
    { id: 'budget', label: '💰 Budget limité' },
    { id: 'temps', label: '⏱ Peu de temps' },
    { id: 'interieur', label: '🏠 En intérieur' },
    { id: 'exterieur', label: '🌳 En extérieur' },
    { id: 'seul', label: '👤 Seul' },
    { id: 'equipe', label: '👥 En équipe' },
    { id: 'contact', label: '🤝 Contact' },
    { id: 'handicap', label: '♿ Adapté handicap' },
  ];

  const rechercherEquipe = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setEquipeResult(null);
    setSportifResult(null);
    try {
      if (searchType === 'equipe') {
        // Groq pour le palmarès équipe
        const response = await fetch('https://assistants-app-production.up.railway.app/api/claude', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{
              role: 'user',
              content: `Tu es un expert sportif. Donne le palmarès complet de l'équipe ${searchQuery}.

Structure OBLIGATOIRE :
🏆 TITRES MAJEURS (championnats, coupes, avec années)
🥇 RECORDS ET STATISTIQUES CLÉS
🌍 INFORMATIONS GÉNÉRALES (pays, sport, fondation)
⭐ FAITS MARQUANTS

Sois précis et complet. Maximum 300 mots.`
            }]
          })
        });
        const data = await response.json();
        setEquipeResult({ nom: searchQuery, palmares: data.content?.[0]?.text || 'Aucune réponse reçue' });
      } else {
        // Groq pour le palmarès sportif
        const response = await fetch('https://assistants-app-production.up.railway.app/api/claude', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{
              role: 'user',
              content: `Tu es un expert sportif. Donne le palmarès complet de ${searchQuery}.

Structure OBLIGATOIRE :
🏆 TITRES MAJEURS (avec années)
🥇 RÉCOMPENSES INDIVIDUELLES
📊 RECORDS ET STATISTIQUES CLÉS
🌍 CARRIÈRE EN BREF (équipes, dates)
⭐ FAIT MARQUANT

Sois précis et complet. Maximum 300 mots.`
            }]
          })
        });
        const data = await response.json();
        setSportifResult({ nom: searchQuery, palmares: data.content?.[0]?.text || 'Aucune réponse reçue' });
      }
    } catch (error) {
      console.error('Erreur:', error);
      if (searchType === 'equipe') {
        setEquipeResult({ nom: searchQuery, palmares: 'Erreur — vérifiez que le serveur tourne' });
      } else {
        setSportifResult({ nom: searchQuery, palmares: 'Erreur — vérifiez que le serveur tourne' });
      }
    }
    setSearchLoading(false);
  };


  const conseilSport = async () => {
    setSportifLoading(true);
    setSportifResult2('');
    try {
      const response = await fetch('https://assistants-app-production.up.railway.app/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Tu es un coach sportif expert. Recommande le sport idéal pour cette personne.

Âge : ${sportifAge || 'Non spécifié'}
Niveau : ${sportifNiveau}
Objectif : ${sportifObjectif || 'Non spécifié'}
Contraintes : ${sportifContraintes.join(', ') || 'Aucune'}

Réponds avec :
🏆 SPORT RECOMMANDÉ (le meilleur choix avec explication)
🥈 2 ALTERNATIVES (avec pourquoi)
💪 POURQUOI CE SPORT EST FAIT POUR TOI
🚀 COMMENT COMMENCER (étapes pratiques)
⚠️ POINTS D'ATTENTION

Sois enthousiaste et motivant ! Maximum 300 mots.`
          }]
        })
      });
      const data = await response.json();
      setSportifResult2(data.content[0].text);
    } catch {
      setSportifResult2('Erreur — vérifiez que le serveur tourne');
    }
    setSportifLoading(false);
  };

  return (
    <div style={{ padding: '10px' }}>
      <button onClick={onBack} style={styles.backBtn}>← Retour</button>

      <div style={{ ...styles.header, background: 'linear-gradient(135deg, #f5365c, #f56036)' }}>
        <div style={{ fontSize: 48 }}>🏅</div>
        <h2 style={styles.headerTitle}>Assistant Sport</h2>
        <p style={styles.headerSub}>Résultats · Palmarès · Coaching · Actualité</p>
      </div>

      {/* NAVIGATION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 16 }}>
        {[
          { id: 'actu', label: '📰 Actualité' },
          { id: 'resultats', label: '🏆 Résultats' },
          { id: 'palmares', label: '🎖️ Palmarès' },
          { id: 'conseil', label: '🎯 Mon sport' },
          { id: 'coach', label: '👨‍🏫 Coach' },
        ].map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            style={{ ...styles.navBtn, ...(section === s.id ? styles.navBtnActive : {}), fontSize: 11 }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ACTUALITÉ */}
      {section === 'actu' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>📰 Actualité sportive</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {sportsPopulaires.map(s => (
                <button key={s.id} onClick={() => setSportSelec(s.id)}
                  style={{ ...styles.filtreBtn, ...(sportSelec === s.id ? styles.filtreBtnActive : {}) }}>
                  {s.label}
                </button>
              ))}
            </div>
            <a href={`https://news.google.com/search?q=${sportsPopulaires.find(s => s.id === sportSelec)?.query}+sport&hl=fr`}
              target="_blank" rel="noreferrer"
              style={{ ...styles.searchBtn, display: 'block', textAlign: 'center', textDecoration: 'none', marginBottom: 8 }}>
              📰 Dernières news Google
            </a>
            <a href="https://www.beinsports.com/france/"
              target="_blank" rel="noreferrer"
              style={{ ...styles.searchBtn, display: 'block', textAlign: 'center', textDecoration: 'none', background: 'linear-gradient(135deg, #f5a623, #e67e22)' }}>
              🗞️ Info
            </a>
          </div>
        </div>
      )}

      {/* RÉSULTATS */}
      {section === 'resultats' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🏆 Résultats & Matchs</div>
            <input style={styles.input}
              placeholder="Nom de ton équipe (ex: PSG, OM, Lakers...)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href={`https://www.flashscore.fr/#/recherche/${encodeURIComponent(searchQuery)}`}
                target="_blank" rel="noreferrer"
                style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}>
                🔴 Résultats sur Flashscore
              </a>
              <a href={`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}+résultats+matchs`}
                target="_blank" rel="noreferrer"
                style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: 'linear-gradient(135deg, #4285f4, #1a4fd6)' }}>
                🔵 Rechercher sur Google
              </a>
            </div>
          </div>
        </div>
      )}

      {/* PALMARÈS */}
      {section === 'palmares' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🎖️ Palmarès équipe ou sportif</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <button onClick={() => { setSearchType('equipe'); setEquipeResult(null); setSportifResult(null); }}
                style={{ ...styles.typeBtn, ...(searchType === 'equipe' ? styles.typeBtnActive : {}) }}>
                🏟️ Équipe
              </button>
              <button onClick={() => { setSearchType('sportif'); setEquipeResult(null); setSportifResult(null); }}
                style={{ ...styles.typeBtn, ...(searchType === 'sportif' ? styles.typeBtnActive : {}) }}>
                👤 Sportif
              </button>
            </div>
            <input style={styles.input}
              placeholder={searchType === 'equipe' ? 'Ex: PSG, Real Madrid, All Blacks...' : 'Ex: Mbappe, Nadal, Michael Jordan...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && rechercherEquipe()} />
            <button style={styles.searchBtn} onClick={rechercherEquipe} disabled={searchLoading}>
              {searchLoading ? '⏳ Recherche en cours...' : '🔍 Voir le palmarès'}
            </button>
          </div>

          {/* RÉSULTAT ÉQUIPE */}
          {equipeResult && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>🏟️ {equipeResult.nom}</div>
              <div style={{ ...styles.infoBox, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8, color: '#333' }}>
                {equipeResult.palmares}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                <a href={`https://www.transfermarkt.fr/schnellsuche/ergebnis/schnellsuche?query=${encodeURIComponent(equipeResult.nom)}`}
                  target="_blank" rel="noreferrer"
                  style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: 'linear-gradient(135deg, #27ae60, #1e8449)' }}>
                  🏆 Voir sur Transfermarkt
                </a>
                <a href={`https://www.google.com/search?q=${encodeURIComponent(equipeResult.nom)}+palmarès+titres`}
                  target="_blank" rel="noreferrer"
                  style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: 'linear-gradient(135deg, #4285f4, #1a4fd6)' }}>
                  🔵 Plus sur Google
                </a>
              </div>
            </div>
          )}

          {/* RÉSULTAT SPORTIF */}
          {sportifResult && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>👤 {sportifResult.nom}</div>
              <div style={{ ...styles.infoBox, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8, color: '#333' }}>
                {sportifResult.palmares}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                <a href={`https://fr.wikipedia.org/wiki/${encodeURIComponent(sportifResult.nom.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('_'))}`}
                  target="_blank" rel="noreferrer"
                  style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                  📖 Fiche Wikipedia
                </a>
                <a href={`https://www.google.com/search?q=${encodeURIComponent(sportifResult.nom)}+palmarès+carrière`}
                  target="_blank" rel="noreferrer"
                  style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: 'linear-gradient(135deg, #4285f4, #1a4fd6)' }}>
                  🔵 Plus sur Google
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* QUEL SPORT POUR TOI */}
      {section === 'conseil' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🎯 Quel sport est fait pour toi ?</div>
            <input style={styles.input} placeholder="Ton âge" type="number" value={sportifAge} onChange={e => setSportifAge(e.target.value)} />
            <div style={styles.cardTitle}>📊 Ton niveau</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {[
                { id: 'debutant', label: '🌱 Débutant' },
                { id: 'intermediaire', label: '📈 Intermédiaire' },
                { id: 'avance', label: '🏆 Avancé' },
              ].map(n => (
                <button key={n.id} onClick={() => setSportifNiveau(n.id)}
                  style={{ ...styles.typeBtn, flex: 1, ...(sportifNiveau === n.id ? styles.typeBtnActive : {}) }}>
                  {n.label}
                </button>
              ))}
            </div>
            <input style={styles.input}
              placeholder="Ton objectif (ex: perdre du poids, me défouler, compétition...)"
              value={sportifObjectif}
              onChange={e => setSportifObjectif(e.target.value)} />
            <div style={styles.cardTitle}>⚙️ Tes contraintes</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {contraintes.map(c => (
                <button key={c.id}
                  onClick={() => setSportifContraintes(prev =>
                    prev.includes(c.label) ? prev.filter(x => x !== c.label) : [...prev, c.label]
                  )}
                  style={{ ...styles.filtreBtn, ...(sportifContraintes.includes(c.label) ? styles.filtreBtnActive : {}) }}>
                  {c.label}
                </button>
              ))}
            </div>
            <button style={styles.searchBtn} onClick={conseilSport} disabled={sportifLoading}>
              {sportifLoading ? '⏳ Analyse...' : '🎯 Trouver mon sport idéal'}
            </button>
          </div>
          {sportifResult2 && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>🏆 Ton sport idéal</div>
              <div style={{ ...styles.infoBox, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8, color: '#333' }}>
                {sportifResult2}
              </div>
            </div>
          )}
        </div>
      )}

      {/* COACH */}
      {section === 'coach' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>👨‍🏫 Trouver un coach sportif</div>
            <a href="https://eastcoach-westcoach.com/"
              target="_blank" rel="noreferrer"
              style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', display: 'block' }}>
              👨‍🏫 Trouver un coach
            </a>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🏟️ Trouver une salle / terrain</div>
            <a href="https://www.google.com/maps/search/salle+de+sport"
              target="_blank" rel="noreferrer"
              style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: 'linear-gradient(135deg, #4285f4, #0f9d58)' }}>
              🗺️ Salle de sport proche
            </a>
          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
  backBtn: { background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 10, cursor: 'pointer', fontSize: 14, marginBottom: 20 },
  header: { borderRadius: 20, padding: 30, textAlign: 'center', marginBottom: 20 },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 700, margin: '10px 0 6px' },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  card: { background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 20, marginBottom: 16, backdropFilter: 'blur(10px)' },
  cardTitle: { color: 'white', fontSize: 16, fontWeight: 700, marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 8 },
  input: { width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: 15, marginBottom: 12, outline: 'none' },
  searchBtn: { width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #f5365c, #f56036)', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  navBtn: { padding: '10px 6px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 12, fontWeight: 600 },
  navBtnActive: { background: 'rgba(245,54,92,0.2)', color: '#f5365c', border: '1px solid #f5365c' },
  badge: { padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  infoBox: { background: 'linear-gradient(135deg, #f8f9ff, #f3e8ff)', borderRadius: 12, padding: 16 },
  typeBtn: { flex: 1, padding: '10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 13 },
  typeBtnActive: { background: 'rgba(245,54,92,0.2)', color: '#f5365c', border: '1px solid #f5365c' },
  filtreBtn: { padding: '8px 12px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 12 },
  filtreBtnActive: { background: 'rgba(245,54,92,0.2)', color: '#f5365c', border: '1px solid #f5365c' },
};