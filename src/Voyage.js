import { useState } from 'react';

const styles = {
  container: { padding: 16, maxWidth: 600, margin: '0 auto' },
  card: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 20, marginBottom: 16 },
  cardTitle: { color: 'white', fontWeight: 700, fontSize: 16, marginBottom: 16 },
  input: { width: '100%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '12px 14px', color: 'white', fontSize: 14, outline: 'none', marginBottom: 10, boxSizing: 'border-box' },
  select: { width: '100%', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '12px 14px', color: 'white', fontSize: 14, outline: 'none', marginBottom: 10, boxSizing: 'border-box' },
  searchBtn: { width: '100%', background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', borderRadius: 10, padding: '13px', color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 10 },
  result: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap' },
  disclaimer: { background: 'rgba(255,193,7,0.1)', border: '1px solid rgba(255,193,7,0.3)', borderRadius: 10, padding: 10, marginTop: 12 },
  backBtn: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14, marginBottom: 16, padding: 0 },

};


export default function Voyage({ onBack }) {

  const [budget, setBudget] = useState('');
  const [duree, setDuree] = useState('');
  const [depart, setDepart] = useState('');
  const [type, setType] = useState('plage');
  const [periode, setPeriode] = useState('');
  const [voyageurs, setVoyageurs] = useState('solo');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visaPays, setVisaPays] = useState('');
const [visaResult, setVisaResult] = useState(null);
const [visaLoading, setVisaLoading] = useState(false);


const verifierVisa = async () => {
  setVisaLoading(true);
  setVisaResult(null);
  try {
    const response = await fetch('https://assistants-app-production.up.railway.app/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: `Tu es exclusivement un expert en voyage international pour les citoyens français dans l'app MacAlfer.
IMPORTANT : Si la question n'est PAS liée au voyage, visa, vaccins ou sécurité à l'étranger, réponds : "Je suis l'assistant Voyage ✈️ Essayez un autre assistant MacAlfer plus adapté !"

Tu es un expert en voyage international.

Pour la destination : ${visaPays}

Donne les informations suivantes :

🛂 VISA
- Visa requis pour passeport français ? (oui/non/e-visa)
- Durée de séjour autorisée
- Coût et procédure si visa requis
- Délai d'obtention

💉 VACCINS
- Vaccins obligatoires
- Vaccins recommandés
- Médicaments préventifs (ex: antipaludéens)

🔒 SÉCURITÉ (niveau comme diplomatie.gouv.fr)
- Niveau : Normale / Vigilance renforcée / Déconseillé sauf raison impérative / Formellement déconseillé
- Zones à éviter si applicable
- Conseils de sécurité principaux

📞 CONTACTS UTILES
- Ambassade/Consulat de France
- Numéro d'urgence local

Sois précis et à jour avec les informations 2024-2025.`
        }]
      })
    });
    const data = await response.json();
    setVisaResult(data.content[0].text);
  } catch {
    setVisaResult('Erreur — vérifiez que le serveur tourne');
  }
  setVisaLoading(false);
};


  const chercherDestinations = async () => {
    if (!budget || !duree) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('https://assistants-app-production.up.railway.app/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Tu es exclusivement un expert en voyage et optimisation de budget dans l'app MacAlfer.
IMPORTANT : Si la question n'est PAS liée au voyage ou budget voyage, réponds : "Je suis l'assistant Voyage ✈️ Essayez un autre assistant MacAlfer plus adapté !"

Tu es un expert en voyage et optimisation de budget.

Un voyageur cherche des destinations avec ces critères :
- Budget total : ${budget}€ (tout inclus : vol, hébergement, repas, activités)
- Durée : ${duree} jours
- Ville de départ : ${depart || 'France'}
- Type de voyage : ${type}
- Période : ${periode || 'flexible'}
- Voyageurs : ${voyageurs}

Propose 4 destinations réalistes en détaillant pour chacune :
🌍 Destination + pays
✈️ Vol aller-retour estimé (prix moyen)
🏨 Hébergement/nuit (budget)
🍽️ Budget repas/jour
💰 Total estimé pour ${duree} jours
⭐ Point fort de cette destination
⚠️ À savoir (visa, santé, meilleure période)

Classe les destinations de la plus économique à la plus chère.
Sois précis avec des chiffres réalistes.
Termine avec un conseil personnalisé selon le profil.`
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

    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardTitle}>✈️ Optimiseur de voyage</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <input style={styles.input} placeholder="Budget total (ex: 1500)" value={budget} onChange={e => setBudget(e.target.value)} />
<input style={styles.input} placeholder="Durée (ex: 10 jours)" value={duree} onChange={e => setDuree(e.target.value)} />

        </div>

        <input style={styles.input} placeholder="Ville de départ (ex: Paris, Lyon...)" value={depart} onChange={e => setDepart(e.target.value)} />

        <select style={styles.select} value={type} onChange={e => setType(e.target.value)}>
          <option value="plage">🏖️ Plage & Soleil</option>
          <option value="culture">🏛️ Culture & Histoire</option>
          <option value="aventure">🏔️ Aventure & Nature</option>
          <option value="citytrip">🏙️ City-trip</option>
          <option value="gastronomie">🍷 Gastronomie</option>
          <option value="detente">🧘 Détente & Bien-être</option>
        </select>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <select style={styles.select} value={voyageurs} onChange={e => setVoyageurs(e.target.value)}>
            <option value="solo">👤 Solo</option>
            <option value="couple">👫 Couple</option>
            <option value="famille">👨‍👩‍👧 Famille</option>
            <option value="amis">👥 Groupe d'amis</option>
          </select>
          <input style={styles.input} placeholder="Période (ex: juillet, hiver...)" value={periode} onChange={e => setPeriode(e.target.value)} />
        </div>

        <button style={{ ...styles.searchBtn, opacity: (!budget || !duree || loading) ? 0.6 : 1 }}
          onClick={chercherDestinations}
          disabled={!budget || !duree || loading}>
          {loading ? '⏳ Recherche en cours...' : '🌍 Trouver mes destinations'}
        </button>
        </div>
      </div>
{/* VISA + VACCINS + SÉCURITÉ */}
<div style={styles.card}>
  <div style={styles.cardTitle}>🛂 Visa · Vaccins · Sécurité</div>
  <input style={styles.input} 
    placeholder="Destination (ex: Thaïlande, Brésil, Japon...)" 
    value={visaPays} 
    onChange={e => setVisaPays(e.target.value)} />
  <button style={{ ...styles.searchBtn, opacity: (!visaPays || visaLoading) ? 0.6 : 1 }}
    onClick={verifierVisa}
    disabled={!visaPays || visaLoading}>
    {visaLoading ? '⏳ Vérification...' : '🔍 Vérifier'}
  </button>
  {visaResult && (
    <div>
      <div style={styles.result}>{visaResult}</div>
      <div style={styles.disclaimer}>
        <p style={{ color: '#ffc107', fontSize: 11, margin: 0 }}>
          ⚠️ Informations indicatives — vérifiez sur diplomatie.gouv.fr avant votre départ.
        </p>
      </div>
    </div>
  )}
</div>



      {result && (
        <div style={styles.card}>
          <div style={styles.cardTitle}>🎯 Destinations recommandées</div>
          <div style={styles.result}>{result}</div>
          <div style={styles.disclaimer}>
            <p style={{ color: '#ffc107', fontSize: 11, margin: 0 }}>
              ⚠️ Prix indicatifs basés sur les moyennes du marché. Vérifiez sur Skyscanner, Booking.com et Google Flights pour les prix en temps réel.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
