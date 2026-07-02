import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';




const posologies = {
  doliprane: {
    enfant: ['📏 Dose : 15mg/kg toutes les 6h', '🕐 Max : 4 prises/jour', '💧 Forme : Sirop ou suppositoire', '⏱ Durée max : 3 jours sans avis'],
    adulte: ['📏 Dose : 1000mg par prise', '🕐 Max : 3g/jour soit 3 prises', '💊 Forme : Comprimé ou effervescent', '⏱ Intervalle minimum : 6h', '⏱ Durée max : 5 jours sans avis'],
  },
  dafalgan: {
    enfant: ['📏 Dose : 15mg/kg toutes les 6h', '🕐 Max : 4 prises/jour', '💧 Forme : Sirop ou suppositoire', '⏱ Durée max : 3 jours sans avis'],
    adulte: ['📏 Dose : 1000mg par prise', '🕐 Max : 3g/jour soit 3 prises', '💊 Forme : Comprimé ou effervescent', '⏱ Intervalle minimum : 6h'],
  },
  efferalgan: {
    enfant: ['📏 Dose : 15mg/kg toutes les 6h', '🕐 Max : 4 prises/jour', '💧 Forme : Sirop ou suppositoire'],
    adulte: ['📏 Dose : 1000mg par prise', '🕐 Max : 3g/jour', '💊 Forme : Comprimé effervescent', '⏱ Intervalle minimum : 6h'],
  },
  ibuprofene: {
    enfant: ['📏 Dose : 20-30mg/kg/jour en 3 prises', '🕐 Max : 3 prises/jour', '💧 Forme : Sirop pédiatrique', '⏱ Durée max : 3 jours sans avis'],
    adulte: ['📏 Dose : 400mg par prise', '🕐 Max : 1200mg/jour soit 3 prises', '💊 Forme : Comprimé pelliculé', '🍽 Toujours prendre pendant un repas', '⏱ Intervalle minimum : 6h'],
  },
  advil: {
    enfant: ['📏 Dose : 20-30mg/kg/jour en 3 prises', '💧 Forme : Sirop pédiatrique', '⏱ Durée max : 3 jours sans avis'],
    adulte: ['📏 Dose : 400mg par prise', '🕐 Max : 1200mg/jour', '🍽 Toujours prendre pendant un repas'],
  },
  nurofen: {
    enfant: ['📏 Dose : 20-30mg/kg/jour', '💧 Forme : Sirop pédiatrique', '⏱ Durée max : 3 jours'],
    adulte: ['📏 Dose : 400mg par prise', '🕐 Max : 1200mg/jour', '🍽 Prendre pendant un repas'],
  },
  aspirine: {
    enfant: ['⛔ Contre-indiqué moins de 16 ans', '⚠️ Risque de syndrome de Reye'],
    adulte: ['📏 Dose : 500mg à 1g par prise', '🕐 Max : 3g/jour', '💊 Forme : Comprimé ou effervescent', '⏱ Intervalle minimum : 4h', '🍽 Prendre pendant les repas'],
  },
  smecta: {
    enfant: ['📏 Moins de 1 an : 1 sachet/jour', '📏 1-2 ans : 1-2 sachets/jour', '📏 Plus de 2 ans : 2-3 sachets/jour', '💧 Diluer dans 50ml d\'eau'],
    adulte: ['📏 Dose : 1 sachet 3 fois/jour', '💧 Diluer dans un verre d\'eau', '⏱ Entre les repas de préférence', '⏱ Durée max : 7 jours'],
  },
  toplexil: {
    enfant: ['📏 6-15 ans : 5ml 3x/jour', '⛔ Interdit moins de 6 ans', '😴 Peut provoquer somnolence'],
    adulte: ['📏 Dose : 15ml 3x/jour', '🕐 Max : 4 prises/jour', '😴 Peut provoquer somnolence'],
  },
  strepsils: {
    enfant: ['📏 1 pastille toutes les 2-3h', '🕐 Max : 8 pastilles/jour', '⛔ Déconseillé moins de 6 ans'],
    adulte: ['📏 1 pastille toutes les 2-3h', '🕐 Max : 8 pastilles/jour', '💊 Laisser fondre en bouche', '⏱ Durée max : 5 jours'],
  },
  gaviscon: {
    enfant: ['👨‍⚕️ Consulter un médecin pour le dosage'],
    adulte: ['📏 Dose : 2-4 comprimés ou 10-20ml', '🕐 Max : 4 prises/jour', '🍽 Après les repas et au coucher', '⏱ Durée max : 7 jours'],
  },
  imodium: {
    enfant: ['⛔ Déconseillé moins de 8 ans', '👨‍⚕️ Consulter un médecin'],
    adulte: ['📏 Dose initiale : 2 gélules 4mg', '📏 Puis 1 gélule après chaque selle', '🕐 Max : 8 gélules/jour', '⏱ Durée max : 2 jours'],
  },
  spasfon: {
    enfant: ['👨‍⚕️ Consulter un médecin pour le dosage'],
    adulte: ['📏 Dose : 2 comprimés 3 fois/jour', '🕐 Max : 6 comprimés/jour', '⏱ Durée max : 5 jours'],
  },
  aerius: {
    enfant: ['👨‍⚕️ Consulter un médecin pour le dosage'],
    adulte: ['📏 Dose : 1 comprimé/jour', '🕐 1 seule prise par jour', '💊 De préférence le soir'],
  },
  zyrtec: {
    enfant: ['📏 6-12 ans : 5mg/jour', '💊 De préférence le soir'],
    adulte: ['📏 Dose : 10mg/jour', '🕐 1 seule prise par jour', '💊 De préférence le soir'],
  },
  voltaren: {
    enfant: ['⛔ Déconseillé moins de 14 ans'],
    adulte: ['📏 Appliquer 2 à 4g de gel', '🕐 3 à 4 applications/jour', '🖐 Masser jusqu\'absorption', '⛔ Ne pas appliquer sur plaie', '⏱ Durée max : 14 jours'],
  },
  rhinadvil: {
    enfant: ['⛔ Déconseillé moins de 15 ans'],
    adulte: ['📏 1 comprimé toutes les 6h', '🕐 Max : 4 comprimés/jour', '⏱ Durée max : 5 jours'],
  },
  actifed: {
    enfant: ['⛔ Déconseillé moins de 15 ans'],
    adulte: ['📏 1 comprimé toutes les 6h', '🕐 Max : 4 comprimés/jour', '😴 Peut provoquer somnolence', '⏱ Durée max : 5 jours'],
  },
  magnesium: {
    enfant: ['👨‍⚕️ Consulter un médecin pour le dosage'],
    adulte: ['📏 Dose : 300-400mg/jour', '🍽 Pendant les repas', '⏱ Cure recommandée : 1 mois'],
  },
  vitaminec: {
    enfant: ['📏 Dose : 50-100mg/jour', '💧 Forme effervescente ou sirop'],
    adulte: ['📏 Dose : 500mg à 1g/jour', '💊 Forme comprimé ou effervescent', '⏱ Cure recommandée : 1 mois'],
  },
};



