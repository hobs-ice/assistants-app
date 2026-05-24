import html2canvas from 'html2canvas';
import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';

const secteurs = [
  { id: 'tech', label: '💻 Tech / IT', conseils: ['Mettez en avant vos projets GitHub', 'Certifications cloud très valorisées (AWS, GCP)', 'Salaire négociable +20% si vous avez des offres concurrentes', 'LinkedIn est indispensable dans ce secteur'] },
  { id: 'sante', label: '🏥 Santé', conseils: ['Diplômes et certifications obligatoires à mentionner', 'Expériences terrain très valorisées', 'Mobilité géographique = avantage majeur', 'Syndicats forts — renseignez-vous sur les conventions'] },
  { id: 'finance', label: '💰 Finance', conseils: ['CFA, ACCA, expertise comptable très recherchés', 'Chiffres et résultats concrets dans le CV', 'Réseau = clé dans ce secteur', 'Bonus négociable séparément du salaire fixe'] },
  { id: 'marketing', label: '📣 Marketing', conseils: ['Portfolio de campagnes indispensable', 'Maîtrise des outils (Google Ads, Meta, HubSpot)', 'Personal branding sur LinkedIn crucial', 'KPIs et ROI à mettre en avant'] },
  { id: 'rh', label: '👥 RH', conseils: ['GPEC, SIRH, droit social à mentionner', 'Soft skills très valorisés', 'Expérience diversité et inclusion = plus', 'Master RH ou école de commerce appréciés'] },
  { id: 'commerce', label: '🛒 Commerce / Vente', conseils: ['Chiffre d\'affaires réalisé à mentionner', 'Permis B souvent requis', 'Objectifs dépassés = argument clé', 'CRM (Salesforce, HubSpot) = avantage'] },
  { id: 'btp', label: '🏗️ BTP', conseils: ['CACES et habilitations à jour', 'Expérience chantier terrain valorisée', 'Normes sécurité indispensables', 'Mobilité géographique appréciée'] },
  { id: 'education', label: '🎓 Éducation', conseils: ['CAPES, agrégation, master enseignement', 'Expériences périscolaires valorisées', 'Langues étrangères = avantage', 'Numérique éducatif de plus en plus demandé'] },
];

const niveauxExperience = [
  { id: 'stage', label: 'Stage', desc: 'Moins de 6 mois' },
  { id: 'junior', label: 'Junior', desc: '0-2 ans' },
  { id: 'confirme', label: 'Confirmé', desc: '2-5 ans' },
  { id: 'senior', label: 'Senior', desc: '5-10 ans' },
  { id: 'expert', label: 'Expert', desc: '10+ ans' },
];

const questionsEntretien = {
  generales: [
    { q: 'Parlez-moi de vous', r: 'Structurez en 3 parties : formation → expériences → pourquoi ce poste. Restez concis (2-3 min max).' },
    { q: 'Pourquoi voulez-vous ce poste ?', r: 'Montrez que vous connaissez l\'entreprise. Liez vos compétences aux besoins du poste.' },
    { q: 'Quelles sont vos forces ?', r: 'Citez 3 forces avec des exemples concrets. Choisissez celles qui correspondent au poste.' },
    { q: 'Quelles sont vos faiblesses ?', r: 'Choisissez une vraie faiblesse mais montrez comment vous la travaillez. Ex: "je suis perfectionniste mais j\'apprends à déléguer".' },
    { q: 'Où vous voyez-vous dans 5 ans ?', r: 'Montrez de l\'ambition alignée avec l\'entreprise. Évitez "à votre place" ou "ailleurs".' },
    { q: 'Pourquoi quittez-vous votre poste actuel ?', r: 'Restez positif. Parlez d\'évolution, de nouveaux défis. Jamais de critiques de l\'ancien employeur.' },
  ],
  negociation: [
    { q: 'Quelles sont vos prétentions salariales ?', r: 'Donnez une fourchette basée sur le marché. Annoncez toujours un peu plus haut pour avoir de la marge.' },
    { q: 'Notre offre vous convient-elle ?', r: 'Ne répondez pas immédiatement. Demandez un délai de réflexion de 24-48h. Négociez les avantages si le salaire est fixe.' },
    { q: 'Avez-vous d\'autres offres en cours ?', r: 'Si oui, mentionnez-le sans détails. Ça crée une urgence positive pour le recruteur.' },
  ],
};

