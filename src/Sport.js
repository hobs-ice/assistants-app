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
  
  const [quizSport, setQuizSport] = useState('soccer');
const [quizQuestion, setQuizQuestion] = useState(null);
const [quizReponse, setQuizReponse] = useState('');
const [quizLoading, setQuizLoading] = useState(false);
const [questionsDejaVues, setQuestionsDejaVues] = useState(() => 
  JSON.parse(localStorage.getItem('quiz_questions_soccer') || '[]')
);
const [quizScore, setQuizScore] = useState(() => parseInt(localStorage.getItem('quiz_score_soccer') || '0'));
const [quizTotal, setQuizTotal] = useState(() => parseInt(localStorage.getItem('quiz_total_soccer') || '0'));
const [quizNiveau, setQuizNiveau] = useState(() => parseInt(localStorage.getItem('quiz_niveau_soccer') || '1'));
const [bonnesConsecutives, setBonnesConsecutives] = useState(() => parseInt(localStorage.getItem('quiz_consecutives_soccer') || '0'));



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
              content: `Tu es exclusivement un expert sportif dans l'app MacAlfer.
IMPORTANT : Si la question n'est PAS liée au sport, réponds : "Je suis l'assistant Sport 🏅 Essayez un autre assistant MacAlfer plus adapté !"

Tu es un expert sportif. Donne le palmarès complet de l'équipe ${searchQuery}.


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
              content: `Tu es exclusivement un expert sportif dans l'app MacAlfer.
IMPORTANT : Si la question n'est PAS liée au sport, réponds : "Je suis l'assistant Sport 🏅 Essayez un autre assistant MacAlfer plus adapté !"

Tu es un expert sportif. Donne le palmarès complet de ${searchQuery}.


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
            content: `Tu es exclusivement un coach sportif expert dans l'app MacAlfer.
IMPORTANT : Si la question n'est PAS liée au sport ou à l'activité physique, réponds : "Je suis l'assistant Sport 🏅 Essayez un autre assistant MacAlfer plus adapté !"

Tu es un coach sportif expert. Recommande le sport idéal pour cette personne.


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

const genererQuizSport = async () => {
  setQuizLoading(true);
  setQuizReponse('');
  setQuizQuestion(null);
  try {
    const niveaux = ['', 'DÉBUTANT', 'INTERMÉDIAIRE', 'AVANCÉ', 'DIFFICILE', 'TRÈS DIFFICILE', 'EXPERT'];
    const niveauLabel = niveaux[quizNiveau] || 'DÉBUTANT';
    const sportLabel = sportsPopulaires.find(s => s.id === quizSport)?.label || quizSport;
    const response = await fetch('https://ywtngdmvlfgoptwdejje.supabase.co/functions/v1/quiz-ia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Génère une question UNIQUE de niveau ${niveauLabel} sur : ${sportLabel} (histoire, champions, records, règles, compétitions).
IMPORTANT : Ne génère PAS ces questions déjà posées : ${questionsDejaVues.slice(-5).join(' | ')}
Seed: ${Date.now()}-${Math.random()}.
Réponds UNIQUEMENT en JSON :
{"question":"...","reponses":["A. ...","B. ...","C. ...","D. ..."],"bonne_reponse":"A","explication":"..."}`
      })
    });
    const data = await response.json();
    const clean = data.text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    const shuffled = [...parsed.reponses].sort(() => Math.random() - 0.5);
    const newBonne = shuffled.find(r => r[0] === parsed.bonne_reponse);
    setQuizQuestion({ ...parsed, reponses: shuffled, bonne_reponse: newBonne[0] });
    const newVues = [...questionsDejaVues.slice(-10), parsed.question];
    setQuestionsDejaVues(newVues);
    localStorage.setItem(`quiz_questions_${quizSport}`, JSON.stringify(newVues));
  } catch {
    setQuizQuestion(null);
  }
  setQuizLoading(false);
};