const alertes = {
  ibuprofene: ['⚠️ Toujours prendre avec nourriture', '⚠️ Éviter si ulcère ou grossesse', '⚠️ Ne pas combiner avec Aspirine'],
  advil: ['⚠️ Toujours prendre avec nourriture', '⚠️ Éviter si ulcère ou grossesse'],
  nurofen: ['⚠️ Toujours prendre avec nourriture', '⚠️ Éviter si ulcère ou grossesse'],
  doliprane: ['⚠️ Ne pas dépasser 3g/jour adulte', '⚠️ Vérifier paracétamol dans autres médicaments', '⚠️ Éviter avec alcool'],
  dafalgan: ['⚠️ Ne pas dépasser 3g/jour adulte', '⚠️ Vérifier paracétamol dans autres médicaments'],
  efferalgan: ['⚠️ Ne pas dépasser 3g/jour adulte', '⚠️ Vérifier paracétamol dans autres médicaments'],
  aspirine: ['⚠️ Contre-indiqué enfant moins de 16 ans', '⚠️ Risque de saignement', '⚠️ Éviter si allergie aux AINS'],
  toplexil: ['⚠️ Peut provoquer somnolence', '⚠️ Ne pas conduire après prise'],
  actifed: ['⚠️ Peut provoquer somnolence', '⚠️ Ne pas conduire après prise'],
  imodium: ['⚠️ Ne pas utiliser si fièvre', '⚠️ Consulter si pas d\'amélioration après 48h'],
};