export default function Emploi({ onBack }) {
  const [section, setSection] = useState('offres');
  const [metier, setMetier] = useState('');
  const [ville, setVille] = useState('');
  
  
  
  const [secteurSelec, setSecteurSelec] = useState(null);
  
 const [categorieEntretien, setCategorieEntretien] = useState('generales');
const [negoActif, setNegoActif] = useState(false);
const [negoPoste, setNegoPoste] = useState('');
const [negoSalaire, setNegoSalaire] = useState('');
const [negoCible, setNegoCible] = useState('');
const [negoMessages, setNegoMessages] = useState([]);
const [negoInput, setNegoInput] = useState('');
const [negoLoading, setNegoLoading] = useState(false);
const [simulateurActif, setSimulateurActif] = useState(false);
const [simulateurPoste, setSimulateurPoste] = useState('');
const [simulateurQuestions, setSimulateurQuestions] = useState([]);
const [simulateurReponses, setSimulateurReponses] = useState({});
const [simulateurFeedback, setSimulateurFeedback] = useState({});
const [simulateurEtape, setSimulateurEtape] = useState(0);
const [simulateurLoading, setSimulateurLoading] = useState(false);

  // Lettre motivation
  const [offreTexte, setOffreTexte] = useState('');
  const [nomPrenom, setNomPrenom] = useState('');
  const [competences, setCompetences] = useState('');
  const [lettreGeneree, setLettreGeneree] = useState('');
  const [lettreLoading, setLettreLoading] = useState(false);

  // CV
  const [cvNom, setCvNom] = useState('');
  const [cvPoste, setCvPoste] = useState('');
  const [cvExperiences, setCvExperiences] = useState('');
  const [cvFormation, setCvFormation] = useState('');
  const [cvCompetences, setCvCompetences] = useState('');
  const [cvGenere, setCvGenere] = useState(false);

const [cvEmail, setCvEmail] = useState('');
const [cvTel, setCvTel] = useState('');
const [cvLinkedin, setCvLinkedin] = useState('');
const [cvVille, setCvVille] = useState('');
const [cvResume, setCvResume] = useState('');
const [cvAutres, setCvAutres] = useState('');
const [cvPhoto, setCvPhoto] = useState(null);
const cvRef = useRef(null);

  // Salaire
  const [salairePoste, setSalairePoste] = useState('');
  const [salaireVille, setSalaireVille] = useState('');
  const [salaireExp, setSalaireExp] = useState('junior');
  const [salaireLoading, setSalaireLoading] = useState(false);
  const [salaireResult, setSalaireResult] = useState(null);

  

  const genererLettre = async () => {
  if (!offreTexte.trim() || !nomPrenom.trim()) return;
  setLettreLoading(true);
  setLettreGeneree('');
  try {
    const response = await fetch('https://assistants-app-production.up.railway.app/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: `Tu es un expert en recrutement. Génère une lettre de motivation professionnelle en français.
            
Candidat : ${nomPrenom}
Compétences : ${competences}
Offre d'emploi : ${offreTexte}

La lettre doit être :
- Professionnelle et personnalisée
- Entre 250 et 350 mots
- Structurée : accroche, corps, conclusion
- Adaptée exactement au poste décrit
- Sans formules génériques

RÈGLES STRICTES :
- Commence par "Madame, Monsieur,"
- Date du jour : ${new Date().toLocaleDateString('fr-FR')}
- N'utilise JAMAIS de crochets []
- Termine directement par mon nom : ${nomPrenom}
- Génère UNIQUEMENT la lettre sans commentaire`
        }]
      })
    });
    const data = await response.json();
    setLettreGeneree(data.content[0].text);
  } catch {
    setLettreGeneree('Erreur — vérifiez que le serveur tourne sur port 3002');
  }
  setLettreLoading(false);
};

const estimerSalaire = async () => {
  if (!salairePoste.trim()) return;
  setSalaireLoading(true);
  setSalaireResult(null);
  try {
    const response = await fetch('https://assistants-app-production.up.railway.app/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: `Tu es un expert RH français spécialisé dans les salaires.
          
Donne une estimation salariale détaillée pour :
- Poste : ${salairePoste}
- Ville : ${salaireVille || 'France (moyenne nationale)'}
- Expérience : ${niveauxExperience.find(n => n.id === salaireExp)?.label} (${niveauxExperience.find(n => n.id === salaireExp)?.desc})

Réponds avec :
1. 💰 Fourchette salaire brut mensuel (min - max)
2. 📊 Salaire médian du marché
3. 🏙️ Différence Paris vs Province si pertinent
4. ➕ Avantages typiques du secteur (télétravail, bonus, tickets resto...)
5. 📈 Évolution salariale possible à 2-3 ans
6. 💡 Conseils pour négocier ce salaire

Sois précis avec des chiffres réels du marché français 2024-2025.`
        }]
      })
    });
    const data = await response.json();
    setSalaireResult(data.content[0].text);
  } catch {
    setSalaireResult('Erreur — vérifiez que le serveur tourne sur port 3002');
  }
  setSalaireLoading(false);
};

const lancerSimulateur = async () => {
  setSimulateurLoading(true);
  try {
    const response = await fetch('https://assistants-app-production.up.railway.app/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: `Tu es un recruteur RH expert français.
          
Génère exactement 5 questions d'entretien professionnelles pour le poste : ${simulateurPoste}

Les questions doivent être :
- Réalistes et utilisées par de vrais recruteurs
- Variées : motivations, compétences, mise en situation, personnalité, projet
- Adaptées spécifiquement au poste

Réponds UNIQUEMENT avec les 5 questions numérotées, une par ligne, sans introduction ni explication.
Format exact :
1. Question 1
2. Question 2
3. Question 3
4. Question 4
5. Question 5`
        }]
      })
    });
    const data = await response.json();
    const text = data.content[0].text;
    const questions = text.split('\n')
      .filter(l => l.match(/^\d\./))
      .map(l => l.replace(/^\d\.\s*/, '').trim())
      .filter(Boolean);
    setSimulateurQuestions(questions);
    setSimulateurActif(true);
    setSimulateurEtape(0);
    setSimulateurReponses({});
    setSimulateurFeedback({});
  } catch {
    alert('Erreur — vérifiez que le serveur tourne');
  }
  setSimulateurLoading(false);
};

const evaluerReponse = async (index) => {
  setSimulateurLoading(true);
  try {
    const response = await fetch('https://assistants-app-production.up.railway.app/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: `Tu es un recruteur expert. Évalue cette réponse d'entretien.

Poste : ${simulateurPoste}
Question : ${simulateurQuestions[index]}
Réponse du candidat : ${simulateurReponses[index]}

Donne un feedback constructif en 3 parties :
✅ Points positifs
⚠️ Points à améliorer  
💡 Exemple de meilleure réponse (2-3 phrases)

Sois bienveillant mais honnête. Maximum 150 mots.`
        }]
      })
    });
    const data = await response.json();
    setSimulateurFeedback(prev => ({ ...prev, [index]: data.content[0].text }));
    if (index < simulateurQuestions.length - 1) {
      setSimulateurEtape(index + 1);
    } else {
      setSimulateurEtape(simulateurQuestions.length);
    }
  } catch {
    alert('Erreur évaluation');
  }
  setSimulateurLoading(false);
};

  const lancerNego = async () => {
  setNegoLoading(true);
  const systemMsg = {
    role: 'user',
    content: `Tu joues le rôle d'un recruteur RH lors d'une négociation salariale.
    
Contexte :
- Poste : ${negoPoste}
- Salaire proposé par l'entreprise : ${negoSalaire}
- Objectif du candidat : ${negoCible}

Règles :
- Tu es un recruteur réaliste, ni trop facile ni trop difficile
- Tu défends le budget de l'entreprise mais tu peux céder sur certains points
- Tu peux proposer des avantages alternatifs (télétravail, bonus, tickets resto)
- Reste professionnel et bienveillant
- Réponds en 2-3 phrases maximum

Lance la négociation en proposant le salaire initial.`
  };

  try {
    const response = await fetch('https://assistants-app-production.up.railway.app/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [systemMsg] })
    });
    const data = await response.json();
    setNegoMessages([{ role: 'assistant', content: data.content[0].text }]);
    setNegoActif(true);
  } catch {
    alert('Erreur — vérifiez que le serveur tourne');
  }
  setNegoLoading(false);
};

const envoyerNegoMessage = async () => {
  if (!negoInput.trim()) return;
  const newMessages = [...negoMessages, { role: 'user', content: negoInput }];
  setNegoMessages(newMessages);
  setNegoInput('');
  setNegoLoading(true);

  try {
    const context = {
      role: 'user',
      content: `Tu joues le rôle d'un recruteur RH. Poste: ${negoPoste}. Salaire proposé: ${negoSalaire}. Objectif candidat: ${negoCible}.
      
Historique de la négociation:
${newMessages.map(m => `${m.role === 'assistant' ? 'Recruteur' : 'Candidat'}: ${m.content}`).join('\n')}

Continue la négociation en tant que recruteur. Réponds en 2-3 phrases.`
    };

    const response = await fetch('https://assistants-app-production.up.railway.app/api/claude', {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [context] })
    });
    const data = await response.json();
    setNegoMessages(prev => [...prev, { role: 'assistant', content: data.content[0].text }]);
  } catch {
    alert('Erreur');
  }
  setNegoLoading(false);
};


  return (
    <div style={{ padding: '10px' }}>
      <button onClick={onBack} style={styles.backBtn}>← Retour</button>

      <div style={{ ...styles.header, background: 'linear-gradient(135deg, #fb6340, #f5365c)' }}>
        <div style={{ fontSize: 48 }}>💼</div>
        <h2 style={styles.headerTitle}>Assistant Emploi</h2>
        <p style={styles.headerSub}>Offres · CV · Lettre · Entretien · Salaire</p>
      </div>

      {/* NAVIGATION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 16 }}>
        {[
          { id: 'offres', label: '🔍 Offres' },
          { id: 'lettre', label: '✉️ Lettre' },
          { id: 'cv', label: '📝 CV' },
          { id: 'entretien', label: '🎤 Entretien' },
          { id: 'salaire', label: '💰 Salaire' },
          { id: 'secteurs', label: '💡 Conseils' },
        ].map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            style={{ ...styles.navBtn, ...(section === s.id ? styles.navBtnActive : {}) }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* OFFRES */}
      {section === 'offres' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🔍 Rechercher des offres</div>
            <input style={styles.input} placeholder="Métier (ex: développeur, infirmier...)" value={metier} onChange={e => setMetier(e.target.value)} />
            <input style={styles.input} placeholder="Ville (ex: Paris, Lyon...)" value={ville} onChange={e => setVille(e.target.value)} />
            
            {/* Liens alternatifs */}
            <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <a href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(metier)}&location=${encodeURIComponent(ville)}`}
                target="_blank" rel="noreferrer"
                style={{ ...styles.linkBtn, background: 'linear-gradient(135deg, #0077b5, #005885)' }}>
                💼 LinkedIn Jobs
              </a>
              <a href={`https://fr.indeed.com/jobs?q=${encodeURIComponent(metier)}&l=${encodeURIComponent(ville)}`}
                target="_blank" rel="noreferrer"
                style={{ ...styles.linkBtn, background: 'linear-gradient(135deg, #2164f3, #1a4fd6)' }}>
                🔵 Indeed
              </a>
              <a href={`https://www.welcometothejungle.com/fr/jobs?refinementList%5Boffice_city_names%5D%5B%5D=${encodeURIComponent(ville)}&query=${encodeURIComponent(metier)}`}
                target="_blank" rel="noreferrer"
                style={{ ...styles.linkBtn, background: 'linear-gradient(135deg, #3d1173, #6b21a8)' }}>
                🟣 Welcome to the Jungle
              </a>
              <a href={`https://www.apec.fr/candidat/recherche-emploi.html/emploi?motsCles=${encodeURIComponent(metier)}&lieu=75`}
                target="_blank" rel="noreferrer"
                style={{ ...styles.linkBtn, background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}>
                🔴 APEC Cadres
              </a>
            </div>
          </div>

          {offreDetail ? (
            <div style={styles.card}>
              <button onClick={() => setOffreDetail(null)} style={{ ...styles.backBtn, marginBottom: 12 }}>← Retour</button>
              <div style={{ color: 'white', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{offreDetail.intitule}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                {offreDetail.entreprise?.nom && <span style={{ ...styles.badge, background: '#667eea', color: 'white' }}>🏢 {offreDetail.entreprise.nom}</span>}
                {offreDetail.lieuTravail?.libelle && <span style={{ ...styles.badge, background: '#27ae60', color: 'white' }}>📍 {offreDetail.lieuTravail.libelle}</span>}
                {offreDetail.typeContratLibelle && <span style={{ ...styles.badge, background: '#f39c12', color: 'white' }}>📋 {offreDetail.typeContratLibelle}</span>}
                {offreDetail.salaire?.libelle && <span style={{ ...styles.badge, background: '#e74c3c', color: 'white' }}>💰 {offreDetail.salaire.libelle}</span>}
              </div>
              {offreDetail.description && (
                <div style={{ ...styles.infoBox, maxHeight: 300, overflowY: 'auto' }}>
                  <p style={{ fontSize: 13, color: '#333', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{offreDetail.description}</p>
                </div>
              )}
             
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {offres.map((o, i) => (
                <button key={i} onClick={() => setOffreDetail(o)} style={styles.offreBtn}>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{o.intitule}</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {o.entreprise?.nom && <span style={{ ...styles.badge, background: 'rgba(102,126,234,0.3)', color: '#667eea', fontSize: 11 }}>🏢 {o.entreprise.nom}</span>}
                      {o.lieuTravail?.libelle && <span style={{ ...styles.badge, background: 'rgba(39,174,96,0.3)', color: '#27ae60', fontSize: 11 }}>📍 {o.lieuTravail.libelle}</span>}
                      {o.typeContratLibelle && <span style={{ ...styles.badge, background: 'rgba(243,156,18,0.3)', color: '#f39c12', fontSize: 11 }}>📋 {o.typeContratLibelle}</span>}
                    </div>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>›</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* LETTRE DE MOTIVATION */}
      {section === 'lettre' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>✉️ Générateur de lettre 🤖</div>
            <input style={styles.input} placeholder="Votre nom et prénom" value={nomPrenom} onChange={e => setNomPrenom(e.target.value)} />
            <textarea style={{ ...styles.input, height: 80, resize: 'vertical' }}
              placeholder="Vos compétences clés (ex: 5 ans en développement React, management d'équipe...)"
              value={competences} onChange={e => setCompetences(e.target.value)} />
            <textarea style={{ ...styles.input, height: 150, resize: 'vertical' }}
              placeholder="Collez ici le texte de l'offre d'emploi..."
              value={offreTexte} onChange={e => setOffreTexte(e.target.value)} />
            <button style={styles.searchBtn} onClick={genererLettre} disabled={lettreLoading || !offreTexte || !nomPrenom}>
              {lettreLoading ? '⏳ Claude génère votre lettre...' : '✨ Générer la lettre'}
            </button>
          </div>

          {lettreGeneree && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>✉️ Votre lettre de motivation</div>
              <div style={{ ...styles.infoBox, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8, color: '#333' }}>
                {lettreGeneree}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
                <button
                  onClick={() => navigator.clipboard.writeText(lettreGeneree)}
                  style={{ ...styles.searchBtn, background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                  📋 Copier
                </button>
                <a href={`mailto:?subject=Candidature&body=${encodeURIComponent(lettreGeneree)}`}
                  style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', display: 'block' }}>
                  📧 Envoyer par mail
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CV */}
      {section === 'cv' && (
  <div>
    <div style={{ ...styles.card, background: 'rgba(255,255,255,0.05)', marginBottom: 16 }}>
      <div style={styles.cardTitle}>📝 Créateur de CV</div>
      
      <div style={{ background: 'rgba(39,174,96,0.1)', border: '1px solid rgba(39,174,96,0.3)', borderRadius: 10, padding: 12, marginBottom: 16 }}>
        <p style={{ color: '#27ae60', fontSize: 12, margin: 0, textAlign: 'center' }}>
          🔒 Vos informations restent locales — Ce CV n'est pas généré par une IA
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <input style={styles.input} placeholder="Nom et prénom" value={cvNom} onChange={e => setCvNom(e.target.value)} />
        <input style={styles.input} placeholder="Poste recherché" value={cvPoste} onChange={e => setCvPoste(e.target.value)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <input style={styles.input} placeholder="Email" value={cvEmail} onChange={e => setCvEmail(e.target.value)} />
        <input style={styles.input} placeholder="Téléphone" value={cvTel} onChange={e => setCvTel(e.target.value)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <input style={styles.input} placeholder="LinkedIn" value={cvLinkedin} onChange={e => setCvLinkedin(e.target.value)} />
        <input style={styles.input} placeholder="Ville" value={cvVille} onChange={e => setCvVille(e.target.value)} />
      </div>
      <textarea style={{ ...styles.input, height: 60, resize: 'vertical' }}
        placeholder="Résumé professionnel (2-3 phrases sur vous)"
        value={cvResume} onChange={e => setCvResume(e.target.value)} />
      <textarea style={{ ...styles.input, height: 100, resize: 'vertical' }}
        placeholder="Expériences (ex: 2020-2023 : Développeur chez X → mission 1, mission 2)"
        value={cvExperiences} onChange={e => setCvExperiences(e.target.value)} />
      <textarea style={{ ...styles.input, height: 80, resize: 'vertical' }}
        placeholder="Formation (ex: Master Informatique Paris 2018 → mention, prix)"
        value={cvFormation} onChange={e => setCvFormation(e.target.value)} />
      <textarea style={{ ...styles.input, height: 60, resize: 'vertical' }}
        placeholder="Compétences (séparées par virgules)"
        value={cvCompetences} onChange={e => setCvCompetences(e.target.value)} />
      <textarea style={{ ...styles.input, height: 60, resize: 'vertical' }}
        placeholder="Autres activités / centres d'intérêt"
        value={cvAutres} onChange={e => setCvAutres(e.target.value)} />

      {/* Upload photo */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, display: 'block', marginBottom: 6 }}>
          📷 Photo de profil (optionnelle)
        </label>
        <input type="file" accept="image/*" onChange={e => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setCvPhoto(ev.target.result);
            reader.readAsDataURL(file);
          }
        }} style={{ color: 'white', fontSize: 13 }} />
      </div>

      <button style={styles.searchBtn} onClick={() => setCvGenere(true)} disabled={!cvNom || !cvPoste}>
        📝 Générer le CV
      </button>
    </div>

    {cvGenere && cvNom && ( 
      
      <div ref={cvRef} className="cv-print" style={{ background: 'white', borderRadius: 16, overflow: 'hidden', marginBottom: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
        
        {/* HEADER */}
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: 160 }}>
          {/* Photo */}
          <div style={{ background: '#2c3e50', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {cvPhoto ? (
              <img src={cvPhoto} alt="profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ fontSize: 48 }}>👤</div>
            )}
          </div>
          {/* Nom + Poste */}
          <div style={{ background: '#2c3e50', padding: '24px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'white', marginBottom: 8 }}>{cvNom}</div>
            <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>{cvPoste}</div>
          </div>
        </div>

        {/* BODY 2 colonnes */}
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr' }}>
          
          {/* COLONNE GAUCHE */}
          <div style={{ background: '#e8ede8', padding: 20 }}>
            
            {cvResume && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#2c3e50', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Mon profil
                </div>
                <p style={{ fontSize: 12, color: '#444', lineHeight: 1.6, margin: 0 }}>{cvResume}</p>
              </div>
            )}

            {cvCompetences && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#2c3e50', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Compétences
                </div>
                {cvCompetences.split(',').map((c, i) => (
                  <div key={i} style={{ fontSize: 12, color: '#444', marginBottom: 4 }}>• {c.trim()}</div>
                ))}
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#2c3e50', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                Contact
              </div>
              {cvTel && <div style={{ fontSize: 12, color: '#444', marginBottom: 4 }}>📞 {cvTel}</div>}
              {cvEmail && <div style={{ fontSize: 12, color: '#444', marginBottom: 4 }}>✉️ {cvEmail}</div>}
              {cvLinkedin && <div style={{ fontSize: 12, color: '#444', marginBottom: 4 }}>💼 {cvLinkedin}</div>}
              {cvVille && <div style={{ fontSize: 12, color: '#444', marginBottom: 4 }}>📍 {cvVille}</div>}
            </div>

            {cvAutres && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#2c3e50', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Autres activités
                </div>
                <p style={{ fontSize: 12, color: '#444', lineHeight: 1.6, margin: 0 }}>{cvAutres}</p>
              </div>
            )}
          </div>

          {/* COLONNE DROITE */}
          <div style={{ background: 'white', padding: 24 }}>
            
            {cvExperiences && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#2c3e50', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1, borderBottom: '2px solid #2c3e50', paddingBottom: 6 }}>
                  Expérience professionnelle
                </div>
                {cvExperiences.split('\n').filter(l => l.trim()).map((exp, i) => {
                  const parts = exp.split('→');
                  return (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#2c3e50' }}>{parts[0]?.trim()}</div>
                      {parts[1] && parts[1].split(',').map((m, j) => (
                        <div key={j} style={{ fontSize: 12, color: '#555', marginLeft: 8, marginTop: 2 }}>• {m.trim()}</div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}

            {cvFormation && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#2c3e50', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1, borderBottom: '2px solid #2c3e50', paddingBottom: 6 }}>
                  Formation
                </div>
                {cvFormation.split('\n').filter(l => l.trim()).map((form, i) => {
                  const parts = form.split('→');
                  return (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#2c3e50' }}>{parts[0]?.trim()}</div>
                      {parts[1] && parts[1].split(',').map((m, j) => (
                        <div key={j} style={{ fontSize: 12, color: '#555', marginLeft: 8, marginTop: 2 }}>• {m.trim()}</div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* BOUTONS */}
        <div id="cv-buttons" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: 16, background: '#f8f8f8' }}>
         
<button
  onClick={async () => {
    document.getElementById('cv-buttons').style.display = 'none';
    const canvas = await html2canvas(cvRef.current, { scale: 2 });
    document.getElementById('cv-buttons').style.display = 'grid';
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`CV-${cvNom}.pdf`);
  }}
  style={{ ...styles.searchBtn, background: 'linear-gradient(135deg, #2c3e50, #1a252f)' }}>
  📄 Télécharger PDF
</button>
        </div>
      </div>
    )}
  </div>
)}

      {/* ENTRETIEN */}
      {section === 'entretien' && (
  <div>
    <div style={styles.card}>
      <div style={styles.cardTitle}>🎤 Simulateur d'entretien IA</div>

      {!simulateurActif ? (
        <>
          <input style={styles.input}
            placeholder="Poste visé (ex: développeur React, chef de projet...)"
            value={simulateurPoste}
            onChange={e => setSimulateurPoste(e.target.value)} />
          <button style={styles.searchBtn}
            onClick={lancerSimulateur}
            disabled={simulateurLoading || !simulateurPoste}>
            {simulateurLoading ? '⏳ Préparation...' : '🎤 Lancer le simulateur'}
          </button>

          <div style={{ marginTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16 }}>
            <div style={styles.cardTitle}>💬 Questions classiques</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {[
                { id: 'generales', label: '💬 Générales' },
                { id: 'negociation', label: '💡 Conseils' },

                { id: 'simulation_nego', label: '🎭 Négociation' },
              ].map(c => (
                <button key={c.id} onClick={() => setCategorieEntretien(c.id)}
                  style={{ ...styles.navBtn, flex: 1, ...(categorieEntretien === c.id ? styles.navBtnActive : {}) }}>
                  {c.label}
                </button>
              ))}
            </div>
            {categorieEntretien !== 'simulation_nego' && questionsEntretien[categorieEntretien]?.map((q, i) => (
  <div key={i} style={{ marginBottom: 12 }}>
    <div style={{ color: 'white', fontWeight: 700, fontSize: 14, marginBottom: 6 }}>❓ {q.q}</div>
    <div style={styles.infoBox}>
      <p style={{ fontSize: 13, color: '#333', lineHeight: 1.7, margin: 0 }}>💡 {q.r}</p>
    </div>
  </div>
))}

            {categorieEntretien === 'simulation_nego' && (
  <div>
    {!negoActif ? (
      <div>
        <input style={styles.input}
          placeholder="Poste (ex: développeur React...)"
          value={negoPoste}
          onChange={e => setNegoPoste(e.target.value)} />
        <input style={styles.input}
          placeholder="Salaire actuel ou souhaité (ex: 3500€)"
          value={negoSalaire}
          onChange={e => setNegoSalaire(e.target.value)} />
        <input style={styles.input}
          placeholder="Salaire cible (ex: 4500€)"
          value={negoCible}
          onChange={e => setNegoCible(e.target.value)} />
        <button style={styles.searchBtn}
          onClick={lancerNego}
          disabled={negoLoading || !negoPoste || !negoSalaire}>
          {negoLoading ? '⏳ Préparation...' : '🎭 Lancer la simulation'}
        </button>
      </div>
    ) : (
      <div>
        <button onClick={() => { setNegoActif(false); setNegoMessages([]); }}
          style={{ ...styles.backBtn, marginBottom: 12 }}>
          ← Arrêter
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12, maxHeight: 400, overflowY: 'auto' }}>
          {negoMessages.map((msg, i) => (
            <div key={i} style={{
              padding: '12px 16px',
              borderRadius: 12,
              background: msg.role === 'assistant' ? 'rgba(251,99,64,0.15)' : 'rgba(255,255,255,0.1)',
              alignSelf: msg.role === 'assistant' ? 'flex-start' : 'flex-end',
              maxWidth: '85%',
            }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
                {msg.role === 'assistant' ? '👔 Recruteur' : '👤 Vous'}
              </div>
              <p style={{ color: 'white', fontSize: 13, margin: 0, lineHeight: 1.6 }}>{msg.content}</p>
            </div>
          ))}
          {negoLoading && (
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center' }}>
              ⏳ Le recruteur réfléchit...
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <input style={{ ...styles.input, marginBottom: 0, flex: 1 }}
            placeholder="Votre réponse..."
            value={negoInput}
            onChange={e => setNegoInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && envoyerNegoMessage()}
          />
          <button style={{ ...styles.searchBtn, width: 'auto', padding: '12px 16px' }}
            onClick={envoyerNegoMessage}
            disabled={negoLoading || !negoInput}>
            ➤
          </button>
        </div>
      </div>
    )}
  </div>
)}


          </div>
        </>
      ) : (
        <div>
          <button onClick={() => { setSimulateurActif(false); setSimulateurQuestions([]); setSimulateurReponses({}); setSimulateurFeedback({}); setSimulateurEtape(0); }}
            style={{ ...styles.backBtn, marginBottom: 16 }}>
            ← Arrêter le simulateur
          </button>

          {simulateurQuestions.length > 0 && (
            <div>
              {/* Progress */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                {simulateurQuestions.map((_, i) => (
                  <div key={i} style={{
                    flex: 1, height: 4, borderRadius: 2,
                    background: i < simulateurEtape ? '#fb6340' : i === simulateurEtape ? 'white' : 'rgba(255,255,255,0.2)'
                  }} />
                ))}
              </div>

              {simulateurEtape < simulateurQuestions.length ? (
                <div style={styles.card}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 8 }}>
                    Question {simulateurEtape + 1} / {simulateurQuestions.length}
                  </div>
                  <div style={{ color: 'white', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
                    ❓ {simulateurQuestions[simulateurEtape]}
                  </div>
                  <textarea
                    style={{ ...styles.input, height: 120, resize: 'vertical' }}
                    placeholder="Votre réponse..."
                    value={simulateurReponses[simulateurEtape] || ''}
                    onChange={e => setSimulateurReponses(prev => ({ ...prev, [simulateurEtape]: e.target.value }))}
                  />
                  <button
                    style={styles.searchBtn}
                    disabled={!simulateurReponses[simulateurEtape] || simulateurLoading}
                    onClick={() => evaluerReponse(simulateurEtape)}>
                    {simulateurLoading ? '⏳ Évaluation...' : simulateurEtape < simulateurQuestions.length - 1 ? 'Répondre et continuer →' : 'Terminer l\'entretien ✅'}
                  </button>

                  {simulateurFeedback[simulateurEtape] && (
                    <div style={{ ...styles.infoBox, marginTop: 12 }}>
                      <p style={{ fontSize: 13, color: '#333', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                        {simulateurFeedback[simulateurEtape]}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div style={styles.card}>
                  <div style={{ color: '#fb6340', fontSize: 18, fontWeight: 800, textAlign: 'center', marginBottom: 16 }}>
                    🎉 Entretien terminé !
                  </div>
                  <div style={styles.infoBox}>
                    <p style={{ fontSize: 14, color: '#333', lineHeight: 1.8, margin: 0 }}>
                      Consultez les feedbacks de chaque question ci-dessous pour vous améliorer.
                    </p>
                  </div>
                  {simulateurQuestions.map((q, i) => (
                    <div key={i} style={{ marginTop: 12 }}>
                      <div style={{ color: 'white', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>❓ {q}</div>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 6, fontStyle: 'italic' }}>
                        Votre réponse : {simulateurReponses[i]}
                      </div>
                      {simulateurFeedback[i] && (
                        <div style={styles.infoBox}>
                          <p style={{ fontSize: 12, color: '#333', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                            {simulateurFeedback[i]}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  </div>
)}

      {/* SALAIRE */}
      {section === 'salaire' && (
  <div>
    <div style={styles.card}>
      <div style={styles.cardTitle}>💰 Estimateur de salaire IA</div>

      <input style={styles.input} placeholder="Poste (ex: développeur React, chef de projet...)" value={salairePoste} onChange={e => setSalairePoste(e.target.value)} />
      <input style={styles.input} placeholder="Ville (ex: Paris, Lyon, Marseille...)" value={salaireVille} onChange={e => setSalaireVille(e.target.value)} />

      <div style={styles.cardTitle}>📊 Niveau d'expérience</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {niveauxExperience.map(n => (
          <button key={n.id} onClick={() => setSalaireExp(n.id)}
            style={{ ...styles.filtreBtn, ...(salaireExp === n.id ? styles.filtreBtnActive : {}) }}>
            {n.label} — {n.desc}
          </button>
        ))}
      </div>

      <button style={styles.searchBtn} onClick={estimerSalaire} disabled={salaireLoading || !salairePoste}>
        {salaireLoading ? '⏳ Estimation en cours...' : '💰 Estimer avec l\'IA'}
      </button>
    </div>

    {salaireResult && (
      <div style={styles.card}>
        <div style={styles.cardTitle}>💰 Estimation salariale</div>
        <div style={{ ...styles.infoBox, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8, color: '#333' }}>
          {salaireResult}
        </div>
        <div style={{ marginTop: 12, ...styles.infoBox, background: 'linear-gradient(135deg, #fff8e1, #fff3e0)' }}>
          <p style={{ fontSize: 12, color: '#f57c00', margin: 0, lineHeight: 1.7 }}>
            ⚠️ Ces estimations sont indicatives et basées sur les données du marché. Vérifiez sur Glassdoor ou LinkedIn pour confirmer.
          </p>
        </div>
      </div>
    )}
  </div>
)}



      {/* CONSEILS SECTEURS */}
      {section === 'secteurs' && (
        <div>
          {secteurSelec ? (
            <div style={styles.card}>
              <button onClick={() => setSecteurSelec(null)} style={{ ...styles.backBtn, marginBottom: 12 }}>← Retour</button>
              <div style={{ color: 'white', fontSize: 20, fontWeight: 800, marginBottom: 16 }}>{secteurSelec.label}</div>
              {secteurSelec.conseils.map((c, i) => (
                <div key={i} style={{ ...styles.infoBox, marginBottom: 8 }}>
                  <p style={{ fontSize: 14, color: '#333', margin: 0, lineHeight: 1.7 }}>✅ {c}</p>
                </div>
              ))}
              <div style={{ marginTop: 16 }}>
                <a href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(secteurSelec.label.replace(/[^a-zA-Z ]/g, ''))}`}
                  target="_blank" rel="noreferrer"
                  style={{ ...styles.searchBtn, display: 'block', textAlign: 'center', textDecoration: 'none', background: 'linear-gradient(135deg, #0077b5, #005885)' }}>
                  💼 Offres LinkedIn pour ce secteur
                </a>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {secteurs.map((s, i) => (
                <button key={i} onClick={() => setSecteurSelec(s)} style={styles.offreBtn}>
                  <span style={{ fontSize: 24 }}>{s.label.split(' ')[0]}</span>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ color: 'white', fontWeight: 700 }}>{s.label.split(' ').slice(1).join(' ')}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{s.conseils.length} conseils</div>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>›</span>
                </button>
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
  searchBtn: { width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #fb6340, #f5365c)', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  navBtn: { padding: '10px 6px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 12, fontWeight: 600 },
  navBtnActive: { background: 'rgba(251,99,64,0.3)', color: '#fb6340', border: '1px solid #fb6340' },
  badge: { padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  infoBox: { background: 'linear-gradient(135deg, #f8f9ff, #f3e8ff)', borderRadius: 12, padding: 16 },
  offreBtn: { display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '16px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', width: '100%' },
  linkBtn: { display: 'block', color: 'white', textDecoration: 'none', padding: '12px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600, textAlign: 'center' },
  filtreBtn: { padding: '8px 12px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 12 },
  filtreBtnActive: { background: 'rgba(251,99,64,0.2)', color: '#fb6340', border: '1px solid #fb6340' },
  macroBox: { background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '14px', textAlign: 'center' },
};
