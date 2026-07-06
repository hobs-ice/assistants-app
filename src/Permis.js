import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';



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
  const [panneauImage, setPanneauImage] = useState(null);
const [panneauResult, setPanneauResult] = useState('');
const [panneauLoading, setPanneauLoading] = useState(false);
const [quizQuestion, setQuizQuestion] = useState(null);
const [quizReponse, setQuizReponse] = useState('');
const [quizLoading, setQuizLoading] = useState(false);
const [quizScore, setQuizScore] = useState(0);
const [quizTotal, setQuizTotal] = useState(0);



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

const scannerPanneau = async () => {
  if (!panneauImage) return;
  setPanneauLoading(true);
  setPanneauResult('');
  try {
    const res = await fetch('https://ywtngdmvlfgoptwdejje.supabase.co/functions/v1/analyze-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageData: panneauImage.data,
        mediaType: panneauImage.type,
        prompt: `Tu es un expert du code de la route français.
IMPORTANT : Si l'image ne montre PAS un panneau de signalisation routière, réponds UNIQUEMENT : "❌ Cette image ne contient pas de panneau de signalisation. Veuillez photographier un panneau routier."

Si c'est bien un panneau, analyse et donne :
1. 🚦 Nom officiel du panneau
2. 📝 Signification exacte
3. ⚖️ Obligation légale (que doit faire le conducteur ?)
4. ⚠️ Sanctions en cas de non-respect
5. 💡 Astuce pour le mémoriser`
      })
    });
    const data = await res.json();
    setPanneauResult(data.text || 'Impossible d\'analyser');
  } catch {
    setPanneauResult('Erreur — réessayez');
  }
  setPanneauLoading(false);
};

const genererQuestion = async () => {
  setQuizLoading(true);
  setQuizReponse('');
  setQuizQuestion(null);
  try {
    const response = await fetch(`${SERVER}/api/claude`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: `Génère une question ${quizScore >= 10 ? 'DIFFICILE et piégeuse' : quizScore >= 5 ? 'de niveau intermédiaire' : 'de niveau débutant'} de code de la route français sur un thème aléatoire (priorités, panneaux, distances, vitesses, stationnement, feux, alcool, équipements, autoroute, nuit, pluie, giratoires, dépassements...).
${quizScore >= 10 ? 'Les questions doivent être subtiles avec des détails précis (distances exactes, exceptions aux règles, cas particuliers...)' : ''}
Réponds UNIQUEMENT en JSON avec ce format exact :
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

const verifierReponse = (reponse) => {
  setQuizReponse(reponse);
  setQuizTotal(t => t + 1);
  if (reponse[0] === quizQuestion.bonne_reponse) {
    setQuizScore(s => s + 1);
  }
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
          { id: 'panneau', label: '📸 Scanner panneau' },
          { id: 'quiz', label: '🎯 Quiz code' },

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

      {/* SCANNER PANNEAU */}
{section === 'panneau' && (
  <div>
    <div style={styles.card}>
      <div style={styles.cardTitle}>📸 Scanner un panneau</div>
      <div style={{ ...styles.result, marginBottom: 12, fontSize: 12 }}>
        📷 Prenez en photo un panneau de signalisation — l'IA l'identifie et explique sa signification !
      </div>
      <input type="file" accept="image/*" capture="environment" onChange={async e => {
        const file = e.target.files[0];
        if (!file) return;
        const canvas = document.createElement('canvas');
        const img = new Image();
        img.onload = () => {
          const MAX = 400;
          let w = img.width, h = img.height;
          if (w > MAX) { h = h * MAX / w; w = MAX; }
          if (h > MAX) { w = w * MAX / h; h = MAX; }
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          const base64 = canvas.toDataURL('image/jpeg', 0.3).split(',')[1];
          setPanneauImage({ data: base64, type: 'image/jpeg' });
        };
        img.src = URL.createObjectURL(file);
      }} style={{ color: 'white', marginBottom: 12, fontSize: 13 }} />
      {panneauImage && (
        <button style={styles.searchBtn} onClick={scannerPanneau} disabled={panneauLoading}>
          {panneauLoading ? '⏳ Analyse en cours...' : '🚦 Identifier le panneau'}
        </button>
      )}
    </div>
    {panneauResult && (
      <div style={styles.card}>
        <div style={styles.cardTitle}>🚦 Panneau identifié</div>
        <div style={{ color: 'white', fontSize: 13, lineHeight: 1.7 }}>
  <div className="panneau-result" style={{ color: 'white', fontSize: 13, lineHeight: 1.7 }}>
  <ReactMarkdown remarkPlugins={[remarkGfm]}>{panneauResult}</ReactMarkdown>
</div>

</div>



      </div>
    )}
  </div>
)}

{/* QUIZ */}
{section === 'quiz' && (
  <div>
    <div style={styles.card}>
      <div style={styles.cardTitle}>🎯 Quiz Code de la Route</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ color: 'white', fontSize: 13 }}>Score : {quizScore}/{quizTotal}</span>
        <button onClick={() => { setQuizScore(0); setQuizTotal(0); setQuizQuestion(null); setQuizReponse(''); }}
          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, padding: '4px 10px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 11 }}>
          Réinitialiser
        </button>
      </div>
      <button style={styles.searchBtn} onClick={genererQuestion} disabled={quizLoading}>
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
            <button key={i} onClick={() => !quizReponse && verifierReponse(r)}
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

    <style>{`
  .panneau-result table { width: 100%; border-collapse: collapse; margin: 8px 0; }
  .panneau-result td, .panneau-result th { border: 1px solid rgba(255,255,255,0.2); padding: 6px 8px; font-size: 12px; }
  .panneau-result th { background: rgba(33,150,243,0.3); }
  .panneau-result h2 { font-size: 15px; color: #2196f3; margin: 12px 0 6px; }
  .panneau-result p { margin: 6px 0; }
  .panneau-result ul { padding-left: 16px; }
`}</style>

  </div>
)}

    </div>
  );
}