const HISTORY_KEY = 'med_history';

const getHistory = () => {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
  catch { return []; }
};

const addToHistory = (nom) => {
  const h = getHistory().filter(x => x.nom !== nom);
  h.unshift({ nom, date: new Date().toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, 10)));
};

export default function Medicaments({ onBack, isPremium }) {

  const [search, setSearch] = useState('');
  const [profile, setProfile] = useState('adulte');
  const [ville, setVille] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [symptom, setSymptom] = useState('');
  const [medImage, setMedImage] = useState(null);
const [medImageResult, setMedImageResult] = useState('');
const [medImageLoading, setMedImageLoading] = useState(false);

  

  useEffect(() => { setHistory(getHistory()); }, []);

  const normalize = (str) =>
    str.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '');

  const handleSearch = async (searchTerm) => {
  const term = searchTerm || search;
  if (!term.trim()) return;
  setLoading(true);
  setResult(null);

  try {
    // 1. API BDPM France
    const resBdpm = await fetch(
      `https://medicaments-api.giygas.dev/v1/medicaments?search=${encodeURIComponent(term)}`
    );
    const dataBdpm = await resBdpm.json();

    if (!dataBdpm || dataBdpm.length === 0) {
      setResult('notfound');
      setLoading(false);
      return;
    }

    // 2. Récupérer substance active depuis BDPM
    const substances = dataBdpm[0].composition
      ? dataBdpm[0].composition
          .filter(c => c.natureComposant === 'SA')
          .map(c =>
            c.denominationSubstance
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .split(' ')[0]
          )
      : [];

    // 3. OpenFDA - indications via substance active
    let fda = null;
    if (substances.length > 0) {
      try {
        const query = substances
          .map(s => `openfda.generic_name:${s}`)
          .join('+OR+');
        const resFda = await fetch(
          `https://api.fda.gov/drug/label.json?search=${query}&limit=1`
        );
        const dataFda = await resFda.json();
        if (dataFda.results && dataFda.results.length > 0) {
          fda = dataFda.results[0];
        }
      } catch { fda = null; }
    }

    // 4. Wikipedia
    const nomMed = dataBdpm[0].elementPharmaceutique || term;
    let wiki = null;
    try {
      const resWiki = await fetch(
        `https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(nomMed)}`
      );
      const dataWiki = await resWiki.json();
      wiki = dataWiki.extract || null;
    } catch { wiki = null; }

    setResult({ bdpm: dataBdpm, fda, wiki });
    addToHistory(nomMed);
    setHistory(getHistory());

  } catch {
    setResult('notfound');
  }
  setLoading(false);
};

  
  const villeEncoded = encodeURIComponent(ville);
  const reconnaitreMedicament = async () => {
  if (!medImage) return;
  setMedImageLoading(true);
  setMedImageResult('');
  try {
    const res = await fetch('https://ywtngdmvlfgoptwdejje.supabase.co/functions/v1/analyze-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageData: medImage.data,
        mediaType: medImage.type,
        prompt: `Tu es un pharmacien expert UNIQUEMENT. 
IMPORTANT : Si l'image ne montre PAS un médicament (boîte, comprimé, notice, flacon...), réponds UNIQUEMENT cette phrase exacte sans rien ajouter : "❌ Cette image ne contient pas de médicament. Veuillez photographier une boîte, des comprimés ou une notice. Pour identifier autre chose, utilisez l'assistant approprié dans Macaifer."

1. 💊 Identifie le médicament (nom commercial et DCI)
2. 📝 Explique à quoi il sert
3. 💉 Donne la posologie habituelle
4. ⚠️ Indique les contre-indications principales
5. 🔄 Cite les interactions médicamenteuses importantes
6. ⚡ Donne les effets secondaires courants

IMPORTANT : Rappelle toujours de consulter un médecin ou pharmacien.`
      })
    });
    const data = await res.json();
    setMedImageResult(data.text || 'Impossible d\'analyser');
  } catch (err) {
    setMedImageResult('Erreur — réessayez');
  }
  setMedImageLoading(false);
};


  return (
    <div style={{ padding: '10px' }}>
      <button onClick={onBack} style={styles.backBtn}>← Retour</button>

      <div style={styles.header}>
        <div style={{ fontSize: 48 }}>💊</div>
        <h2 style={styles.headerTitle}>Assistant Médicaments</h2>
        <p style={styles.headerSub}>Posologie, recommandations et pharmacies</p>
      </div>

{/* INDICATIONS FDA */}

{result && result !== 'notfound' && result.fda && (
  <div style={styles.card}>
    <div style={styles.cardTitle}>💡 Indications et usage</div>
    {result.fda.purpose && (
      <div style={{
        ...styles.badge,
        background: 'linear-gradient(135deg, #2dce89, #26af74)',
        color: 'white',
        marginBottom: 12,
        display: 'block',
        textAlign: 'center',
        fontSize: 14,
        padding: '10px 16px',
      }}>
        🎯 {result.fda.purpose[0]}
      </div>
    )}
    {result.fda.indications_and_usage && (
      <div style={{ ...styles.infoBox, background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)' }}>
        <p style={{ fontSize: 13, color: '#333', lineHeight: 1.8 }}>
          {result.fda.indications_and_usage[0].length > 400
            ? result.fda.indications_and_usage[0].substring(0, 400) + '...'
            : result.fda.indications_and_usage[0]
          }
        </p>
      </div>
    )}
    {result.fda.warnings && (
      <div style={{ ...styles.infoBox, background: 'linear-gradient(135deg, #fff8e1, #fff3e0)', marginTop: 10 }}>
        <div style={{ fontSize: 12, color: '#f57c00', fontWeight: 700, marginBottom: 6 }}>
          ⚠️ WARNINGS
        </div>
        <p style={{ fontSize: 12, color: '#555', lineHeight: 1.7 }}>
          {result.fda.warnings[0].length > 300
            ? result.fda.warnings[0].substring(0, 300) + '...'
            : result.fda.warnings[0]
          }
        </p>
      </div>
    )}
    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 8, textAlign: 'center' }}>
      Source : FDA américaine — données en anglais
    </div>
  </div>
)}

