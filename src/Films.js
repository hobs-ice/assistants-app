import React, { useState } from 'react';


const TMDB_KEY = process.env.REACT_APP_TMDB_KEY || 'ta_cle_ici';
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
        `https://itunes.apple.com/search?term=${encodeURIComponent(musiqueGenre)}&media=music&entity=song&limit=20&country=fr`
      );
      const data = await res.json();
      setMusique(data.results || []);
    } catch {}
    setMusiqueLoading(false);
  };

  const shazamFilm = async () => {
  if (!shazamDesc.trim()) return;
  setShazamLoading(true);
  setShazamResult(null);
  try {
    const response = await fetch('http://localhost:3002/api/claude', {
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
          { id: 'shazam', label: '🔮 Trouver' },
        ].map(s => (
          <button key={s.id} onClick={() => { setSection(s.id); if (s.id === 'cinema') chargerCinema(); }}
            style={{ ...styles.navBtn, ...(section === s.id ? styles.navBtnActive : {}), fontSize: 11 }}>
            {s.label}
          </button>
        ))}

{/* SHAZAM FILM */}
{section === 'shazam' && (
  <div>
    <div style={styles.card}>
      <div style={styles.cardTitle}>🔮 Retrouver un film / série</div>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 12, lineHeight: 1.6 }}>
        Décrivez ce dont vous vous souvenez — scène, acteur, ambiance, histoire... et l'IA retrouve le film !
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
          onClick={() => {
            if (shazamResult.tmdb) {
              setSection('films');
              setSearchType(shazamResult.type === 'film' ? 'movie' : 'tv');
              voirDetail(shazamResult.tmdb.id);
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
