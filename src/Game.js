import React, { useState, useEffect } from 'react';

const SERVER = 'https://assistants-app-production.up.railway.app';

export default function Game({ onBack }) {
  const [section, setSection] = useState('actu');
  const [jeux, setJeux] = useState([]);
  const [jeuxLoading, setJeuxLoading] = useState(false);
  const [searchJeu, setSearchJeu] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [genreSelec, setGenreSelec] = useState('all');
  const [iaQuestion, setIaQuestion] = useState('');
  const [iaResult, setIaResult] = useState('');
  const [iaLoading, setIaLoading] = useState(false);
  const [quizType, setQuizType] = useState('gaming');
const [quizQuestion, setQuizQuestion] = useState(null);
const [quizReponse, setQuizReponse] = useState('');
const [quizLoading, setQuizLoading] = useState(false);
const [quizScore, setQuizScore] = useState(() => parseInt(localStorage.getItem('gaming_quiz_score') || '0'));
const [quizTotal, setQuizTotal] = useState(() => parseInt(localStorage.getItem('gaming_quiz_total') || '0'));
const [quizNiveau, setQuizNiveau] = useState(() => parseInt(localStorage.getItem('gaming_quiz_niveau') || '1'));
const [bonnesConsecutives, setBonnesConsecutives] = useState(0);


  /* eslint-disable react-hooks/exhaustive-deps */
useEffect(() => {
  if (section === 'actu') chargerJeux();
}, [section]);
/* eslint-enable react-hooks/exhaustive-deps */
  
const genres = [
    { id: 'all', label: '🎮 Tous' },
    { id: 'shooter', label: '🔫 FPS' },
    { id: 'moba', label: '⚔️ MOBA' },
    { id: 'battle-royale', label: '🪂 Battle Royale' },
    { id: 'racing', label: '🏎️ Racing' },
    { id: 'sports', label: '⚽ Sports' },
    { id: 'strategy', label: '🧠 Stratégie' },
    { id: 'mmorpg', label: '🌍 MMO' },
    { id: 'fighting', label: '🥊 Combat' },
  ];

  const chargerJeux = async () => {
    setJeuxLoading(true);
    setJeux([]);
    try {
      const url = genreSelec === 'all'
  ? `${SERVER}/api/games`
  : `${SERVER}/api/games?category=${genreSelec}`;


      const res = await fetch(url);
      const data = await res.json();
      setJeux(data.slice(0, 20));
    } catch { setJeux([]); }
    setJeuxLoading(false);
  };

  const rechercherJeu = async () => {
    if (!searchJeu.trim()) return;
    setSearchLoading(true);
    setSearchResults([]);
    try {
      const res = await fetch(`https://www.freetogame.com/api/games`);
      const data = await res.json();
      const filtered = data.filter(j =>
        j.title.toLowerCase().includes(searchJeu.toLowerCase()) ||
        j.genre.toLowerCase().includes(searchJeu.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 10));
    } catch { setSearchResults([]); }
    setSearchLoading(false);
  };

  const conseilGaming = async () => {
    if (!iaQuestion.trim()) return;
    setIaLoading(true);
    setIaResult('');
    try {
      const response = await fetch(`${SERVER}/api/claude`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
  model: 'llama-3.3-70b-versatile',
  temperature: 1,
  seed: Date.now(),
  messages: [{


            role: 'user',
            content: `Tu es exclusivement un expert gaming et esports dans l'app MacAlfer.

IMPORTANT : Si la question n'est PAS liée au gaming, jeux vidéo, esports ou culture gaming, réponds uniquement : "Je suis l'assistant Gaming 🎮 Je ne peux pas répondre à cette question. Essayez un autre assistant MacAlfer plus adapté !"

Si la question est liée au gaming, réponds à :
"${iaQuestion}"

Sois précis, enthousiaste et donne des conseils pratiques. Maximum 300 mots.`

          }]
        })
      });
      const data = await response.json();
      setIaResult(data.content[0].text);
    } catch { setIaResult('Erreur — vérifiez que le serveur tourne'); }
    setIaLoading(false);
  };