{/* RECONNAISSANCE MÉDICAMENT */}
<div style={styles.card}>
  <div style={styles.cardTitle}>📸 Reconnaître un médicament</div>
  <div style={{ ...styles.infoBox, marginBottom: 12 }}>
    <p style={{ fontSize: 12, color: '#555', margin: 0 }}>
      📷 Prenez en photo un médicament — l'IA l'identifie et vous donne toutes les informations !
    </p>
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
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      const base64 = canvas.toDataURL('image/jpeg', 0.3).split(',')[1];
      setMedImage({ data: base64, type: 'image/jpeg' });
    };
    img.src = URL.createObjectURL(file);
  }} style={{ color: 'white', marginBottom: 12, fontSize: 13 }} />

  {medImage && (
    <button style={styles.searchBtn} onClick={reconnaitreMedicament} disabled={medImageLoading}>
      {medImageLoading ? '⏳ Analyse en cours...' : '💊 Identifier le médicament'}
    </button>
  )}
</div>

{medImageResult && (
  <div style={styles.card}>
    <div style={styles.cardTitle}>💊 Médicament identifié</div>
    <div style={{ ...styles.infoBox, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8, color: '#333' }}>
      <ReactMarkdown>{medImageResult}</ReactMarkdown>

    </div>
    <div style={{ marginTop: 12, background: 'rgba(243,156,18,0.1)', border: '1px solid rgba(243,156,18,0.3)', borderRadius: 10, padding: 12 }}>
      <p style={{ color: '#f39c12', fontSize: 12, margin: 0 }}>
        ⚠️ Ces informations sont indicatives. Consultez toujours un médecin ou pharmacien.
      </p>
    </div>
  </div>
)}


      {/* RECHERCHE */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>🔍 Rechercher un médicament</div>
        <input
          style={styles.input}
          placeholder="Nom du médicament (ex: doliprane)"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <div style={styles.row}>
          <button
            style={{ ...styles.profileBtn, ...(profile === 'adulte' ? styles.profileBtnActive : {}) }}
            onClick={() => setProfile('adulte')}>👤 Adulte</button>
          <button
            style={{ ...styles.profileBtn, ...(profile === 'enfant' ? styles.profileBtnActive : {}) }}
            onClick={() => setProfile('enfant')}>👶 Enfant</button>
        </div>
        <input
          style={styles.input}
          placeholder="Votre ville (ex: Paris)"
          value={ville}
          onChange={e => setVille(e.target.value)}
        />
        <button style={styles.searchBtn} onClick={() => handleSearch()} disabled={loading}>
          {loading ? '⏳ Chargement...' : 'Rechercher 🔍'}
        </button>

        <div style={{ marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16 }}>
          <div style={styles.cardTitle}>💬 Trouver un médicament pour...</div>
          <input
            style={styles.input}
            placeholder="ex: soigner la toux, mal de tête, allergie..."
            value={symptom}
            onChange={e => setSymptom(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && symptom && window.open(`https://www.vidal.fr/recherche/?q=${encodeURIComponent(symptom)}&type=indication`, '_blank')}
          />
          <button
            style={{ ...styles.searchBtn, background: 'linear-gradient(135deg, #11cdef, #1171ef)' }}
            onClick={() => symptom && window.open(`https://www.google.com/search?q=médicaments+${encodeURIComponent(symptom)}+site:vidal.fr`, '_blank')}
            disabled={!symptom}>
            🔎 Trouver sur Vidal
          </button>
        </div>
      </div>

      {/* HISTORIQUE */}
      {history.length > 0 && !result && (
        <div style={styles.card}>
          <div style={styles.cardTitle}>🕘 Recherches récentes</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {history.map((h, i) => (
              <button key={i} onClick={() => { setSearch(h.nom); handleSearch(h.nom); }}
                style={styles.historyBtn}>
                💊 {h.nom} <span style={{ opacity: 0.6, fontSize: 11 }}>{h.date}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* NON TROUVÉ */}
      {result && result !== 'notfound' && (
  <>
    <div style={styles.card}>
  <div style={styles.medName}>💊 {result.bdpm[0].elementPharmaceutique}</div>
  <div style={styles.badgeRow}>
    <span style={{ ...styles.badge, background: '#e8f5e9', color: '#388e3c' }}>
      💊 {result.bdpm[0].formePharmaceutique || 'Médicament'}
    </span>
    <span style={{ ...styles.badge, background: '#e8f0fe', color: '#4285f4' }}>
      👤 {profile === 'adulte' ? 'Adulte' : 'Enfant'}
    </span>
    {ville && (
      <span style={{ ...styles.badge, background: '#e8f0fe', color: '#4285f4' }}>
        📍 {ville}
      </span>
    )}
    {result.bdpm[0].statusAutorisation && (
      <span style={{ ...styles.badge, background: '#e8f5e9', color: '#388e3c' }}>
        ✅ {result.bdpm[0].statusAutorisation}
      </span>
    )}
    {result.bdpm[0].etatComercialisation && (
      <span style={{ ...styles.badge, background: '#fff3e0', color: '#f57c00' }}>
        🏪 {result.bdpm[0].etatComercialisation}
      </span>
    )}
  </div>

  {/* COMPOSITION */}
  {result.bdpm[0].composition && result.bdpm[0].composition.length > 0 && (
    <div style={{ marginTop: 14 }}>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 6 }}>
        🧪 COMPOSITION
      </div>
      {result.bdpm[0].composition.map((c, i) => (
        <div key={i} style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 8,
          padding: '8px 12px',
          marginBottom: 4,
          fontSize: 13,
          color: 'rgba(255,255,255,0.8)',
        }}>
          {c.denominationSubstance} — {c.dosage}
        </div>
      ))}
    </div>
  )}

  {/* PRIX & REMBOURSEMENT */}
  {result.bdpm[0].presentation && result.bdpm[0].presentation.length > 0 && (
    <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {result.bdpm[0].presentation[0].prix > 0 && (
        <span style={{ ...styles.badge, background: '#e8f5e9', color: '#388e3c' }}>
          💰 Prix : {result.bdpm[0].presentation[0].prix}€
        </span>
      )}
      {result.bdpm[0].presentation[0].tauxRemboursement && (
        <span style={{ ...styles.badge, background: '#e8f0fe', color: '#4285f4' }}>
          🏥 Remboursement : {result.bdpm[0].presentation[0].tauxRemboursement}
        </span>
      )}
      {result.bdpm[0].voiesAdministration && (
        <span style={{ ...styles.badge, background: '#fff3e0', color: '#f57c00' }}>
          💊 Voie : {result.bdpm[0].voiesAdministration[0]}
        </span>
      )}
    </div>
  )}

  {/* CONDITIONS */}
  {result.bdpm[0].conditions && result.bdpm[0].conditions.length > 0 && (
    <div style={{ marginTop: 14 }}>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 6 }}>
        📋 CONDITIONS DE PRESCRIPTION
      </div>
      {result.bdpm[0].conditions.map((c, i) => (
        <div key={i} style={{
          background: 'rgba(245,54,92,0.08)',
          border: '1px solid rgba(245,54,92,0.2)',
          borderRadius: 8,
          padding: '8px 12px',
          marginBottom: 4,
          fontSize: 13,
          color: '#f5365c',
        }}>
          ⚠️ {c}
        </div>
      ))}
    </div>
  )}

  {/* BOUTON INDICATIONS */}
  <a
    href={`https://www.google.com/search?q=${encodeURIComponent(result.bdpm[0].elementPharmaceutique)}+indications+usage+site:vidal.fr`}
    target="_blank" rel="noreferrer"
    style={{ ...styles.deliverBtn, background: 'linear-gradient(135deg, #2dce89, #26af74)', marginTop: 14 }}>
    💡 Indications et usage sur Vidal
  </a>
</div>

    {/* RÉSULTATS BDPM */}
    {result.bdpm.length > 1 && (
      <div style={styles.card}>
        <div style={styles.cardTitle}>📦 {result.bdpm.length} présentations trouvées</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {result.bdpm.slice(0, 5).map((med, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 10,
              padding: '10px 14px',
              fontSize: 13,
              color: 'rgba(255,255,255,0.8)',
            }}>
              💊 {med.elementPharmaceutique}
              {med.formePharmaceutique && (
                <span style={{ opacity: 0.6, marginLeft: 8 }}>{med.formePharmaceutique}</span>
              )}
            </div>
          ))}
          {result.bdpm.length > 5 && (
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, textAlign: 'center' }}>
              + {result.bdpm.length - 5} autres présentations
            </div>
          )}
        </div>
      </div>
    )}

    {/* WIKIPEDIA */}
    {result.wiki && (
      <div style={styles.card}>
        <div style={styles.cardTitle}>📖 Wikipedia</div>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.7 }}>
          {result.wiki}
        </p>
      </div>
    )}

    {/* FICHE VIDAL */}
    <div style={styles.card}>
      <div style={styles.cardTitle}>📋 Fiche complète Vidal</div>
      <a
        href={`https://www.google.com/search?q=${encodeURIComponent(result.bdpm[0].elementPharmaceutique)}+site:vidal.fr`}
        target="_blank" rel="noreferrer"
        style={{ ...styles.deliverBtn, background: 'linear-gradient(135deg, #e74c3c, #c0392b)', marginBottom: 8 }}>
        📋 Voir fiche Vidal complète
      </a>
      <a
        href={`https://www.google.com/search?q=${encodeURIComponent(result.bdpm[0].elementPharmaceutique)}+interactions+médicamenteuses+site:vidal.fr`}
        target="_blank" rel="noreferrer"
        style={{ ...styles.deliverBtn, background: 'linear-gradient(135deg, #e67e22, #d35400)' }}>
        ⚡ Interactions médicamenteuses
      </a>
    </div>

    {/* POSOLOGIE LOCALE si dispo */}
    {posologies[normalize(search)] && (
      <div style={styles.card}>
        <div style={styles.cardTitle}>💊 Posologie</div>
        <div style={{ ...styles.infoBox, background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)' }}>
          {(posologies[normalize(search)][profile] || posologies[normalize(search)].adulte).map((line, i) => (
            <div key={i} style={styles.infoLine}>{line}</div>
          ))}
        </div>
      </div>
    )}

    {/* ALERTES LOCALES si dispo */}
    {alertes[normalize(search)] && (
      <div style={styles.card}>
        <div style={styles.cardTitle}>⚠️ Alertes</div>
        <div style={{ ...styles.infoBox, background: 'linear-gradient(135deg, #fff8e1, #fff3e0)' }}>
          {alertes[normalize(search)].map((line, i) => (
            <div key={i} style={styles.infoLine}>{line}</div>
          ))}
        </div>
      </div>
    )}

    {/* ACHETER */}
    <div style={styles.card}>
      <div style={styles.cardTitle}>🛒 Trouver / Acheter</div>
      <div style={styles.linksGrid}>
        <a href={`https://www.google.com/search?q=${encodeURIComponent(result.bdpm[0].elementPharmaceutique)}+pharmacie+${villeEncoded}+disponible`}
          target="_blank" rel="noreferrer"
          style={{ ...styles.linkBtn, background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
          🏪 Pharmacie locale
        </a>
        <a href={`https://www.google.com/maps/search/pharmacie+${villeEncoded}`}
          target="_blank" rel="noreferrer"
          style={{ ...styles.linkBtn, background: 'linear-gradient(135deg, #4285f4, #0f9d58)' }}>
          🗺 Carte
        </a>
        <a href={`https://www.amazon.fr/s?k=${encodeURIComponent(result.bdpm[0].elementPharmaceutique)}`}
          target="_blank" rel="noreferrer"
          style={{ ...styles.linkBtn, background: 'linear-gradient(135deg, #ff9900, #ff6600)' }}>
          📦 Amazon
        </a>
      </div>
      <a href={`https://www.amazon.fr/s?k=${encodeURIComponent(result.bdpm[0].elementPharmaceutique)}&i=hpc`}
        target="_blank" rel="noreferrer"
        style={styles.deliverBtn}>
        🚚 Se faire livrer à domicile
      </a>
    </div>

    {/* AVERTISSEMENT */}
    <div style={{ ...styles.card, background: 'rgba(245,54,92,0.08)', border: '1px solid rgba(245,54,92,0.2)' }}>
      <p style={{ color: '#f5365c', fontSize: 13, textAlign: 'center', lineHeight: 1.6 }}>
        ⚕️ <strong>Avertissement médical</strong><br />
        Ces informations sont indicatives et ne remplacent pas un avis médical.<br />
        Consultez toujours un pharmacien ou médecin avant toute prise de médicament.
      </p>
    </div>
  </>
)}
    </div>
  );
}