const verifierQuizSport = (reponse) => {
  setQuizReponse(reponse);
  const newTotal = quizTotal + 1;
  setQuizTotal(newTotal);
  localStorage.setItem(`quiz_total_${quizSport}`, newTotal);
  if (reponse[0] === quizQuestion.bonne_reponse) {
    const newScore = quizScore + 1;
    const newConsecutives = bonnesConsecutives + 1;
    setQuizScore(newScore);
    setBonnesConsecutives(newConsecutives);
    localStorage.setItem(`quiz_score_${quizSport}`, newScore);
    localStorage.setItem(`quiz_consecutives_${quizSport}`, newConsecutives);
    if (newConsecutives >= 20 && quizNiveau < 6) {
      const newNiveau = quizNiveau + 1;
      setQuizNiveau(newNiveau);
      setBonnesConsecutives(0);
      localStorage.setItem(`quiz_niveau_${quizSport}`, newNiveau);
    }
  } else {
    setBonnesConsecutives(0);
    localStorage.setItem(`quiz_consecutives_${quizSport}`, 0);
  }
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
          { id: 'quiz', label: '🎯 Quiz' }
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
      {/* QUIZ SPORT */}
{section === 'quiz' && (
  <div>
    <div style={styles.card}>
      <div style={styles.cardTitle}>🎯 Quiz Sport</div>
      
      <select style={styles.select} value={quizSport} onChange={e => {
        const newSport = e.target.value;
        setQuizSport(newSport);
        setQuizQuestion(null);
        setQuizReponse('');
        setQuestionsDejaVues(JSON.parse(localStorage.getItem(`quiz_questions_${newSport}`) || '[]'));
        setBonnesConsecutives(parseInt(localStorage.getItem(`quiz_consecutives_${newSport}`) || '0'));
        setQuizScore(parseInt(localStorage.getItem(`quiz_score_${newSport}`) || '0'));
        setQuizTotal(parseInt(localStorage.getItem(`quiz_total_${newSport}`) || '0'));
        setQuizNiveau(parseInt(localStorage.getItem(`quiz_niveau_${newSport}`) || '1'));
      }}>
        {sportsPopulaires.map(s => (
          <option key={s.id} value={s.id}>{s.label}</option>
        ))}
      </select>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <span style={{ color: 'white', fontSize: 13 }}>Score : {quizScore}/{quizTotal}</span>
          <span style={{ marginLeft: 12, fontSize: 11, color: quizNiveau === 1 ? '#2ecc71' : quizNiveau === 2 ? '#f39c12' : '#e74c3c' }}>
            {['', '🟢 Débutant', '🟡 Intermédiaire', '🟠 Avancé', '🔴 Difficile', '⚫ Très difficile', '💀 Expert'][quizNiveau] || '🟢 Débutant'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{20 - bonnesConsecutives} pour niveau suivant</span>
          <button onClick={() => {
            setQuizScore(0); setQuizTotal(0); setQuizQuestion(null);
            setQuizReponse(''); setBonnesConsecutives(0); setQuizNiveau(1);
            localStorage.removeItem(`quiz_score_${quizSport}`);
            localStorage.removeItem(`quiz_total_${quizSport}`);
            localStorage.removeItem(`quiz_niveau_${quizSport}`);
            localStorage.removeItem(`quiz_questions_${quizSport}`);
            localStorage.removeItem(`quiz_consecutives_${quizSport}`);
          }} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, padding: '4px 10px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 11 }}>
            Réinitialiser
          </button>
        </div>
      </div>

      <button style={styles.searchBtn} onClick={genererQuizSport} disabled={quizLoading}>
        {quizLoading ? '⏳ Génération...' : quizQuestion ? '➡️ Question suivante' : '🎯 Commencer le quiz'}
      </button>
    </div>

    {quizQuestion && (
      <div style={styles.card}>
        <div style={{ color: 'white', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>{quizQuestion.question}</div>
        {quizQuestion.reponses.map((r, i) => {
          let bg = 'rgba(255,255,255,0.05)';
          if (quizReponse) {
            if (r[0] === quizQuestion.bonne_reponse) bg = 'rgba(46,204,113,0.3)';
            else if (r === quizReponse) bg = 'rgba(231,76,60,0.3)';
          }
          return (
            <button key={i} onClick={() => !quizReponse && verifierQuizSport(r)}
              style={{ width: '100%', background: bg, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', color: 'white', cursor: quizReponse ? 'default' : 'pointer', fontSize: 13, marginBottom: 8, textAlign: 'left' }}>
              {r}
            </button>
          );
        })}
        {quizReponse && (
          <div style={{ marginTop: 12, padding: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
            <div style={{ color: quizReponse[0] === quizQuestion.bonne_reponse ? '#2ecc71' : '#e74c3c', fontWeight: 700, marginBottom: 6 }}>
              {quizReponse[0] === quizQuestion.bonne_reponse ? '✅ Bonne réponse !' : '❌ Mauvaise réponse'}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{quizQuestion.explication}</div>
          </div>
        )}
      </div>
    )}
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