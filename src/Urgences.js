import React, { useState } from 'react';

const numerosUrgence = [
  { numero: '15', label: 'SAMU', desc: 'Urgences médicales', color: '#e74c3c', emoji: '🏥' },
  { numero: '18', label: 'Pompiers', desc: 'Incendie / Secours', color: '#e67e22', emoji: '🚒' },
  { numero: '17', label: 'Police', desc: 'Urgences police', color: '#2980b9', emoji: '🚔' },
  { numero: '112', label: 'Urgences EU', desc: 'Numéro européen universel', color: '#8e44ad', emoji: '🆘' },
  { numero: '15', label: 'SMUR', desc: 'Urgences psychiatriques', color: '#16a085', emoji: '🧠' },
  { numero: '3114', label: 'Suicide', desc: 'Prévention suicide 24h/24', color: '#27ae60', emoji: '💚' },
  { numero: '3237', label: 'Pharmacie garde', desc: 'Pharmacie de garde', color: '#f39c12', emoji: '💊' },
  { numero: '116 117', label: 'Médecin garde', desc: 'Médecin de garde 24h/24', color: '#16a085', emoji: '👨‍⚕️' },
  { numero: '0800 800 322', label: 'Anti-poison', desc: 'Centre anti-poison', color: '#c0392b', emoji: '☠️' },
];

const premiersSecours = [
  {
    id: 'arretCardiaque',
    emoji: '❤️',
    titre: 'Arrêt cardiaque',
    urgence: '🔴 EXTRÊME',
    couleur: '#e74c3c',
    etapes: [
      '1️⃣ Appelez le 15 ou 112 immédiatement',
      '2️⃣ Allongez la victime sur le dos sur surface dure',
      '3️⃣ Commencez le massage cardiaque : 30 compressions au centre de la poitrine',
      '4️⃣ Appuyez fort et vite — 5-6 cm de profondeur, 100-120/min',
      '5️⃣ Alternez 30 compressions / 2 insufflations si formé',
      '6️⃣ Utilisez un défibrillateur dès disponible',
      '7️⃣ Continuez jusqu\'à l\'arrivée des secours',
    ],
  },
  {
    id: 'avc',
    emoji: '🧠',
    titre: 'AVC — Accident Vasculaire Cérébral',
    urgence: '🔴 EXTRÊME',
    couleur: '#e74c3c',
    etapes: [
      '1️⃣ Testez avec FAST : Face-Arm-Speech-Time',
      '2️⃣ F — Visage : sourire asymétrique ?',
      '3️⃣ A — Bras : un bras tombe ?',
      '4️⃣ S — Speech : parole difficile ?',
      '5️⃣ T — Time : appelez le 15 immédiatement !',
      '6️⃣ Ne donnez rien à manger ou boire',
      '7️⃣ Ne laissez pas seul, notez l\'heure des premiers symptômes',
    ],
  },
  {
    id: 'etouffement',
    emoji: '😮',
    titre: 'Étouffement / Obstruction',
    urgence: '🔴 URGENT',
    couleur: '#e67e22',
    etapes: [
      '1️⃣ Si la personne tousse fort → encouragez à tousser',
      '2️⃣ Si elle ne peut plus tousser → 5 claques dans le dos entre les omoplates',
      '3️⃣ Si inefficace → Heimlich : mains jointes sous le sternum, poussées vers le haut',
      '4️⃣ Alternez 5 claques dos / 5 compressions abdominales',
      '5️⃣ Si perte de conscience → appelez le 15 et commencez RCP',
      '6️⃣ Nourrisson : 5 claques dos face vers le bas, 5 pressions thoraciques',
    ],
  },
  {
    id: 'brulure',
    emoji: '🔥',
    titre: 'Brûlure',
    urgence: '🟠 URGENT',
    couleur: '#e67e22',
    etapes: [
      '1️⃣ Refroidir immédiatement sous eau froide 15-20°C pendant 15 min minimum',
      '2️⃣ Ne PAS utiliser glace, beurre, dentifrice ou crème',
      '3️⃣ Retirer bijoux et vêtements non collés',
      '4️⃣ Couvrir avec linge propre et humide',
      '5️⃣ Brûlure étendue ou profonde → appelez le 15',
      '6️⃣ Brûlure chimique → rincer abondamment 20 min et appelez le 15',
    ],
  },
  {
    id: 'hemorragie',
    emoji: '🩸',
    titre: 'Hémorragie / Saignement',
    urgence: '🟠 URGENT',
    couleur: '#e67e22',
    etapes: [
      '1️⃣ Appelez le 15 si saignement abondant',
      '2️⃣ Appuyez fortement sur la plaie avec tissu propre',
      '3️⃣ Maintenez la pression sans relâcher',
      '4️⃣ Surélevez le membre blessé si possible',
      '5️⃣ Ne retirez pas l\'objet planté dans la plaie',
      '6️⃣ Garrot en dernier recours si membre sectionné — notez l\'heure',
    ],
  },
  {
    id: 'fracture',
    emoji: '🦴',
    titre: 'Fracture / Traumatisme',
    urgence: '🟡 IMPORTANT',
    couleur: '#f39c12',
    etapes: [
      '1️⃣ Ne bougez pas la victime sauf danger immédiat',
      '2️⃣ Immobilisez le membre dans la position trouvée',
      '3️⃣ Appelez le 15 ou 18',
      '4️⃣ Appliquez de la glace enveloppée dans un tissu',
      '5️⃣ Surveillez la circulation : couleur, chaleur, sensibilité',
      '6️⃣ Fracture colonne vertébrale → ne bougez absolument pas',
    ],
  },
  {
    id: 'malaise',
    emoji: '😵',
    titre: 'Malaise / Perte de connaissance',
    urgence: '🟠 URGENT',
    couleur: '#e67e22',
    etapes: [
      '1️⃣ Allongez la personne sur le dos',
      '2️⃣ Vérifiez la respiration et le pouls',
      '3️⃣ Si respiration normale → Position Latérale de Sécurité (PLS)',
      '4️⃣ PLS : bras tendu, jambe pliée, tête inclinée en arrière',
      '5️⃣ Appelez le 15',
      '6️⃣ Si pas de respiration → commencez RCP immédiatement',
    ],
  },
  {
    id: 'allergie',
    emoji: '🤧',
    titre: 'Choc anaphylactique / Allergie grave',
    urgence: '🔴 EXTRÊME',
    couleur: '#e74c3c',
    etapes: [
      '1️⃣ Appelez le 15 immédiatement',
      '2️⃣ Si disponible → injectez l\'Épipen (adrénaline) dans la cuisse externe',
      '3️⃣ Allongez la personne jambes surélevées',
      '4️⃣ Si difficultés respiratoires → position semi-assise',
      '5️⃣ Ne laissez pas seul',
      '6️⃣ Une 2ème injection peut être nécessaire après 5-15 min',
    ],
  },
];

