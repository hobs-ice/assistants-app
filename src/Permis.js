import { useState } from 'react';

const SERVER = 'https://assistants-app-production.up.railway.app';

const styles = {
  container: { padding: 16, maxWidth: 600, margin: '0 auto' },
  card: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 20, marginBottom: 16 },
  cardTitle: { color: 'white', fontWeight: 700, fontSize: 16, marginBottom: 16 },
  input: { width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '12px 14px', color: 'white', fontSize: 14, outline: 'none', marginBottom: 10, boxSizing: 'border-box' },
  searchBtn: { width: '100%', background: 'linear-gradient(135deg, #2196f3, #1565c0)', border: 'none', borderRadius: 10, padding: '13px', color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 10 },
  navBtn: { padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 11, fontWeight: 600 },
  navBtnActive: { background: '#2196f3', color: 'white', border: '1px solid #2196f3' },
  result: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap' },
  backBtn: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14, marginBottom: 16, padding: 0 },
  select: { width: '100%', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '12px 14px', color: 'white', fontSize: 14, outline: 'none', marginBottom: 10, boxSizing: 'border-box' },
};

export default function Permis({ onBack }) {
  const [section, setSection] = useState('conseils');
  const [typePermis, setTypePermis] = useState('B');
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [ville, setVille] = useState('');
  const [manoeuvre, setManoeuvre] = useState('creneau');

  const askIA = async (prompt) => {
    setLoading(true);
    setResult('');
    try {
      const response = await fetch(`${SERVER}/api/claude`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Tu es exclusivement un expert du permis de conduire français dans l'app MacAlfer.
IMPORTANT : Si la question n'est PAS liée au permis de conduire, réponds uniquement : "Je suis l'assistant Permis 🚗 Essayez un autre assistant MacAlfer plus adapté !"

${prompt}`
          }]
        })
      });
      const data = await response.json();
      setResult(data.content[0].text);
    } catch {
      setResult('Erreur — vérifiez que le serveur tourne');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backBtn}>← Retour</button>

      <div style={{ background: 'linear-gradient(135deg, #2196f3, #1565c0)', borderRadius: 16, padding: 20, marginBottom: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🚗</div>
        <div style={{ color: 'white', fontWeight: 800, fontSize: 20 }}>Assistant Permis</div>
        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Code, manœuvres, auto-écoles et conseils</div>
      </div>

      {/* NAVIGATION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
        {[
          { id: 'conseils', label: '💡 Conseils IA' },
          { id: 'manoeuvres', label: '🔄 Manœuvres' },
          { id: 'autoecole', label: '🏫 Auto-école' },
          { id: 'types', label: '📋 Types de permis' },
        ].map(s => (
          <button key={s.id} onClick={() => { setSection(s.id); setResult(''); }}
            style={{ ...styles.navBtn, ...(section === s.id ? styles.navBtnActive : {}), fontSize: 11 }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* CONSEILS IA */}
      {section === 'conseils' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>💡 Conseils et révision</div>
            <select style={styles.select} value={typePermis} onChange={e => setTypePermis(e.target.value)}>
              <option value="B">🚗 Permis B (voiture)</option>
              <option value="A">🏍️ Permis A (moto)</option>
              <option value="A1">🛵 Permis A1 (125cc)</option>
              <option value="A2">🏍️ Permis A2</option>
              <option value="C">🚛 Permis C (poids lourd)</option>
              <option value="BE">🚐 Permis BE (remorque)</option>
              <option value="bateau">⛵ Permis bateau (permis côtier)</option>
            </select>
            <input style={styles.input} placeholder="Votre question (ex: comment réussir le créneau ?)"
              value={question} onChange={e => setQuestion(e.target.value)} />
            <button style={styles.searchBtn} disabled={loading || !question}
              onClick={() => askIA(`Permis ${typePermis} — Question : ${question}\n\nDonne des conseils pratiques, clairs et adaptés au permis ${typePermis}.`)}>
              {loading ? '⏳ Réponse en cours...' : '💡 Obtenir des conseils'}
            </button>
          </div>
          {result && <div style={styles.card}><div style={styles.result}>{result}</div></div>}
        </div>
      )}

      {/* MANŒUVRES */}
      {section === 'manoeuvres' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🔄 Guide des manœuvres</div>
            <select style={styles.select} value={manoeuvre} onChange={e => setManoeuvre(e.target.value)}>
              <option value="creneau">🅿️ Créneau</option>
              <option value="bataille">🔄 Bataille</option>
              <option value="demi-tour">↩️ Demi-tour</option>
              <option value="marche arriere">⬅️ Marche arrière</option>
              <option value="depassement">🚗 Dépassement</option>
              <option value="priorite">⚠️ Priorités</option>
              <option value="rond-point">🔵 Rond-point</option>
            </select>
            <button style={styles.searchBtn} disabled={loading}
              onClick={() => askIA(`Explique-moi étape par étape comment réussir la manœuvre : ${manoeuvre}\n\nDonne des astuces pratiques, les erreurs à éviter et les points clés pour l'examinateur.`)}>
              {loading ? '⏳ Chargement...' : '🔄 Voir le guide'}
            </button>
          </div>
          {result && <div style={styles.card}><div style={styles.result}>{result}</div></div>}
        </div>
      )}

      {/* AUTO-ÉCOLE */}
      {section === 'autoecole' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🏫 Trouver une auto-école</div>
            <input style={styles.input} placeholder="Votre ville (ex: Paris, Lyon...)"
              value={ville} onChange={e => setVille(e.target.value)} />
            <select style={styles.select} value={typePermis} onChange={e => setTypePermis(e.target.value)}>
              <option value="B">🚗 Permis B</option>
              <option value="A">🏍️ Permis moto</option>
              <option value="C">🚛 Permis poids lourd</option>
              <option value="bateau">⛵ Permis bateau</option>
            </select>
            <button style={styles.searchBtn} disabled={loading || !ville}
              onClick={() => askIA(`Je cherche une auto-école pour le permis ${typePermis} à ${ville}.\n\nDonne-moi :\n1. Les critères pour choisir une bonne auto-école\n2. Les questions à poser avant de s'inscrire\n3. Le prix moyen du permis ${typePermis} en France\n4. Les labels de qualité à rechercher (qualité auto-école, etc.)\n5. Les alternatives en ligne (permis accéléré, code en ligne...)`)}>
              {loading ? '⏳ Recherche...' : '🏫 Obtenir des conseils'}
            </button>
            <div style={{ marginTop: 12 }}>
              <a href={`https://www.google.com/maps/search/auto-école+${encodeURIComponent(ville || 'Paris')}`}
                target="_blank" rel="noreferrer"
                style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', display: 'block', background: 'linear-gradient(135deg, #4285f4, #1a73e8)' }}>
                🗺️ Voir sur Google Maps
              </a>
            </div>
          </div>
          {result && <div style={styles.card}><div style={styles.result}>{result}</div></div>}
        </div>
      )}

      {/* TYPES DE PERMIS */}
      {section === 'types' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>📋 Types de permis</div>
            <select style={styles.select} value={typePermis} onChange={e => setTypePermis(e.target.value)}>
              <option value="B">🚗 Permis B (voiture)</option>
              <option value="A">🏍️ Permis A (moto)</option>
              <option value="A1">🛵 Permis A1 (125cc)</option>
              <option value="A2">🏍️ Permis A2</option>
              <option value="C">🚛 Permis C (poids lourd)</option>
              <option value="CE">🚛 Permis CE (semi-remorque)</option>
              <option value="BE">🚐 Permis BE (remorque)</option>
              <option value="bateau">⛵ Permis bateau côtier</option>
              <option value="fluvial">🚤 Permis fluvial</option>
            </select>
            <button style={styles.searchBtn} disabled={loading}
              onClick={() => askIA(`Explique-moi tout sur le permis ${typePermis} en France :\n1. Les conditions d'accès (âge, prérequis)\n2. Les étapes pour l'obtenir\n3. Le coût moyen\n4. La durée de formation\n5. Ce qu'il permet de conduire\n6. Les spécificités et astuces`)}>
              {loading ? '⏳ Chargement...' : '📋 En savoir plus'}
            </button>
          </div>
          {result && <div style={styles.card}><div style={styles.result}>{result}</div></div>}
        </div>
      )}
    </div>
  );
}
