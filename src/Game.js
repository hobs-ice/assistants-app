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

  useEffect(() => {
    if (section === 'actu') chargerJeux();
  }, [section]);

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
          messages: [{
            role: 'user',
            content: `Tu es un expert gaming et esports. Réponds à cette question :

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
            <div style={styles.cardTitle}>🔍 Rechercher un jeu</div>
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
                Aucun jeu trouvé — essaie sur Google :
              </p>
              <a href={`https://www.google.com/search?q=${encodeURIComponent(searchJeu)}+jeu+video`}
                target="_blank" rel="noreferrer"
                style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', display: 'block' }}>
                🔵 Rechercher sur Google
              </a>
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