const symptomesGraves = [
  { emoji: '💔', symptome: 'Douleur thoracique intense', action: 'Appelez le 15 — suspicion infarctus', urgence: '🔴' },
  { emoji: '🧠', symptome: 'Maux de tête brutaux violents', action: 'Appelez le 15 — suspicion AVC / hémorragie', urgence: '🔴' },
  { emoji: '😤', symptome: 'Difficultés respiratoires sévères', action: 'Appelez le 15 immédiatement', urgence: '🔴' },
  { emoji: '😵', symptome: 'Perte de connaissance', action: 'Appelez le 15 — PLS si respiration', urgence: '🔴' },
  { emoji: '🤢', symptome: 'Vomissements de sang', action: 'Appelez le 15 — hémorragie digestive', urgence: '🔴' },
  { emoji: '🦵', symptome: 'Paralysie soudaine d\'un membre', action: 'Appelez le 15 — suspicion AVC', urgence: '🔴' },
  { emoji: '👁️', symptome: 'Perte de vision soudaine', action: 'Appelez le 15 — urgence ophtalmologique', urgence: '🔴' },
  { emoji: '🌡️', symptome: 'Fièvre > 40°C', action: 'Appelez le 15 si nourrisson ou convulsions', urgence: '🟠' },
  { emoji: '🤕', symptome: 'Traumatisme crânien avec perte de conscience', action: 'Appelez le 15 — ne bougez pas', urgence: '🔴' },
  { emoji: '💊', symptome: 'Intoxication / Ingestion produit toxique', action: 'Appelez le 0800 800 322 (anti-poison)', urgence: '🔴' },
];

