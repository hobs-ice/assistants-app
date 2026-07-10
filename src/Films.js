import React, { useState } from 'react';


const TMDB_KEY = process.env.REACT_APP_TMDB_KEY || 'ec7ef31e986d344b40a4cdc2fcfd00ba';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';

export default function Films({ onBack }) {
  const [section, setSection] = useState('films');
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState('movie');
  const [results, setResults] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actorSearch, setActorSearch] = useState('');
  const [actorResult, setActorResult] = useState(null);
  const [cinema, setCinema] = useState([]);
  const [musique, setMusique] = useState([]);
  const [musiqueGenre, setMusiqueGenre] = useState('pop');
  const [musiqueLoading, setMusiqueLoading] = useState(false);
  const [shazamDesc, setShazamDesc] = useState('');
  const [shazamResult, setShazamResult] = useState(null);
  const [shazamLoading, setShazamLoading] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [quizCategorie, setQuizCategorie] = useState('films');
const [quizQuestion, setQuizQuestion] = useState(null);
const [quizReponse, setQuizReponse] = useState('');
const [quizLoading, setQuizLoading] = useState(false);
const [questionsDejaVues, setQuestionsDejaVues] = useState(() => 
  JSON.parse(localStorage.getItem('quiz_questions_films') || '[]')
);
const [quizScore, setQuizScore] = useState(() => parseInt(localStorage.getItem('quiz_score_films') || '0'));
const [quizTotal, setQuizTotal] = useState(() => parseInt(localStorage.getItem('quiz_total_films') || '0'));
const [quizNiveau, setQuizNiveau] = useState(() => parseInt(localStorage.getItem('quiz_niveau_films') || '1'));
const [bonnesConsecutives, setBonnesConsecutives] = useState(() => parseInt(localStorage.getItem('quiz_consecutives_films') || '0'));

   const rechercher = async () => {
    if (!search.trim()) return;
    setLoading(true);
    setResults([]);
    setDetail(null);
    try {
      const res = await fetch(
        `${TMDB_BASE}/search/${searchType}?api_key=${TMDB_KEY}&query=${encodeURIComponent(search)}&language=fr-FR`
      );
      const data = await res.json();
      setResults(data.results || []);
    } catch { setResults([]); }
    setLoading(false);
  };

  const voirDetail = async (id) => {
    setLoading(true);
    try {
      const [detail, credits, videos, providers] = await Promise.all([
        fetch(`${TMDB_BASE}/${searchType}/${id}?api_key=${TMDB_KEY}&language=fr-FR`).then(r => r.json()),
        fetch(`${TMDB_BASE}/${searchType}/${id}/credits?api_key=${TMDB_KEY}&language=fr-FR`).then(r => r.json()),
        fetch(`${TMDB_BASE}/${searchType}/${id}/videos?api_key=${TMDB_KEY}&language=fr-FR`).then(r => r.json()),
        fetch(`${TMDB_BASE}/${searchType}/${id}/watch/providers?api_key=${TMDB_KEY}`).then(r => r.json()),
      ]);
      const trailer = videos.results?.find(v => v.type === 'Trailer') || videos.results?.[0];
      const frProviders = providers.results?.FR;
      setDetail({ ...detail, credits, trailer, frProviders });
    } catch {}
    setLoading(false);
  };

  const rechercherActeur = async () => {
    if (!actorSearch.trim()) return;
    setLoading(true);
    setActorResult(null);
    try {
      const res = await fetch(
        `${TMDB_BASE}/search/person?api_key=${TMDB_KEY}&query=${encodeURIComponent(actorSearch)}&language=fr-FR`
      );
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const actor = data.results[0];
        const credits = await fetch(
          `${TMDB_BASE}/person/${actor.id}/combined_credits?api_key=${TMDB_KEY}&language=fr-FR`
        ).then(r => r.json());
        setActorResult({ ...actor, credits });
      }
    } catch {}
    setLoading(false);
  };

  const chargerCinema = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${TMDB_BASE}/movie/now_playing?api_key=${TMDB_KEY}&language=fr-FR&region=FR`
      );
      const data = await res.json();
      setCinema(data.results || []);
    } catch {}
    setLoading(false);
  };

  const rechercherMusique = async () => {
    setMusiqueLoading(true);
    try {
      const res = await fetch(
        `https://assistants-app-production.up.railway.app/api/music?type=charts`
      );
      const data = await res.json();
      const results = data.results || (data.feed?.entry || []).map(e => ({
  trackName: e['im:name']?.label,
  artistName: e['im:artist']?.label,
  artworkUrl60: e['im:image']?.[0]?.label,
  trackViewUrl: e.link?.attributes?.href,
}));
setMusique(results);
    } catch {}
    setMusiqueLoading(false);
  };