const styles = {
  backBtn: {
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: 14,
    marginBottom: 20,
  },
  header: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    borderRadius: 20,
    padding: 30,
    textAlign: 'center',
    marginBottom: 20,
  },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 700, margin: '10px 0 6px' },
  headerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  card: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    backdropFilter: 'blur(10px)',
  },
  cardTitle: { color: 'white', fontSize: 16, fontWeight: 700, marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 8 },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    fontSize: 15,
    marginBottom: 12,
    outline: 'none',
  },
  row: { display: 'flex', gap: 10, marginBottom: 12 },
  profileBtn: {
    flex: 1,
    padding: '10px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
    fontSize: 14,
  },
  profileBtnActive: {
    background: 'rgba(102,126,234,0.4)',
    color: 'white',
    border: '1px solid #667eea',
  },
  searchBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: 12,
    border: 'none',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
  },
  medName: { color: 'white', fontSize: 26, fontWeight: 800, marginBottom: 12 },
  badgeRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  badge: { padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  infoBox: {
    background: 'linear-gradient(135deg, #f8f9ff, #f3e8ff)',
    borderRadius: 12,
    padding: 16,
  },
  infoLine: { fontSize: 14, color: '#333', lineHeight: 2 },
  linksGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 },
  linkBtn: {
    display: 'block',
    color: 'white',
    textDecoration: 'none',
    padding: '12px 8px',
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 600,
    textAlign: 'center',
  },
  deliverBtn: {
    display: 'block',
    background: 'linear-gradient(135deg, #11cdef, #1171ef)',
    color: 'white',
    textDecoration: 'none',
    padding: '14px',
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 700,
    textAlign: 'center',
    marginTop: 4,
  },
  historyBtn: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'white',
    padding: '8px 14px',
    borderRadius: 20,
    cursor: 'pointer',
    fontSize: 13,
    display: 'flex',
    gap: 6,
    alignItems: 'center',
  },
};