const numerosInternational = [
  { pays: '🇺🇸 USA / Canada', numero: '911', desc: 'Urgences générales', color: '#e74c3c' },
  { pays: '🇺🇸 USA', numero: '988', desc: 'Suicide & Crisis Lifeline', color: '#27ae60' },
  { pays: '🇺🇸 USA', numero: '1-800-222-1222', desc: 'Poison Help 24h/24', color: '#e67e22' },
  { pays: '🇬🇧 UK', numero: '999', desc: 'Urgences générales', color: '#2980b9' },
  { pays: '🇪🇺 Europe', numero: '112', desc: 'Numéro européen universel', color: '#8e44ad' },
  { pays: '🇧🇪 Belgique', numero: '100', desc: 'Urgences médicales', color: '#e74c3c' },
  { pays: '🇨🇭 Suisse', numero: '144', desc: 'Urgences médicales', color: '#e74c3c' },
];


export default function Urgences({ onBack, isPremium }) {

  const [section, setSection] = useState('accueil');
  const [selectedGeste, setSelectedGeste] = useState(null);

  return (
    <div style={{ padding: '10px' }}>
      <button onClick={onBack} style={styles.backBtn}>← Retour</button>

      {/* HEADER */}
      <div style={{ ...styles.header, background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}>
        <div style={{ fontSize: 48 }}>🚨</div>
        <h2 style={styles.headerTitle}>Assistant Urgences</h2>
        <p style={styles.headerSub}>Premiers secours · Numéros utiles · Gestes qui sauvent</p>
      </div>

      {/* BOUTONS APPEL RAPIDE */}
      {!isPremium && (
  <div style={{ background: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: 8, padding: 16, marginBottom: 12, textAlign: 'center' }}>
    <div style={{ fontSize: 9, color: '#444', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>Publicité</div>
    <div style={{ fontSize: 13, color: '#888' }}>🚀 Espace publicitaire disponible</div>
    <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>Premium → sans publicité</div>
  </div>
)}

      <div style={styles.card}>
        <div style={styles.cardTitle}>📞 Appel rapide</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {numerosUrgence.slice(0, 4).map((n, i) => (
            <a key={i} href={`tel:${n.numero}`}
              style={{ ...styles.callBtn, background: n.color }}>
              <span style={{ fontSize: 24 }}>{n.emoji}</span>
              <span style={{ fontSize: 22, fontWeight: 900 }}>{n.numero}</span>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{n.label}</span>
              <span style={{ fontSize: 11, opacity: 0.85 }}>{n.desc}</span>
            </a>
          ))}
        </div>
      </div>

      {/* NUMÉROS SECONDAIRES */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>📋 Autres numéros utiles</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {numerosUrgence.slice(4).map((n, i) => (
            <a key={i} href={`tel:${n.numero}`}
              style={styles.secondaryBtn}>
              <span>{n.emoji} {n.label}</span>
              <span style={{ fontWeight: 700, color: n.color }}>{n.numero}</span>
              <span style={{ opacity: 0.6, fontSize: 12 }}>{n.desc}</span>
            </a>
          ))}
        </div>
      </div>

      {/* LOCALISATION */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>📍 Localisation rapide</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <a href="https://www.google.com/maps/search/pharmacie+de+garde"
            target="_blank" rel="noreferrer"
            style={{ ...styles.locBtn, background: 'linear-gradient(135deg, #f39c12, #e67e22)' }}>
            💊 Pharmacie de garde
          </a>
          <button
  onClick={(e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          window.location.href = `https://openaedmap.org/en/#map=15/${lat}/${lng}`;
        },
        () => {
          window.location.href = 'https://openaedmap.org';
        }
      );
    } else {
      window.location.href = 'https://openaedmap.org';
    }
  }}
  style={{ ...styles.locBtn, background: 'linear-gradient(135deg, #e74c3c, #c0392b)', border: 'none', cursor: 'pointer' }}>
  💓 Défibrillateur proche
</button>
          
          <a href="https://www.google.com/maps/search/urgences+hôpital"
            target="_blank" rel="noreferrer"
            style={{ ...styles.locBtn, background: 'linear-gradient(135deg, #2980b9, #1a5276)' }}>
            🏥 Urgences hôpital
          </a>
          <a href="https://www.google.com/maps/search/médecin+de+garde"
            target="_blank" rel="noreferrer"
            style={{ ...styles.locBtn, background: 'linear-gradient(135deg, #27ae60, #1e8449)' }}>
            👨‍⚕️ Médecin de garde
          </a>
        </div>
      </div>

      {/* NAVIGATION SECTIONS */}
    
<div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
  {['premiers secours', 'symptômes graves', 'international'].map((s, i) => (
    <button key={i} onClick={() => setSection(s)}
      style={{
        ...styles.navBtn,
        ...(section === s ? styles.navBtnActive : {}),
        fontSize: 11,
      }}>
      {i === 0 ? '🩺 Premiers secours' : i === 1 ? '⚠️ Symptômes' : '🌍 International'}
    </button>
  ))}
</div>

      {/* PREMIERS SECOURS */}
      {section === 'premiers secours' && (
        <div>
          {selectedGeste ? (
            <div style={styles.card}>
              <button onClick={() => setSelectedGeste(null)}
                style={{ ...styles.backBtn, marginBottom: 16 }}>
                ← Retour
              </button>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{selectedGeste.emoji}</div>
              <div style={{ color: 'white', fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
                {selectedGeste.titre}
              </div>
              <span style={{
                ...styles.urgenceBadge,
                background: selectedGeste.couleur,
              }}>
                {selectedGeste.urgence}
              </span>
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedGeste.etapes.map((etape, i) => (
                  <div key={i} style={styles.etapeBox}>
                    <p style={{ color: '#333', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                      {etape}
                    </p>
                  </div>
                ))}
              </div>
              <a href="tel:15" style={{ ...styles.locBtn, background: 'linear-gradient(135deg, #e74c3c, #c0392b)', marginTop: 16, textAlign: 'center' }}>
                📞 Appeler le 15 maintenant
              </a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {premiersSecours.map((g, i) => (
                <button key={i} onClick={() => setSelectedGeste(g)}
                  style={styles.gesteBtn}>
                  <span style={{ fontSize: 28 }}>{g.emoji}</span>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>{g.titre}</div>
                    <span style={{ ...styles.urgenceBadge, background: g.couleur, fontSize: 11 }}>
                      {g.urgence}
                    </span>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>›</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SYMPTÔMES GRAVES */}
      {section === 'symptômes graves' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {symptomesGraves.map((s, i) => (
            <div key={i} style={styles.symptomeBox}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 24 }}>{s.emoji}</span>
                <span style={{ color: 'white', fontWeight: 700, fontSize: 14, flex: 1 }}>{s.symptome}</span>
                <span style={{ fontSize: 18 }}>{s.urgence}</span>
              </div>
              <div style={styles.actionBox}>
                <p style={{ color: '#333', fontSize: 13, margin: 0 }}>👉 {s.action}</p>
              </div>
            </div>
          ))}
        </div>
      )}

{/* INTERNATIONAL */}
{section === 'international' && (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    {numerosInternational.map((n, i) => (
      <a key={i} href={`tel:${n.numero}`}
        style={styles.secondaryBtn}>
        <span style={{ fontSize: 16 }}>{n.pays}</span>
        <span style={{ fontWeight: 700, color: n.color, fontSize: 16 }}>{n.numero}</span>
        <span style={{ opacity: 0.6, fontSize: 12 }}>{n.desc}</span>
      </a>
    ))}
  </div>
)}

      {/* AVERTISSEMENT */}
      <div style={{ ...styles.card, background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.2)', marginTop: 16 }}>
        <p style={{ color: '#e74c3c', fontSize: 13, textAlign: 'center', lineHeight: 1.6 }}>
          🚨 <strong>En cas d'urgence vitale</strong><br />
          Appelez toujours le 15 ou le 112 en premier.<br />
          Ces informations ne remplacent pas une formation aux premiers secours.
        </p>
      </div>
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
  callBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 10px',
    borderRadius: 14,
    color: 'white',
    textDecoration: 'none',
    gap: 4,
    textAlign: 'center',
  },
  secondaryBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: '12px 16px',
    color: 'white',
    textDecoration: 'none',
    fontSize: 14,
    gap: 10,
  },
  locBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 10px',
    borderRadius: 12,
    color: 'white',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 700,
    textAlign: 'center',
    gap: 6,
  },
  navBtn: {
    flex: 1,
    padding: '12px',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
  },
  navBtnActive: {
    background: 'rgba(231,76,60,0.3)',
    color: 'white',
    border: '1px solid #e74c3c',
  },
  gesteBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    padding: '16px',
    border: '1px solid rgba(255,255,255,0.1)',
    cursor: 'pointer',
    width: '100%',
  },
  urgenceBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    color: 'white',
    marginTop: 4,
  },
  etapeBox: {
    background: 'white',
    borderRadius: 10,
    padding: '12px 16px',
  },
  symptomeBox: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    padding: '16px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  actionBox: {
    background: 'white',
    borderRadius: 8,
    padding: '10px 14px',
  },
};