const genererQuizQuestion = async () => {
  setQuizLoading(true);
  setQuizReponse('');
  setQuizQuestion(null);
  try {
    const niveauLabel = quizNiveau === 1 ? 'DÉBUTANT' : quizNiveau === 2 ? 'INTERMÉDIAIRE' : 'EXPERT';
    const sujet = quizType === 'gaming' ? 'jeux vidéo, consoles, personnages, studios, esports, histoire du gaming' : 'manga, anime, personnages, auteurs, studios d\'animation, histoire du manga et anime';
    const response = await fetch(`${SERVER}/api/claude`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: `Génère une question UNIQUE de niveau ${niveauLabel} sur : ${sujet}. Ne répète jamais les mêmes questions. Seed unique: ${quizType}-${Date.now()}-${Math.random()}.


Réponds UNIQUEMENT en JSON :
{"question":"...","reponses":["A. ...","B. ...","C. ...","D. ..."],"bonne_reponse":"A","explication":"..."}`
        }]
      })
    });
    const data = await response.json();
    const clean = data.content[0].text.replace(/```json|```/g, '').trim();
    setQuizQuestion(JSON.parse(clean));
  } catch {
    setQuizQuestion(null);
  }
  setQuizLoading(false);
};

const verifierQuizReponse = (reponse) => {
  setQuizReponse(reponse);
  const newTotal = quizTotal + 1;
  setQuizTotal(newTotal);
  localStorage.setItem('gaming_quiz_total', newTotal);
  if (reponse[0] === quizQuestion.bonne_reponse) {
    const newScore = quizScore + 1;
    const newConsecutives = bonnesConsecutives + 1;
    setQuizScore(newScore);
    setBonnesConsecutives(newConsecutives);
    localStorage.setItem('gaming_quiz_score', newScore);
    if (newConsecutives >= 20 && quizNiveau < 3) {
      const newNiveau = quizNiveau + 1;
      setQuizNiveau(newNiveau);
      setBonnesConsecutives(0);
      localStorage.setItem('gaming_quiz_niveau', newNiveau);
    }
  } else {
    setBonnesConsecutives(0);
  }
};


  return (
    <div style={{ padding: '10px' }}>
      <button onClick={onBack} style={styles.backBtn}>← Retour</button>

      <div style={{ ...styles.header, background: 'linear-gradient(135deg, #7928ca, #ff0080)' }}>
        <div style={{ fontSize: 48 }}>🎮</div>
        <h2 style={styles.headerTitle}>Assistant Gaming</h2>
        <p style={styles.headerSub}>Jeux · Esports · Actualité · IA Gaming</p>
      </div>

      {/* NAVIGATION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 16 }}>
        {[
          { id: 'actu', label: '🎮 Jeux' },
          { id: 'esports', label: '🏆 Esports' },
          { id: 'recherche', label: '🔍 Recherche' },
          { id: 'sorties', label: '📅 Sorties' },
          { id: 'ia', label: '🤖 IA Gaming' },
          { id: 'quiz', label: '🎯 Quiz' },

        ].map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            style={{ ...styles.navBtn, ...(section === s.id ? styles.navBtnActive : {}), fontSize: 11 }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* JEUX GRATUITS */}
      {section === 'actu' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🎮 Jeux Free-to-Play</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {genres.map(g => (
                <button key={g.id} onClick={() => setGenreSelec(g.id)}
                  style={{ ...styles.filtreBtn, ...(genreSelec === g.id ? styles.filtreBtnActive : {}) }}>
                  {g.label}
                </button>
              ))}
            </div>
            <button style={styles.searchBtn} onClick={chargerJeux} disabled={jeuxLoading}>
              {jeuxLoading ? '⏳ Chargement...' : '🔄 Charger les jeux'}
            </button>
          </div>

          {jeux.map((jeu, i) => (
            <div key={i} style={styles.card}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                {jeu.thumbnail && (
                  <img src={jeu.thumbnail} alt={jeu.title}
                    style={{ width: 80, height: 50, borderRadius: 8, objectFit: 'cover' }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>{jeu.title}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                    <span style={{ ...styles.badge, background: '#7928ca', color: 'white' }}>{jeu.genre}</span>
                    <span style={{ ...styles.badge, background: '#0070f3', color: 'white' }}>{jeu.platform}</span>
                    <span style={{ ...styles.badge, background: '#27ae60', color: 'white' }}>🆓 Gratuit</span>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 4 }}>
                    {jeu.short_description?.substring(0, 80)}...
                  </div>
                </div>
              </div>
              <a href={jeu.game_url} target="_blank" rel="noreferrer"
                style={{ ...styles.searchBtn, display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: 8, fontSize: 13, padding: 10 }}>
                🎮 Jouer gratuitement
              </a>
            </div>
          ))}
        </div>
      )}

      {/* ESPORTS */}
      {section === 'esports' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🏆 Compétitions Esports 2026</div>
            <div style={{ ...styles.infoBox, marginBottom: 12 }}>
              <p style={{ fontSize: 13, color: '#333', fontWeight: 700, margin: '0 0 8px' }}>
                🌟 Événement majeur : Esports World Cup (EWC)
              </p>
              <p style={{ fontSize: 12, color: '#555', margin: 0 }}>
                📍 Paris, France · 75M$ de prize pool · 25 tournois · 24 jeux
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: '🔴 Twitch Esports', url: 'https://www.twitch.tv/directory/game/Esports', color: '#9146ff' },
                { label: '📺 YouTube Gaming', url: 'https://www.youtube.com/gaming', color: '#ff0000' },
                { label: '🏆 Liquipedia', url: 'https://liquipedia.net', color: '#0070f3' },
                { label: '📊 HLTV (CS2)', url: 'https://www.hltv.org', color: '#f39c12' },
                { label: '⚔️ Riot Esports', url: 'https://lolesports.com', color: '#c89b3c' },
                { label: '🎮 ESL Gaming', url: 'https://www.eslgaming.com', color: '#ff6b35' },
              ].map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noreferrer"
                  style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: `linear-gradient(135deg, ${s.color}, ${s.color}cc)` }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>📅 Calendrier compétitions</div>
            {[
              { jeu: '🎮 CS2', event: 'IEM Cologne Major 2026', date: 'Été 2026' },
              { jeu: '⚔️ League of Legends', event: 'World Championship', date: 'Fin 2026' },
              { jeu: '🔫 Valorant', event: 'VCT Champions 2026', date: 'Été 2026' },
              { jeu: '🥊 EVO 2026', event: 'Street Fighter & Tekken', date: 'Juin 2026' },
              { jeu: '🚀 Rocket League', event: 'RLCS Majors', date: 'Tout 2026' },
              { jeu: '🌍 EWC Paris', event: 'Esports World Cup', date: '2026' },
            ].map((c, i) => (
              <div key={i} style={{ ...styles.cryptoItem, marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>{c.jeu}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{c.event}</div>
                </div>
                <span style={{ ...styles.badge, background: '#7928ca', color: 'white' }}>{c.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RECHERCHE */}
      {section === 'recherche' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🔍 Rechercher un jeu gratuit</div>
            <div style={{ ...styles.infoBox, marginBottom: 12 }}>
  <p style={{ fontSize: 12, color: '#555', margin: 0 }}>
    🆓 Base de données Free-to-Play uniquement — pour les jeux payants utilise Steam ou Google
  </p>
</div>
            <input style={styles.input}
              placeholder="Ex: Fortnite, Valorant, CS2..."
              value={searchJeu}
              onChange={e => setSearchJeu(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && rechercherJeu()} />
            <button style={styles.searchBtn} onClick={rechercherJeu} disabled={searchLoading}>
              {searchLoading ? '⏳ Recherche...' : '🔍 Rechercher'}
            </button>
          </div>

          {searchResults.length === 0 && !searchLoading && searchJeu && (
  <div style={styles.card}>
    <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
      Aucun jeu gratuit trouvé — essaie sur :
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <a href={`https://www.google.com/search?q=${encodeURIComponent(searchJeu)}+jeu+video`}
        target="_blank" rel="noreferrer"
        style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center' }}>
        🔵 Rechercher sur Google
      </a>
      <a href={`https://store.steampowered.com/search/?term=${encodeURIComponent(searchJeu)}`}
        target="_blank" rel="noreferrer"
        style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: 'linear-gradient(135deg, #1b2838, #2a475e)' }}>
        🎮 Rechercher sur Steam
      </a>
    </div>
  </div>
)}

          {searchResults.map((jeu, i) => (
            <div key={i} style={styles.card}>
              <div style={{ display: 'flex', gap: 12 }}>
                {jeu.thumbnail && (
                  <img src={jeu.thumbnail} alt={jeu.title}
                    style={{ width: 80, height: 50, borderRadius: 8, objectFit: 'cover' }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'white', fontWeight: 700 }}>{jeu.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{jeu.genre} · {jeu.platform}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4 }}>
                    {jeu.short_description?.substring(0, 100)}...
                  </div>
                </div>
              </div>
              <a href={jeu.game_url} target="_blank" rel="noreferrer"
                style={{ ...styles.searchBtn, display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: 8, fontSize: 13, padding: 10 }}>
                🎮 Voir le jeu
              </a>
            </div>
          ))}
        </div>
      )}

      {/* SORTIES */}
      {section === 'sorties' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>📅 Sorties & Actualité Gaming</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="https://news.google.com/search?q=jeux+video+2026&hl=fr"
                target="_blank" rel="noreferrer"
                style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: 'linear-gradient(135deg, #4285f4, #1a4fd6)' }}>
                📰 Actualité gaming Google News
              </a>
              <a href="https://www.jeuxvideo.com/news.htm"
                target="_blank" rel="noreferrer"
                style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}>
                🎮 Jeuxvideo.com
              </a>
              <a href="https://www.ign.com/news"
                target="_blank" rel="noreferrer"
                style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: 'linear-gradient(135deg, #e74c3c, #e67e22)' }}>
                🔴 IGN News
              </a>
              <a href="https://store.steampowered.com/explore/new/"
                target="_blank" rel="noreferrer"
                style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: 'linear-gradient(135deg, #1b2838, #2a475e)' }}>
                🎮 Nouvelles sorties Steam
              </a>
              <a href="https://www.epicgames.com/store/fr/browse?sortBy=releaseDate&sortDir=DESC"
                target="_blank" rel="noreferrer"
                style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: 'linear-gradient(135deg, #0078f2, #005bb5)' }}>
                🔵 Epic Games Store
              </a>
            </div>
          </div>
        </div>
      )}

      {/* IA GAMING */}
      {section === 'ia' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🤖 Expert Gaming IA</div>
            <div style={{ ...styles.infoBox, marginBottom: 12 }}>
              <p style={{ fontSize: 12, color: '#555', margin: 0 }}>
                💡 Pose toutes tes questions gaming : builds, stratégies, comparaisons, conseils esports...
              </p>
            </div>
            <textarea style={{ ...styles.input, height: 120, resize: 'vertical' }}
              placeholder="Ex: Quel est le meilleur build pour Valorant ? Comment progresser en CS2 ? Quelle config PC pour streamer ?"
              value={iaQuestion}
              onChange={e => setIaQuestion(e.target.value)} />
            <button style={styles.searchBtn} onClick={conseilGaming} disabled={iaLoading || !iaQuestion}>
              {iaLoading ? '⏳ Analyse...' : '🤖 Demander à l\'IA'}
            </button>
          </div>

          {iaResult && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>🤖 Réponse Expert Gaming</div>
              <div style={{ ...styles.infoBox, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8, color: '#333' }}>
                {iaResult}
              </div>
            </div>
          )}
                </div>
      )}

      {/* QUIZ GAMING & MANGA */}
      {section === 'quiz' && (

  <div>
    <div style={styles.card}>
      <div style={styles.cardTitle}>🎯 Quiz Gaming & Manga</div>
      
      {/* Sélection type */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {[{ id: 'gaming', label: '🎮 Gaming' }, { id: 'manga', label: '🈵 Manga/Anime' }].map(t => (
          <button key={t.id} onClick={() => { setQuizType(t.id); setQuizQuestion(null); setQuizReponse(''); }}
            style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', background: quizType === t.id ? '#7928ca' : '#333', color: 'white', cursor: 'pointer', fontWeight: quizType === t.id ? 700 : 400, fontSize: 13 }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <span style={{ color: 'white', fontSize: 13 }}>Score : {quizScore}/{quizTotal}</span>
          <span style={{ marginLeft: 12, fontSize: 11, color: quizNiveau === 1 ? '#2ecc71' : quizNiveau === 2 ? '#f39c12' : '#e74c3c' }}>
            {quizNiveau === 1 ? '🟢 Débutant' : quizNiveau === 2 ? '🟡 Intermédiaire' : '🔴 Expert'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
            {20 - bonnesConsecutives} pour niveau suivant
          </span>
          <button onClick={() => { 
            setQuizScore(0); setQuizTotal(0); setQuizQuestion(null); 
            setQuizReponse(''); setBonnesConsecutives(0); setQuizNiveau(1);
            localStorage.removeItem('gaming_quiz_score');
            localStorage.removeItem('gaming_quiz_total');
            localStorage.removeItem('gaming_quiz_niveau');
          }} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, padding: '4px 10px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 11 }}>
            Réinitialiser
          </button>
        </div>
      </div>

      <button style={styles.searchBtn} onClick={genererQuizQuestion} disabled={quizLoading}>
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
            <button key={i} onClick={() => !quizReponse && verifierQuizReponse(r)}
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
  searchBtn: { width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #7928ca, #ff0080)', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  navBtn: { padding: '10px 6px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 12, fontWeight: 600 },
  navBtnActive: { background: 'rgba(121,40,202,0.3)', color: '#ff0080', border: '1px solid #ff0080' },
  badge: { padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  infoBox: { background: 'linear-gradient(135deg, #f8f9ff, #f3e8ff)', borderRadius: 12, padding: 16 },
  filtreBtn: { padding: '8px 12px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 12 },
  filtreBtnActive: { background: 'rgba(121,40,202,0.3)', color: '#ff0080', border: '1px solid #ff0080' },
  cryptoItem: { display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '10px 14px', marginBottom: 6 },
};