const rechercherArtiste = async () => {
  if (!search.trim()) return;
  setLoading(true);
  setMusique([]);
  try {
    const [songsRes, albumsRes] = await Promise.all([
      fetch(`https://assistants-app-production.up.railway.app/api/music?term=${encodeURIComponent(search)}`),
      fetch(`https://assistants-app-production.up.railway.app/api/music?term=${encodeURIComponent(search)}&type=albums`)
    ]);
    const songsData = await songsRes.json();
    const albumsData = await albumsRes.json();
    setMusique(songsData.results || []);
    setAlbums(albumsData.results || []);
  } catch {}
  setLoading(false);
};

  const shazamFilm = async () => {
  if (!shazamDesc.trim()) return;
  setShazamLoading(true);
  setShazamResult(null);
  try {
    const response = await fetch('https://assistants-app-production.up.railway.app/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: `Tu es un expert en cinéma et séries TV. 
          
L'utilisateur décrit un film ou une série dont il ne se souvient plus du titre.

Description : "${shazamDesc}"

Identifie le film ou la série et réponds UNIQUEMENT en JSON avec ce format exact :
{
  "titre": "Titre exact en français",
  "titre_original": "Original title",
  "type": "film ou serie",
  "annee": 2010,
  "confidence": "élevée/moyenne/faible",
  "explication": "Pourquoi tu penses que c'est ce film en 1-2 phrases",
  "autres_possibilites": ["Titre 2", "Titre 3"]
}`
        }]
      })
    });
    const data = await response.json();
    const text = data.content[0].text;
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    
    // Chercher sur TMDB
    const tmdbRes = await fetch(
      `${TMDB_BASE}/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(parsed.titre_original || parsed.titre)}&language=fr-FR`
    );
    const tmdbData = await tmdbRes.json();
    const tmdbResult = tmdbData.results?.[0];
    
    setShazamResult({ ...parsed, tmdb: tmdbResult });
  } catch {
    setShazamResult({ error: true });
  }
  setShazamLoading(false);
};

const genererQuizFilms = async () => {
  setQuizLoading(true);
  setQuizReponse('');
  setQuizQuestion(null);
  try {
    const niveaux = [
  '',
  'DÉBUTANT (ex: Quel acteur joue Spider-Man ? Qui réalise Titanic ?)',
  'INTERMÉDIAIRE (ex: Quelle année sort Le Parrain ? Combien d\'Oscars a gagné La La Land ?)',
  'AVANCÉ (ex: Quel compositeur a fait la BO de Star Wars ? Qui double Simba en français ?)',
  'DIFFICILE (ex: Quel film a gagné la Palme d\'Or en 1994 ? Quel acteur a refusé l\'Oscar en 1973 ?)',
  'TRÈS DIFFICILE (ex: Dans quel film Hitchcock fait-il une apparition à 41 minutes ? Quel est le vrai nom de Cary Grant ?)',
  'EXPERT ABSOLU (ex: Quel réalisateur a tourné 127 prises pour une scène dans Eyes Wide Shut ? Quelle actrice a été payée 1$ pour un rôle en 1999 ?)'
];
const niveauLabel = niveaux[quizNiveau] || niveaux[1];

    const categories = {
      films: 'films, cinéma, réalisateurs, acteurs, oscars, histoire du cinéma',
      series: 'séries TV, personnages, acteurs, récompenses, streaming',
      acteurs: 'acteurs et actrices célèbres, leur carrière, leurs films',
      musique: 'musique, artistes, albums, Grammy, histoire de la musique'
    };
    const response = await fetch('https://ywtngdmvlfgoptwdejje.supabase.co/functions/v1/quiz-ia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Génère une question UNIQUE de niveau ${niveauLabel} sur : ${categories[quizCategorie]}.
IMPORTANT : Ne génère PAS ces questions déjà posées : ${questionsDejaVues.slice(-5).join(' | ')}
Seed: ${Date.now()}-${Math.random()}.
Réponds UNIQUEMENT en JSON :
{"question":"...","reponses":["A. ...","B. ...","C. ...","D. ..."],"bonne_reponse":"A","explication":"..."}`
      })
    });
    const data = await response.json();
    const clean = data.text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    setQuizQuestion(parsed);
    const shuffled = [...parsed.reponses].sort(() => Math.random() - 0.5);
