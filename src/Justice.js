import React, { useState } from 'react';

const SERVER = 'https://assistants-app-production.up.railway.app';
export default function Justice({ onBack }) {
  const [section, setSection] = useState('avocat');

  // Avocat IA
  const [avocatQuestion, setAvocatQuestion] = useState('');
  const [avocatResult, setAvocatResult] = useState('');
  const [avocatLoading, setAvocatLoading] = useState(false);
  const [avocatDomaine, setAvocatDomaine] = useState('general');

  // Droit français
  const [droitQuery, setDroitQuery] = useState('');
  const [droitResult, setDroitResult] = useState('');
  const [droitLoading, setDroitLoading] = useState(false);
  const [legiResults, setLegiResults] = useState([]);

  // Droit international
  const [interQuery, setInterQuery] = useState('');
  const [interResult, setInterResult] = useState('');
  const [interLoading, setInterLoading] = useState(false);

  // Jurisprudence
  const [jurisQuery, setJurisQuery] = useState('');
  const [jurisResult, setJurisResult] = useState('');
  const [jurisLoading, setJurisLoading] = useState(false);
  const [jurisDecisions, setJurisDecisions] = useState([]);

  // Courriers
  const [courrierType, setCourrierType] = useState('mise_en_demeure');
  const [courrierSituation, setCourrierSituation] = useState('');
  const [courrierResult, setCourrierResult] = useState('');
  const [courrierLoading, setCourrierLoading] = useState(false);
  const [expediteur, setExpediteur] = useState('');
  const [destinataire, setDestinataire] = useState('');

  const domaines = [
    { id: 'general', label: '⚖️ Général' },
    { id: 'travail', label: '💼 Droit du travail' },
    { id: 'famille', label: '👨‍👩‍👧 Famille' },
    { id: 'consommation', label: '🛒 Consommation' },
    { id: 'immobilier', label: '🏠 Immobilier' },
    { id: 'penal', label: '🚔 Pénal' },
    { id: 'entreprise', label: '🏢 Entreprise' },
    { id: 'international', label: '🌍 International' },
  ];

  const typesCourrierList = [
    { id: 'mise_en_demeure', label: '⚠️ Mise en demeure' },
    { id: 'reclamation', label: '📝 Réclamation' },
    { id: 'contestation', label: '❌ Contestation' },
    { id: 'resiliation', label: '🚪 Résiliation' },
    { id: 'plainte', label: '🚔 Plainte' },
    { id: 'demande_remboursement', label: '💰 Remboursement' },
    { id: 'appel_decision', label: '📋 Appel décision' },
    { id: 'accord_amiable', label: '🤝 Accord amiable' },
  ];

  const consulterAvocat = async () => {
    if (!avocatQuestion.trim()) return;
    setAvocatLoading(true);
    setAvocatResult('');
    try {
      const response = await fetch(`${SERVER}/api/claude`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Tu es un avocat expert en droit français et international, spécialisé en ${domaines.find(d => d.id === avocatDomaine)?.label || 'droit général'}.

Question : "${avocatQuestion}"

Réponds de manière claire et structurée :
⚖️ ANALYSE JURIDIQUE
📋 TEXTES APPLICABLES (articles de loi pertinents)
💡 CONSEIL PRATIQUE
🚀 DÉMARCHES RECOMMANDÉES
⚠️ POINTS D'ATTENTION

IMPORTANT : précise toujours que cette consultation est informative et qu'un avocat professionnel doit être consulté pour les cas spécifiques.
Maximum 400 mots.`
          }]
        })
      });
      const data = await response.json();
      setAvocatResult(data.content[0].text);
    } catch { setAvocatResult('Erreur — vérifiez que le serveur tourne'); }
    setAvocatLoading(false);
  };

  const rechercherDroitFrancais = async () => {
    if (!droitQuery.trim()) return;
    setDroitLoading(true);
    setDroitResult('');
    setLegiResults([]);
    try {
      // Recherche via Légifrance API
      const legiRes = await fetch(`${SERVER}/api/legifrance`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    recherche: {
      champs: [{ typeChamp: 'ALL', criteres: [{ typeRecherche: 'EXACTE', valeur: droitQuery }] }],
      filtres: [{ facette: 'TYPE_FONDS', valeur: 'CODE' }],
      pageNumber: 1,
      pageSize: 5,
      sort: 'PERTINENCE',
    },
    fond: 'CODE_DATE',
  })
});
      const legiData = await legiRes.json();
      setLegiResults(legiData.results || []);

      // Groq pour explication
      const groqRes = await fetch(`${SERVER}/api/claude`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Tu es un expert en droit français. Explique clairement la règle juridique sur : "${droitQuery}"

Structure :
📖 DÉFINITION ET PRINCIPE
⚖️ TEXTES DE LOI (codes et articles principaux)
📋 APPLICATION CONCRÈTE
💡 EXEMPLES PRATIQUES
🔗 RESSOURCES (Légifrance, codes concernés)

Maximum 350 mots.`
          }]
        })
      });
      const groqData = await groqRes.json();
      setDroitResult(groqData.content[0].text);
    } catch { setDroitResult('Erreur — vérifiez que le serveur tourne'); }
    setDroitLoading(false);
  };

  const rechercherDroitInternational = async () => {
    if (!interQuery.trim()) return;
    setInterLoading(true);
    setInterResult('');
    try {
      const response = await fetch(`${SERVER}/api/claude`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Tu es un expert en droit international et européen.

Question sur : "${interQuery}"

Structure :
🌍 CADRE JURIDIQUE INTERNATIONAL
🇪🇺 DROIT EUROPÉEN APPLICABLE (directives, règlements, traités)
⚖️ JURISPRUDENCE INTERNATIONALE (CJUE, CEDH si pertinent)
🇫🇷 APPLICATION EN FRANCE
💡 CONSEIL PRATIQUE

Maximum 400 mots.`
          }]
        })
      });
      const data = await response.json();
      setInterResult(data.content[0].text);
    } catch { setInterResult('Erreur — vérifiez que le serveur tourne'); }
    setInterLoading(false);
  };

 const rechercherJurisprudence = async () => {
  if (!jurisQuery.trim()) return;
  setJurisLoading(true);
  setJurisResult('');
  setJurisDecisions([]);
  try {
    const groqRes = await fetch(`${SERVER}/api/claude`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: `Tu es un expert en jurisprudence française. Analyse la jurisprudence sur : "${jurisQuery}"

Structure :
🏛️ POSITION DES TRIBUNAUX
📋 ARRÊTS IMPORTANTS (Cour de cassation, Conseil d'État)
⚖️ ÉVOLUTION JURISPRUDENTIELLE
💡 CE QUE ÇA SIGNIFIE CONCRÈTEMENT
⚠️ POINTS DE VIGILANCE

Maximum 350 mots.`
        }]
      })
    });
    const groqData = await groqRes.json();
    setJurisResult(groqData.content[0].text);
  } catch { setJurisResult('Erreur — vérifiez que le serveur tourne'); }
  setJurisLoading(false);
};


  const genererCourrier = async () => {
    if (!courrierSituation.trim()) return;
    setCourrierLoading(true);
    setCourrierResult('');
    try {
      const typeLabel = typesCourrierList.find(t => t.id === courrierType)?.label || 'courrier juridique';
      const response = await fetch(`${SERVER}/api/claude`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Tu es un avocat expert en rédaction de courriers juridiques français.

Type de courrier : ${typeLabel}
Expéditeur : ${expediteur || 'Non spécifié'}
Destinataire : ${destinataire || 'Non spécifié'}
Situation : "${courrierSituation}"

Rédige un courrier juridique complet, professionnel et conforme au droit français :
- En-tête et coordonnées
- Objet clair
- Corps du courrier structuré avec les arguments juridiques
- Mention des textes de loi applicables si pertinent
- Formule de politesse appropriée
- Délais légaux si applicable (ex: 8 jours pour mise en demeure)

Le courrier doit être prêt à être envoyé, formel et juridiquement solide.`
          }]
        })
      });
      const data = await response.json();
      setCourrierResult(data.content[0].text);
    } catch { setCourrierResult('Erreur — vérifiez que le serveur tourne'); }
    setCourrierLoading(false);
  };

  return (
    <div style={{ padding: '10px' }}>
      <button onClick={onBack} style={styles.backBtn}>← Retour</button>

      <div style={{ ...styles.header, background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>
        <div style={{ fontSize: 48 }}>⚖️</div>
        <h2 style={styles.headerTitle}>Assistant Justice</h2>
        <p style={styles.headerSub}>Avocat IA · Lois · Jurisprudence · Courriers</p>
      </div>

      <div style={{ background: 'rgba(243,156,18,0.1)', border: '1px solid rgba(243,156,18,0.3)', borderRadius: 10, padding: 12, marginBottom: 16 }}>
        <p style={{ color: '#f39c12', fontSize: 12, margin: 0, textAlign: 'center' }}>
          ⚠️ Cet assistant est informatif uniquement. Consultez un avocat pour toute situation juridique réelle.
        </p>
      </div>

      {/* NAVIGATION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
        {[
          { id: 'avocat', label: '💬 Mon Avocat IA' },
          { id: 'francais', label: '🇫🇷 Droit Français' },
          { id: 'international', label: '🌍 Droit International' },
          { id: 'jurisprudence', label: '🏛️ Jurisprudence' },
          { id: 'courrier', label: '✉️ Courriers' },
          { id: 'ressources', label: '🔗 Ressources' },
        ].map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            style={{ ...styles.navBtn, ...(section === s.id ? styles.navBtnActive : {}), fontSize: 11 }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* MON AVOCAT IA */}
      {section === 'avocat' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>💬 Consultation — Mon Avocat IA</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {domaines.map(d => (
                <button key={d.id} onClick={() => setAvocatDomaine(d.id)}
                  style={{ ...styles.filtreBtn, ...(avocatDomaine === d.id ? styles.filtreBtnActive : {}) }}>
                  {d.label}
                </button>
              ))}
            </div>
            <textarea style={{ ...styles.input, height: 120, resize: 'vertical' }}
              placeholder="Décrivez votre situation ou posez votre question juridique..."
              value={avocatQuestion}
              onChange={e => setAvocatQuestion(e.target.value)} />
            <button style={styles.searchBtn} onClick={consulterAvocat} disabled={avocatLoading || !avocatQuestion}>
              {avocatLoading ? '⏳ Consultation en cours...' : '💬 Consulter mon avocat IA'}
            </button>
          </div>

          {avocatResult && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>⚖️ Avis juridique</div>
              <div style={{ ...styles.infoBox, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8, color: '#333' }}>
                {avocatResult}
              </div>
              <button onClick={() => navigator.clipboard.writeText(avocatResult).then(() => alert('Copié !'))}
                style={{ ...styles.searchBtn, marginTop: 12, background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                📋 Copier
              </button>
            </div>
          )}
        </div>
      )}

      {/* DROIT FRANÇAIS */}
      {section === 'francais' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🇫🇷 Droit Français</div>
            <input style={styles.input}
              placeholder="Ex: licenciement abusif, bail locatif, divorce, garde à vue..."
              value={droitQuery}
              onChange={e => setDroitQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && rechercherDroitFrancais()} />
            <button style={styles.searchBtn} onClick={rechercherDroitFrancais} disabled={droitLoading || !droitQuery}>
              {droitLoading ? '⏳ Recherche...' : '🔍 Rechercher'}
            </button>
          </div>

          {legiResults.length > 0 && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>📚 Textes Légifrance</div>
              {legiResults.map((r, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 12, marginBottom: 8 }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>{r.titre}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{r.nature} · {r.dateTexte}</div>
                  {r.url && (
                    <a href={r.url} target="_blank" rel="noreferrer"
                      style={{ color: '#667eea', fontSize: 12 }}>
                      Voir sur Légifrance →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {droitResult && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>⚖️ Explication juridique</div>
              <div style={{ ...styles.infoBox, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8, color: '#333' }}>
                {droitResult}
              </div>
              <button onClick={() => navigator.clipboard.writeText(droitResult).then(() => alert('Copié !'))}
                style={{ ...styles.searchBtn, marginTop: 12, background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                📋 Copier
              </button>
            </div>
          )}
        </div>
      )}

      {/* DROIT INTERNATIONAL */}
      {section === 'international' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🌍 Droit International & Européen</div>
            <input style={styles.input}
              placeholder="Ex: RGPD, droit d'asile, extradition, directive européenne..."
              value={interQuery}
              onChange={e => setInterQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && rechercherDroitInternational()} />
            <button style={styles.searchBtn} onClick={rechercherDroitInternational} disabled={interLoading || !interQuery}>
              {interLoading ? '⏳ Recherche...' : '🔍 Rechercher'}
            </button>
          </div>

          {interResult && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>🌍 Analyse internationale</div>
              <div style={{ ...styles.infoBox, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8, color: '#333' }}>
                {interResult}
              </div>
              <button onClick={() => navigator.clipboard.writeText(interResult).then(() => alert('Copié !'))}
                style={{ ...styles.searchBtn, marginTop: 12, background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                📋 Copier
              </button>
            </div>
          )}

          <div style={styles.card}>
            <div style={styles.cardTitle}>🔗 Sources internationales</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: '🇪🇺 EUR-Lex (Droit européen)', url: 'https://eur-lex.europa.eu/homepage.html?locale=fr', color: '#003399' },
                { label: '⚖️ CJUE (Cour de Justice UE)', url: 'https://curia.europa.eu', color: '#003399' },
                { label: '🏛️ CEDH (Droits de l\'homme)', url: 'https://www.echr.coe.int/fr', color: '#003399' },
                { label: '🌍 ONU Droit international', url: 'https://www.un.org/fr/about-us/un-charter', color: '#009edb' },
              ].map((l, i) => (
                <a key={i} href={l.url} target="_blank" rel="noreferrer"
                  style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: `linear-gradient(135deg, ${l.color}, ${l.color}99)` }}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* JURISPRUDENCE */}
      {section === 'jurisprudence' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🏛️ Jurisprudence</div>
            <input style={styles.input}
              placeholder="Ex: harcèlement moral au travail, vice caché, abus de confiance..."
              value={jurisQuery}
              onChange={e => setJurisQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && rechercherJurisprudence()} />
            <button style={styles.searchBtn} onClick={rechercherJurisprudence} disabled={jurisLoading || !jurisQuery}>
              {jurisLoading ? '⏳ Recherche...' : '🔍 Rechercher'}
            </button>
          </div>

          {jurisDecisions.length > 0 && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>📋 Décisions Judilibre</div>
              {jurisDecisions.map((d, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 12, marginBottom: 8 }}>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>{d.numero || d.id}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{d.formation} · {d.decision_date}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4 }}>
                    {d.sommaire?.substring(0, 150)}...
                  </div>
                </div>
              ))}
            </div>
          )}

          {jurisResult && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>⚖️ Analyse jurisprudentielle</div>
              <div style={{ ...styles.infoBox, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8, color: '#333' }}>
                {jurisResult}
              </div>
              <button onClick={() => navigator.clipboard.writeText(jurisResult).then(() => alert('Copié !'))}
                style={{ ...styles.searchBtn, marginTop: 12, background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                📋 Copier
              </button>
            </div>
          )}

          <div style={styles.card}>
            <div style={styles.cardTitle}>🔗 Sources jurisprudence</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="https://www.courdecassation.fr/decisions" target="_blank" rel="noreferrer"
                style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center' }}>
                🏛️ Cour de Cassation
              </a>
              <a href="https://www.conseil-etat.fr/decisions-de-justice" target="_blank" rel="noreferrer"
                style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                ⚖️ Conseil d'État
              </a>
            </div>
          </div>
        </div>
      )}

      {/* COURRIERS */}
      {section === 'courrier' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>✉️ Générateur de courriers juridiques</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              {typesCourrierList.map(t => (
                <button key={t.id} onClick={() => setCourrierType(t.id)}
                  style={{ ...styles.typeBtn, ...(courrierType === t.id ? styles.typeBtnActive : {}), fontSize: 11 }}>
                  {t.label}
                </button>
              ))}
            </div>
            <input style={styles.input}
              placeholder="Votre nom / société (expéditeur)"
              value={expediteur}
              onChange={e => setExpediteur(e.target.value)} />
            <input style={styles.input}
              placeholder="Nom / société destinataire"
              value={destinataire}
              onChange={e => setDestinataire(e.target.value)} />
            <textarea style={{ ...styles.input, height: 120, resize: 'vertical' }}
              placeholder="Décrivez votre situation en détail..."
              value={courrierSituation}
              onChange={e => setCourrierSituation(e.target.value)} />
            <button style={styles.searchBtn} onClick={genererCourrier}
              disabled={courrierLoading || !courrierSituation}>
              {courrierLoading ? '⏳ Rédaction en cours...' : '✉️ Générer le courrier'}
            </button>
          </div>

          {courrierResult && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>✉️ Votre courrier juridique</div>
              <div style={{ ...styles.infoBox, whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.8, color: '#333' }}>
                {courrierResult}
              </div>
              <button onClick={() => navigator.clipboard.writeText(courrierResult).then(() => alert('Courrier copié !'))}
                style={{ ...styles.searchBtn, marginTop: 12, background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                📋 Copier le courrier
              </button>
            </div>
          )}
        </div>
      )}

      {/* RESSOURCES */}
      {section === 'ressources' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🔗 Ressources juridiques</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: '📚 Légifrance — Lois françaises', url: 'https://www.legifrance.gouv.fr', color: '#003189' },
                { label: '🏛️ Service-Public.fr', url: 'https://www.service-public.fr', color: '#003189' },
                { label: '⚖️ Cour de Cassation', url: 'https://www.courdecassation.fr', color: '#1a1a2e' },
                { label: '🏛️ Conseil d\'État', url: 'https://www.conseil-etat.fr', color: '#1a1a2e' },
                { label: '🇪🇺 EUR-Lex', url: 'https://eur-lex.europa.eu/homepage.html?locale=fr', color: '#003399' },
                { label: '👨‍⚖️ Trouver un avocat', url: 'https://www.avocat.fr', color: '#8B0000' },
                { label: '🆘 Aide juridictionnelle', url: 'https://www.service-public.fr/particuliers/vosdroits/F18074', color: '#27ae60' },
                { label: '📞 Défenseur des droits', url: 'https://www.defenseurdesdroits.fr', color: '#e74c3c' },
              ].map((l, i) => (
                <a key={i} href={l.url} target="_blank" rel="noreferrer"
                  style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: `linear-gradient(135deg, ${l.color}, ${l.color}99)`, fontSize: 13 }}>
                  {l.label}
                </a>
              ))}
            </div>
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
  searchBtn: { width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #1a1a2e, #16213e)', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  navBtn: { padding: '10px 6px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 12, fontWeight: 600 },
  navBtnActive: { background: 'rgba(102,126,234,0.2)', color: '#667eea', border: '1px solid #667eea' },
  badge: { padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  infoBox: { background: 'linear-gradient(135deg, #f8f9ff, #f3e8ff)', borderRadius: 12, padding: 16 },
  typeBtn: { padding: '10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 13 },
  typeBtnActive: { background: 'rgba(102,126,234,0.2)', color: '#667eea', border: '1px solid #667eea' },
  filtreBtn: { padding: '8px 12px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 12 },
  filtreBtnActive: { background: 'rgba(102,126,234,0.2)', color: '#667eea', border: '1px solid #667eea' },
};