const newBonne = shuffled.find(r => r[0] === parsed.bonne_reponse);
setQuizQuestion({ ...parsed, reponses: shuffled, bonne_reponse: newBonne[0] });

    const newVues = [...questionsDejaVues.slice(-10), parsed.question];
    setQuestionsDejaVues(newVues);
    localStorage.setItem(`quiz_questions_${quizCategorie}`, JSON.stringify(newVues));
  } catch {
    setQuizQuestion(null);
  }
  setQuizLoading(false);
};

const verifierQuizFilms = (reponse) => {
  setQuizReponse(reponse);
  const newTotal = quizTotal + 1;
  setQuizTotal(newTotal);
  localStorage.setItem(`quiz_total_${quizCategorie}`, newTotal);
  if (reponse[0] === quizQuestion.bonne_reponse) {
    const newScore = quizScore + 1;
    const newConsecutives = bonnesConsecutives + 1;
    setQuizScore(newScore);
    setBonnesConsecutives(newConsecutives);
    localStorage.setItem(`quiz_score_${quizCategorie}`, newScore);
    localStorage.setItem(`quiz_consecutives_${quizCategorie}`, newConsecutives);
    if (newConsecutives >= 20 && quizNiveau < 6) {
      const newNiveau = quizNiveau + 1;
      setQuizNiveau(newNiveau);
      setBonnesConsecutives(0);
      localStorage.setItem(`quiz_niveau_${quizCategorie}`, newNiveau);
    }
  } else {
    setBonnesConsecutives(0);
    localStorage.setItem(`quiz_consecutives_${quizCategorie}`, 0);
  }
};


  return (
    <div style={{ padding: '10px' }}>
      <button onClick={onBack} style={styles.backBtn}>← Retour</button>

      <div style={{ ...styles.header, background: 'linear-gradient(135deg, #8965e0, #6741d9)' }}>
        <div style={{ fontSize: 48 }}>🎭</div>
        <h2 style={styles.headerTitle}>Audiovisuel</h2>
        <p style={styles.headerSub}>Films · Séries · Acteurs · Cinéma · Musique</p>
      </div>

      {/* NAVIGATION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr1fr 1fr', gap: 6, marginBottom: 16 }}>
        {[
          { id: 'films', label: '🎬 Films' },
          { id: 'acteurs', label: '🎭 Acteurs' },
          { id: 'cinema', label: '🎞️ Cinéma' },
          { id: 'musique', label: '🎵 Musique' },
          { id: 'shazam', label: '🔮 Sesha' },
          { id: 'quiz', label: '🎯 Quiz' },

        ].map(s => (
          <button key={s.id} onClick={() => { setSection(s.id); if (s.id === 'cinema') chargerCinema(); }}
            style={{ ...styles.navBtn, ...(section === s.id ? styles.navBtnActive : {}), fontSize: 11 }}>
            {s.label}
          </button>
        ))}

        {/* QUIZ AUDIOVISUEL */}
{section === 'quiz' && (
  <div>
    <div style={styles.card}>
      <div style={styles.cardTitle}>🎯 Quiz Audiovisuel</div>
      
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {[
          { id: 'films', label: '🎬 Films' },
          { id: 'series', label: '📺 Séries' },
          { id: 'acteurs', label: '🎭 Acteurs' },
          { id: 'musique', label: '🎵 Musique' },
        ].map(t => (
          <button key={t.id} onClick={() => {
            const newCat = t.id;
            setQuizCategorie(newCat);
            setQuizQuestion(null);
            setQuizReponse('');
            setQuestionsDejaVues(JSON.parse(localStorage.getItem(`quiz_questions_${newCat}`) || '[]'));
            setBonnesConsecutives(parseInt(localStorage.getItem(`quiz_consecutives_${newCat}`) || '0'));
            setQuizScore(parseInt(localStorage.getItem(`quiz_score_${newCat}`) || '0'));
            setQuizTotal(parseInt(localStorage.getItem(`quiz_total_${newCat}`) || '0'));
            setQuizNiveau(parseInt(localStorage.getItem(`quiz_niveau_${newCat}`) || '1'));
          }}
            style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', background: quizCategorie === t.id ? '#8965e0' : '#333', color: 'white', cursor: 'pointer', fontWeight: quizCategorie === t.id ? 700 : 400, fontSize: 12 }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <span style={{ color: 'white', fontSize: 13 }}>Score : {quizScore}/{quizTotal}</span>
          <span style={{ marginLeft: 12, fontSize: 11, color: quizNiveau === 1 ? '#2ecc71' : quizNiveau === 2 ? '#f39c12' : '#e74c3c' }}>
            {['', '🍿 Spectateur du dimanche', '🎬 Cinéphile', '🎭 Critique de cinéma', '🏆 Membre du jury', '🎬 Réalisateur', '🌟 Légende d\'Hollywood'][quizNiveau] || '🍿 Spectateur du dimanche'}

          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{20 - bonnesConsecutives} pour niveau suivant</span>
          <button onClick={() => {
            setQuizScore(0); setQuizTotal(0); setQuizQuestion(null);
            setQuizReponse(''); setBonnesConsecutives(0); setQuizNiveau(1);
            localStorage.removeItem(`quiz_score_${quizCategorie}`);
            localStorage.removeItem(`quiz_total_${quizCategorie}`);
            localStorage.removeItem(`quiz_niveau_${quizCategorie}`);
            localStorage.removeItem(`quiz_questions_${quizCategorie}`);
            localStorage.removeItem(`quiz_consecutives_${quizCategorie}`);
          }} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, padding: '4px 10px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 11 }}>
            Réinitialiser
          </button>
        </div>
      </div>

      <button style={styles.searchBtn} onClick={genererQuizFilms} disabled={quizLoading}>
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
            <button key={i} onClick={() => !quizReponse && verifierQuizFilms(r)}
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


{/* SHAZAM FILM */}
{section === 'shazam' && (
  <div>
    <div style={styles.card}>
      <div style={styles.cardTitle}>🔮 Retrouver un film / série</div>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 12, lineHeight: 1.6 }}>
        Décrivez ce dont vous vous souvenez — scène, acteur, ambiance, histoire... on vous retrouve le film !
      </p>
      <textarea
        style={{ ...styles.input, height: 120, resize: 'vertical' }}
        placeholder="Ex: Un film avec un homme qui entre dans les rêves des gens, il y a une toupie à la fin..."
        value={shazamDesc}
        onChange={e => setShazamDesc(e.target.value)}
      />
      <button style={styles.searchBtn} onClick={shazamFilm} disabled={shazamLoading || !shazamDesc}>
        {shazamLoading ? '⏳ Recherche en cours...' : '🔮 Identifier le film'}
      </button>
    </div>

    {shazamResult?.error && (
      <div style={styles.card}>
        <p style={{ color: '#f5365c', textAlign: 'center' }}>❌ Impossible d'identifier — essayez avec plus de détails</p>
      </div>
    )}

    {shazamResult && !shazamResult.error && (
      <div style={styles.card}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 16 }}>
          {shazamResult.tmdb?.poster_path && (
            <img src={`${TMDB_IMG}${shazamResult.tmdb.poster_path}`}
              alt={shazamResult.titre}
              style={{ width: 80, height: 120, borderRadius: 12, objectFit: 'cover' }} />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ color: 'white', fontSize: 20, fontWeight: 800, marginBottom: 6 }}>
              {shazamResult.titre}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
              <span style={{ ...styles.badge, background: '#8965e0', color: 'white' }}>
                {shazamResult.type === 'film' ? '🎬 Film' : '📺 Série'}
              </span>
              <span style={{ ...styles.badge, background: '#667eea', color: 'white' }}>
                📅 {shazamResult.annee}
              </span>
              <span style={{ ...styles.badge, 
                background: shazamResult.confidence === 'élevée' ? '#27ae60' : shazamResult.confidence === 'moyenne' ? '#f39c12' : '#e74c3c', 
                color: 'white' }}>
                🎯 Confiance {shazamResult.confidence}
              </span>
              {shazamResult.tmdb?.vote_average > 0 && (
                <span style={{ ...styles.badge, background: '#f39c12', color: 'white' }}>
                  ⭐ {shazamResult.tmdb.vote_average.toFixed(1)}
                </span>
              )}
            </div>
            <div style={styles.infoBox}>
              <p style={{ fontSize: 13, color: '#333', margin: 0, lineHeight: 1.6 }}>
                💡 {shazamResult.explication}
              </p>
            </div>
          </div>
        </div>

        {shazamResult.tmdb?.overview && (
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>
            {shazamResult.tmdb.overview}
          </p>
        )}

        {shazamResult.autres_possibilites?.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 8 }}>
              🤔 Autres possibilités :
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {shazamResult.autres_possibilites.map((t, i) => (
                <span key={i} style={{ ...styles.badge, background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={async () => {
  if (shazamResult.tmdb) {
    const type = shazamResult.type === 'film' ? 'movie' : 'tv';
    setSearchType(type);
    setSection('films');
    setDetail(null);
    const res = await fetch(`${TMDB_BASE}/${type}/${shazamResult.tmdb.id}?api_key=${TMDB_KEY}&language=fr-FR`);
    const data = await res.json();
    const credits = await fetch(`${TMDB_BASE}/${type}/${shazamResult.tmdb.id}/credits?api_key=${TMDB_KEY}&language=fr-FR`).then(r => r.json());
    const videos = await fetch(`${TMDB_BASE}/${type}/${shazamResult.tmdb.id}/videos?api_key=${TMDB_KEY}&language=fr-FR`).then(r => r.json());
    const providers = await fetch(`${TMDB_BASE}/${type}/${shazamResult.tmdb.id}/watch/providers?api_key=${TMDB_KEY}`).then(r => r.json());
    const trailer = videos.results?.find(v => v.type === 'Trailer') || videos.results?.[0];
    const frProviders = providers.results?.FR;
    setDetail({ ...data, credits, trailer, frProviders });
  }
}}
          style={{ ...styles.searchBtn, marginTop: 12 }}>
          🎬 Voir la fiche complète
        </button>
      </div>
    )}
  </div>
)}        
      </div>

      {/* FILMS & SÉRIES */}
      {section === 'films' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🔍 Rechercher</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <button onClick={() => setSearchType('movie')}
                style={{ ...styles.typeBtn, ...(searchType === 'movie' ? styles.typeBtnActive : {}) }}>
                🎬 Film
              </button>
              <button onClick={() => setSearchType('tv')}
                style={{ ...styles.typeBtn, ...(searchType === 'tv' ? styles.typeBtnActive : {}) }}>
                📺 Série
              </button>
            </div>
            <input style={styles.input}
              placeholder={searchType === 'movie' ? 'Ex: Inception, Avatar...' : 'Ex: Breaking Bad, Game of Thrones...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && rechercher()} />
            <button style={styles.searchBtn} onClick={rechercher} disabled={loading}>
              {loading ? '⏳ Recherche...' : 'Rechercher 🔍'}
            </button>
          </div>

          {detail ? (
            <div>
              <button onClick={() => setDetail(null)} style={{ ...styles.backBtn, marginBottom: 12 }}>← Retour</button>
              
              {detail.poster_path && (
                <img src={`${TMDB_IMG}${detail.poster_path}`} alt={detail.title || detail.name}
                  style={{ width: '100%', borderRadius: 16, marginBottom: 16, objectFit: 'cover', maxHeight: 400 }} />
              )}

              <div style={styles.card}>
                <div style={{ color: 'white', fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
                  {detail.title || detail.name}
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                  {detail.vote_average && (
                    <span style={{ ...styles.badge, background: '#f39c12', color: 'white' }}>
                      ⭐ {detail.vote_average.toFixed(1)}/10
                    </span>
                  )}
                  {(detail.release_date || detail.first_air_date) && (
                    <span style={{ ...styles.badge, background: '#667eea', color: 'white' }}>
                      📅 {(detail.release_date || detail.first_air_date)?.substring(0, 4)}
                    </span>
                  )}
                  {detail.runtime && (
                    <span style={{ ...styles.badge, background: '#27ae60', color: 'white' }}>
                      ⏱ {detail.runtime} min
                    </span>
                  )}
                  {detail.genres?.slice(0, 2).map((g, i) => (
                    <span key={i} style={{ ...styles.badge, background: '#8965e0', color: 'white' }}>
                      {g.name}
                    </span>
                  ))}
                </div>
                {detail.overview && (
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.7 }}>
                    {detail.overview}
                  </p>
                )}
              </div>

              {/* ACTEURS */}
              {detail.credits?.cast && detail.credits.cast.length > 0 && (
                <div style={styles.card}>
                  <div style={styles.cardTitle}>🎭 Acteurs principaux</div>
                  <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
                    {detail.credits.cast.slice(0, 8).map((actor, i) => (
                      <div key={i} style={{ textAlign: 'center', minWidth: 70 }}>
                        {actor.profile_path ? (
                          <img src={`${TMDB_IMG}${actor.profile_path}`} alt={actor.name}
                            style={{ width: 60, height: 60, borderRadius: 30, objectFit: 'cover', marginBottom: 4 }} />
                        ) : (
                          <div style={{ width: 60, height: 60, borderRadius: 30, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 4 }}>👤</div>
                        )}
                        <div style={{ color: 'white', fontSize: 10, fontWeight: 600 }}>{actor.name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9 }}>{actor.character}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TRAILER */}
              {detail.trailer && (
                <div style={styles.card}>
                  <div style={styles.cardTitle}>▶️ Bande annonce</div>
                  <a href={`https://www.youtube.com/watch?v=${detail.trailer.key}`}
                    target="_blank" rel="noreferrer"
                    style={{ ...styles.searchBtn, display: 'block', textAlign: 'center', textDecoration: 'none', background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}>
                    ▶️ Voir sur YouTube
                  </a>
                </div>
              )}

              {/* OÙ REGARDER */}
              {detail.frProviders && (
                <div style={styles.card}>
                  <div style={styles.cardTitle}>📺 Où regarder en France</div>
                  {detail.frProviders.flatrate && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 6 }}>Inclus dans l'abonnement :</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {detail.frProviders.flatrate.map((p, i) => (
                          <span key={i} style={{ ...styles.badge, background: '#27ae60', color: 'white' }}>
                            {p.provider_name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {detail.frProviders.rent && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 6 }}>À louer :</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {detail.frProviders.rent.map((p, i) => (
                          <span key={i} style={{ ...styles.badge, background: '#f39c12', color: 'white' }}>
                            {p.provider_name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {detail.frProviders.buy && (
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 6 }}>À acheter :</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {detail.frProviders.buy.map((p, i) => (
                          <span key={i} style={{ ...styles.badge, background: '#e74c3c', color: 'white' }}>
                            {p.provider_name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {!detail.frProviders.flatrate && !detail.frProviders.rent && !detail.frProviders.buy && (
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Non disponible en streaming en France</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {results.map((r, i) => (
                <button key={i} onClick={() => voirDetail(r.id)} style={styles.resultBtn}>
                  {r.poster_path && (
                    <img src={`${TMDB_IMG}${r.poster_path}`} alt={r.title || r.name}
                      style={{ width: 50, height: 75, borderRadius: 8, objectFit: 'cover' }} />
                  )}
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                      {r.title || r.name}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {r.vote_average > 0 && (
                        <span style={{ ...styles.badge, background: '#f39c12', color: 'white', fontSize: 11 }}>
                          ⭐ {r.vote_average.toFixed(1)}
                        </span>
                      )}
                      {(r.release_date || r.first_air_date) && (
                        <span style={{ ...styles.badge, background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>
                          📅 {(r.release_date || r.first_air_date)?.substring(0, 4)}
                        </span>
                      )}
                    </div>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>›</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ACTEURS */}
      {section === 'acteurs' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🎭 Rechercher un acteur</div>
            <input style={styles.input}
              placeholder="Ex: Leonardo DiCaprio, Marion Cotillard..."
              value={actorSearch}
              onChange={e => setActorSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && rechercherActeur()} />
            <button style={styles.searchBtn} onClick={rechercherActeur} disabled={loading}>
              {loading ? '⏳ Recherche...' : 'Rechercher 🔍'}
            </button>
          </div>

          {actorResult && (
            <div>
              <div style={styles.card}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  {actorResult.profile_path && (
                    <img src={`${TMDB_IMG}${actorResult.profile_path}`} alt={actorResult.name}
                      style={{ width: 80, height: 110, borderRadius: 12, objectFit: 'cover' }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'white', fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
                      {actorResult.name}
                    </div>
                    {actorResult.known_for_department && (
                      <span style={{ ...styles.badge, background: '#8965e0', color: 'white' }}>
                        {actorResult.known_for_department}
                      </span>
                    )}
                    {actorResult.popularity && (
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 8 }}>
                        Popularité : {Math.round(actorResult.popularity)}
                      </div>
                    )}
                  </div>
                </div>
                {actorResult.biography && (
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.7, marginTop: 12 }}>
                    {actorResult.biography.substring(0, 300)}...
                  </p>
                )}
              </div>

              <div style={styles.card}>
                <div style={styles.cardTitle}>🎬 Filmographie</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {actorResult.credits?.cast
                    ?.sort((a, b) => (b.release_date || b.first_air_date || '') > (a.release_date || a.first_air_date || '') ? 1 : -1)
                    .slice(0, 15)
                    .map((film, i) => (
                      <div key={i} style={styles.filmographieItem}>
                        {film.poster_path && (
                          <img src={`${TMDB_IMG}${film.poster_path}`} alt={film.title || film.name}
                            style={{ width: 35, height: 50, borderRadius: 6, objectFit: 'cover' }} />
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>
                            {film.title || film.name}
                          </div>
                          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                            {film.character && `${film.character} · `}
                            {(film.release_date || film.first_air_date)?.substring(0, 4)}
                          </div>
                        </div>
                        {film.vote_average > 0 && (
                          <span style={{ ...styles.badge, background: '#f39c12', color: 'white', fontSize: 11 }}>
                            ⭐ {film.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CINÉMA */}
      {section === 'cinema' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🎞️ Sorties actuelles en France</div>
            <button style={styles.searchBtn} onClick={chargerCinema} disabled={loading}>
              {loading ? '⏳ Chargement...' : '🔄 Actualiser'}
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {cinema.map((film, i) => (
              <button key={i} onClick={() => { setSection('films'); setSearchType('movie'); voirDetail(film.id); }}
                style={styles.resultBtn}>
                {film.poster_path && (
                  <img src={`${TMDB_IMG}${film.poster_path}`} alt={film.title}
                    style={{ width: 50, height: 75, borderRadius: 8, objectFit: 'cover' }} />
                )}
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{film.title}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {film.vote_average > 0 && (
                      <span style={{ ...styles.badge, background: '#f39c12', color: 'white', fontSize: 11 }}>
                        ⭐ {film.vote_average.toFixed(1)}
                      </span>
                    )}
                    {film.release_date && (
                      <span style={{ ...styles.badge, background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>
                        📅 {film.release_date}
                      </span>
                    )}
                  </div>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>›</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MUSIQUE */}
      {section === 'musique' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🎵 Classements musicaux</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {['pop', 'rock', 'hip-hop', 'jazz', 'electronic', 'r&b', 'classical', 'french'].map(g => (
                <button key={g} onClick={() => setMusiqueGenre(g)}
                  style={{ ...styles.filtreBtn, ...(musiqueGenre === g ? styles.filtreBtnActive : {}) }}>
                  {g}
                </button>
              ))}
            </div>
            <button style={styles.searchBtn} onClick={rechercherMusique} disabled={musiqueLoading}>
              {musiqueLoading ? '⏳ Chargement...' : '🎵 Charger le classement'}
            </button>
          </div>

          <div style={{ marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16 }}>
            <div style={styles.cardTitle}>🎤 Rechercher un artiste</div>
            <input style={styles.input} placeholder="Ex: Beyoncé, Daft Punk, Jul..."
              value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && rechercherArtiste()} />
            <button style={styles.searchBtn} onClick={rechercherArtiste} disabled={loading}>
              {loading ? '⏳ Recherche...' : '🎤 Rechercher'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {musique.map((song, i) => (
              <div key={i} style={styles.songItem}>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 700, minWidth: 24 }}>
                  {i + 1}
                </div>
                {song.artworkUrl60 && (
                  <img src={song.artworkUrl60} alt={song.trackName}
                    style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{song.trackName}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{song.artistName}</div>
                </div>
                <a href={song.trackViewUrl} target="_blank" rel="noreferrer"
                  style={{ ...styles.badge, background: '#8965e0', color: 'white', textDecoration: 'none' }}>
                  iTunes
                </a>
              </div>
            ))}
          </div>

          {albums.length > 0 && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>💿 Discographie</div>
              {albums.map((album, i) => (
                <div key={i} style={{ ...styles.songItem, marginBottom: 8 }}>
                  {album.artworkUrl60 && (
                    <img src={album.artworkUrl60} alt={album.collectionName}
                      style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{album.collectionName}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
                      {album.artistName} · {album.releaseDate?.substring(0, 4)}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                      {album.trackCount} titres
                    </div>
                  </div>
                  <a href={album.collectionViewUrl} target="_blank" rel="noreferrer"
                    style={{ ...styles.badge, background: '#8965e0', color: 'white', textDecoration: 'none' }}>
                    iTunes
                  </a>
                </div>
              ))}
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
  searchBtn: { width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #8965e0, #6741d9)', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  navBtn: { padding: '10px 6px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 12, fontWeight: 600 },
  navBtnActive: { background: 'rgba(137,101,224,0.3)', color: '#8965e0', border: '1px solid #8965e0' },
  badge: { padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  typeBtn: { flex: 1, padding: '10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14 },
  typeBtnActive: { background: 'rgba(137,101,224,0.3)', color: '#8965e0', border: '1px solid #8965e0' },
  resultBtn: { display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '12px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', width: '100%' },
  filmographieItem: { display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '8px 12px' },
  songItem: { display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '10px 14px' },
  filtreBtn: { padding: '8px 12px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 12 },
  filtreBtnActive: { background: 'rgba(137,101,224,0.3)', color: '#8965e0', border: '1px solid #8965e0' },
};
