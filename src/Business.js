import React, { useState, useEffect } from 'react';

export default function Business({ onBack }) {
  const [section, setSection] = useState('bourse');

  // Business Plan
  const [bpSecteur, setBpSecteur] = useState('');
  const [bpProduit, setBpProduit] = useState('');
  const [bpCible, setBpCible] = useState('');
  const [bpBudget, setBpBudget] = useState('');
  const [bpResult, setBpResult] = useState('');
  const [bpLoading, setBpLoading] = useState(false);

  // Rentabilité
  const [rentCA, setRentCA] = useState('');
  const [rentCharges, setRentCharges] = useState('');
  const [rentInvest, setRentInvest] = useState('');
  const [rentResult, setRentResult] = useState(null);

  // Bourse & Crypto
  const [bourseSearch, setBourseSearch] = useState('');
  const [bourseData, setBourseData] = useState(null);
  const [bourseLoading, setBourseLoading] = useState(false);
  const [cryptoList, setCryptoList] = useState([]);
  const [cryptoLoading, setCryptoLoading] = useState(false);
  const [bourseType, setBourseType] = useState('crypto');
  const [cryptoSearch, setCryptoSearch] = useState('');
  const [cryptoSearchResults, setCryptoSearchResults] = useState([]);

  const rechercherCrypto = async () => {
  if (!cryptoSearch.trim()) return;
  setCryptoLoading(true);
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(cryptoSearch)}`
    );
    const data = await res.json();
    
    // Récupérer les prix des résultats
    const ids = data.coins.slice(0, 10).map(c => c.id).join(',');
    const pricesRes = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=eur&include_24hr_change=true`
    );
    const prices = await pricesRes.json();
    
    const results = data.coins.slice(0, 10).map(c => ({
      ...c,
      prix: prices[c.id]?.eur,
      variation: prices[c.id]?.eur_24h_change,
    }));
    setCryptoSearchResults(results);
  } catch { setCryptoSearchResults([]); }
  setCryptoLoading(false);
};


  // Portefeuille simulé
  const [portefeuille, setPortefeuille] = useState(() => {
    try { return JSON.parse(localStorage.getItem('portefeuille')) || []; }
    catch { return []; }
  });
  const [pfNom, setPfNom] = useState('');
  const [pfMontant, setPfMontant] = useState('');
  const [pfPrix, setPfPrix] = useState('');

  // Juridique
  const [juridiqueCategorie, setJuridiqueCategorie] = useState('statuts');
  const [juridiqueQuestion, setJuridiqueQuestion] = useState('');
  const [juridiqueResult, setJuridiqueResult] = useState('');
  const [juridiqueLoading, setJuridiqueLoading] = useState(false);

  // Marketing
  const [marketingType, setMarketingType] = useState('slogan');
  const [marketingProduit, setMarketingProduit] = useState('');
  const [marketingResult, setMarketingResult] = useState('');
  const [marketingLoading, setMarketingLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (section === 'bourse' && bourseType === 'crypto' && cryptoList.length === 0) {
      chargerCryptos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, bourseType, cryptoList.length]);

  const chargerCryptos = async () => {
    setCryptoLoading(true);
    try {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=20&page=1&sparkline=false'
      );
      const data = await res.json();
      setCryptoList(data);
    } catch { setCryptoList([]); }
    setCryptoLoading(false);
  };

  const rechercherBourse = async () => {
  if (!bourseSearch.trim()) return;
  setBourseLoading(true);
  setBourseData(null);
  try {
    const res = await fetch(`https://assistants-app-production.up.railway.app/api/stock/${encodeURIComponent(bourseSearch)}`);
    const data = await res.json();
    if (data.prix) {
      setBourseData(data);
    } else {
      setBourseData('notfound');
    }
  } catch { setBourseData('notfound'); }
  setBourseLoading(false);
};

  const ajouterPortefeuille = () => {
    if (!pfNom || !pfMontant || !pfPrix) return;
    const nouv = [...portefeuille, {
      nom: pfNom,
      montant: parseFloat(pfMontant),
      prixAchat: parseFloat(pfPrix),
      date: new Date().toLocaleDateString('fr-FR'),
    }];
    setPortefeuille(nouv);
    localStorage.setItem('portefeuille', JSON.stringify(nouv));
    setPfNom(''); setPfMontant(''); setPfPrix('');
  };

  const supprimerPortefeuille = (i) => {
    const nouv = portefeuille.filter((_, idx) => idx !== i);
    setPortefeuille(nouv);
    localStorage.setItem('portefeuille', JSON.stringify(nouv));
  };

  const calculerRentabilite = () => {
    if (!rentCA || !rentCharges) return;
    const ca = parseFloat(rentCA);
    const charges = parseFloat(rentCharges);
    const invest = parseFloat(rentInvest) || 0;
    const benefice = ca - charges;
    const margeNette = ((benefice / ca) * 100).toFixed(1);
    const roi = invest > 0 ? (((benefice / invest) * 100).toFixed(1)) : null;
    const seuilRentabilite = charges;
    const pointMort = invest > 0 ? Math.ceil(invest / (benefice / 12)) : null;
    setRentResult({ benefice, margeNette, roi, seuilRentabilite, pointMort });
  };

  const genererBusinessPlan = async () => {
    if (!bpSecteur || !bpProduit) return;
    setBpLoading(true);
    setBpResult('');
    try {
      const response = await fetch('https://assistants-app-production.up.railway.app/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Tu es un expert en création d'entreprise. Génère un business plan structuré.

Secteur : ${bpSecteur}
Produit/Service : ${bpProduit}
Cible : ${bpCible || 'Non spécifiée'}
Budget initial : ${bpBudget || 'Non spécifié'}

Structure OBLIGATOIRE :
1. 📋 RÉSUMÉ EXÉCUTIF
2. 🎯 ANALYSE DU MARCHÉ (opportunités, concurrents, tendances)
3. 💡 PROPOSITION DE VALEUR
4. 👥 CIBLE CLIENT
5. 💰 MODÈLE ÉCONOMIQUE (revenus, charges, rentabilité estimée)
6. 📣 STRATÉGIE MARKETING
7. ⚠️ RISQUES ET SOLUTIONS
8. 📅 PLAN D'ACTION (3 premiers mois)

Sois concret, chiffré quand possible. Maximum 600 mots.`
          }]
        })
      });
      const data = await response.json();
      setBpResult(data.content[0].text);
    } catch { setBpResult('Erreur — vérifiez que le serveur tourne'); }
    setBpLoading(false);
  };

  const conseilJuridique = async () => {
    if (!juridiqueQuestion.trim()) return;
    setJuridiqueLoading(true);
    setJuridiqueResult('');
    try {
      const categories = {
        statuts: 'statuts juridiques d\'entreprise en France (SASU, EURL, SAS, SARL, auto-entrepreneur...)',
        contrats: 'contrats commerciaux et professionnels en France',
        fiscalite: 'fiscalité des entreprises en France (TVA, IS, cotisations...)',
        propriete: 'propriété intellectuelle, marques et brevets en France',
      };
      const response = await fetch('https://assistants-app-production.up.railway.app/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Tu es un expert juridique spécialisé en ${categories[juridiqueCategorie]}.

Question : "${juridiqueQuestion}"

Réponds de manière claire et structurée :
1. 📋 Réponse directe à la question
2. ⚖️ Cadre légal applicable
3. 💡 Conseils pratiques
4. ⚠️ Points d'attention importants
5. 🔗 Démarches recommandées

IMPORTANT : précise toujours qu'il faut consulter un professionnel pour des cas spécifiques.
Maximum 300 mots.`
          }]
        })
      });
      const data = await response.json();
      setJuridiqueResult(data.content[0].text);
    } catch { setJuridiqueResult('Erreur — vérifiez que le serveur tourne'); }
    setJuridiqueLoading(false);
  };

  const genererMarketing = async () => {
    if (!marketingProduit.trim()) return;
    setMarketingLoading(true);
    setMarketingResult('');
    try {
      const types = {
        slogan: 'Génère 5 slogans accrocheurs et mémorables',
        description: 'Génère une description marketing convaincante de 100 mots',
        reseaux: 'Génère 3 posts LinkedIn, 3 posts Instagram et 3 tweets percutants',
        email: 'Génère un email de prospection commercial professionnel',
        pitch: 'Génère un pitch de 60 secondes pour présenter ce produit/service',
      };
      const response = await fetch('https://assistants-app-production.up.railway.app/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Tu es un expert en marketing digital français.

Produit/Service : ${marketingProduit}
Tâche : ${types[marketingType]}

Sois créatif, percutant et adapté au marché français.`
          }]
        })
      });
      const data = await response.json();
      setMarketingResult(data.content[0].text);
    } catch { setMarketingResult('Erreur — vérifiez que le serveur tourne'); }
    setMarketingLoading(false);
  };

  return (
    <div style={{ padding: '10px' }}>
      <button onClick={onBack} style={styles.backBtn}>← Retour</button>

      <div style={{ ...styles.header, background: 'linear-gradient(135deg, #2dce89, #26af74)' }}>
        <div style={{ fontSize: 48 }}>📈</div>
        <h2 style={styles.headerTitle}>Assistant Business</h2>
        <p style={styles.headerSub}>Bourse · Crypto · Business Plan · Juridique · Marketing</p>
      </div>

      {/* NAVIGATION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 16 }}>
        {[
          { id: 'bourse', label: '📊 Bourse & Crypto' },
          { id: 'businessplan', label: '📋 Business Plan' },
          { id: 'rentabilite', label: '💰 Rentabilité' },
          { id: 'juridique', label: '⚖️ Juridique' },
          { id: 'marketing', label: '📣 Marketing' },
        ].map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            style={{ ...styles.navBtn, ...(section === s.id ? styles.navBtnActive : {}), fontSize: 11 }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* BOURSE & CRYPTO */}
      {section === 'bourse' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>📊 Marchés financiers</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <button onClick={() => setBourseType('crypto')}
                style={{ ...styles.typeBtn, ...(bourseType === 'crypto' ? styles.typeBtnActive : {}) }}>
                🪙 Crypto
              </button>
              <button onClick={() => setBourseType('bourse')}
                style={{ ...styles.typeBtn, ...(bourseType === 'bourse' ? styles.typeBtnActive : {}) }}>
                📈 Bourse
              </button>
            </div>

            {bourseType === 'bourse' && (
              <>
                <input style={styles.input}
                  placeholder="Symbole (ex: AAPL, TSLA, MC.PA, BNP.PA...)"
                  value={bourseSearch}
                  onChange={e => setBourseSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && rechercherBourse()} />
                <button style={styles.searchBtn} onClick={rechercherBourse} disabled={bourseLoading}>
                  {bourseLoading ? '⏳ Chargement...' : '🔍 Rechercher'}
                </button>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 8 }}>
                  Ex: AAPL (Apple), TSLA (Tesla), MC.PA (LVMH), BNP.PA (BNP Paribas)
                </div>
              </>
            )}
          </div>

          {/* RÉSULTAT BOURSE */}
          {bourseType === 'bourse' && bourseData && bourseData !== 'notfound' && (
            <div style={styles.card}>
              <div style={{ color: 'white', fontSize: 20, fontWeight: 800, marginBottom: 12 }}>{bourseData.nom}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div style={styles.macroBox}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#2dce89' }}>
                    {bourseData.prix?.toFixed(2)} {bourseData.devise}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Prix actuel</div>
                </div>
                <div style={styles.macroBox}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: bourseData.variation >= 0 ? '#2dce89' : '#e74c3c' }}>
                    {bourseData.variation >= 0 ? '▲' : '▼'} {Math.abs(bourseData.variation?.toFixed(2))}%
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Variation</div>
                </div>
                <div style={styles.macroBox}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>{bourseData.haut?.toFixed(2)}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Plus haut</div>
                </div>
                <div style={styles.macroBox}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>{bourseData.bas?.toFixed(2)}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Plus bas</div>
                </div>
              </div>
            </div>
          )}

          {bourseType === 'bourse' && bourseData === 'notfound' && (
            <div style={styles.card}>
              <p style={{ color: '#f5365c', textAlign: 'center' }}>❌ Symbole non trouvé</p>
            </div>
          )}

          {/* CRYPTOS */}
         {bourseType === 'crypto' && (
  <div>
    <div style={styles.card}>
      <div style={styles.cardTitle}>🔍 Rechercher une crypto</div>
      <input style={styles.input}
        placeholder="Ex: Bitcoin, Ethereum, Solana..."
        value={cryptoSearch}
        onChange={e => setCryptoSearch(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && rechercherCrypto()} />
      <button style={styles.searchBtn} onClick={rechercherCrypto} disabled={cryptoLoading}>
        {cryptoLoading ? '⏳ Recherche...' : '🔍 Rechercher'}
      </button>
    </div>

    {cryptoSearchResults.length > 0 && (
      <div style={styles.card}>
        <div style={styles.cardTitle}>Résultats</div>
        {cryptoSearchResults.map((crypto, i) => (
          <div key={i} style={{ ...styles.cryptoItem, cursor: 'pointer', marginBottom: 8 }}
            onClick={() => { setPfNom(crypto.symbol.toUpperCase()); setPfPrix(crypto.prix?.toString() || ''); }}>
            {crypto.thumb && <img src={crypto.thumb} alt={crypto.name} style={{ width: 32, height: 32, borderRadius: 16 }} />}
            <div style={{ flex: 1 }}>
              <div style={{ color: 'white', fontWeight: 700 }}>{crypto.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{crypto.symbol.toUpperCase()}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              {crypto.prix && <div style={{ color: 'white', fontWeight: 700 }}>{crypto.prix.toLocaleString('fr-FR')} €</div>}
              {crypto.variation && (
                <div style={{ color: crypto.variation >= 0 ? '#2dce89' : '#e74c3c', fontSize: 12 }}>
                  {crypto.variation >= 0 ? '▲' : '▼'} {Math.abs(crypto.variation.toFixed(2))}%
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )}

    <div style={styles.card}>
      <div style={styles.cardTitle}>🪙 Top 20 Cryptomonnaies</div>
      <button style={{ ...styles.searchBtn, marginBottom: 12 }} onClick={chargerCryptos} disabled={cryptoLoading}>
        {cryptoLoading ? '⏳ Chargement...' : '🔄 Actualiser'}
      </button>
      {cryptoList.map((crypto, i) => (
        <div key={i} style={{ ...styles.cryptoItem, cursor: 'pointer', marginBottom: 6 }}
          onClick={() => { setPfNom(crypto.symbol.toUpperCase()); setPfPrix(crypto.current_price.toString()); }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, minWidth: 24 }}>{i + 1}</div>
          {crypto.image && <img src={crypto.image} alt={crypto.name} style={{ width: 32, height: 32, borderRadius: 16 }} />}
          <div style={{ flex: 1 }}>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>{crypto.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{crypto.symbol.toUpperCase()}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'white', fontWeight: 700 }}>{crypto.current_price.toLocaleString('fr-FR')} €</div>
            <div style={{ color: crypto.price_change_percentage_24h >= 0 ? '#2dce89' : '#e74c3c', fontSize: 12, fontWeight: 600 }}>
              {crypto.price_change_percentage_24h >= 0 ? '▲' : '▼'} {Math.abs(crypto.price_change_percentage_24h?.toFixed(2))}%
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}


          {/* PORTEFEUILLE SIMULÉ */}
          <div style={{ ...styles.card, marginTop: 16 }}>
            <div style={styles.cardTitle}>💼 Portefeuille simulé</div>
            <div style={{ ...styles.infoBox, marginBottom: 12 }}>
              <p style={{ fontSize: 12, color: '#333', margin: 0 }}>
                🎮 Simulation uniquement — aucun vrai argent investi
              </p>
            </div>

            <input style={styles.input} placeholder="Actif (ex: BTC, AAPL, TSLA...)" value={pfNom} onChange={e => setPfNom(e.target.value)} />
            <div style={{ display: 'flex', gap: 8 }}>
              <input style={{ ...styles.input, flex: 1 }} placeholder="Montant investi (€)" type="number" value={pfMontant} onChange={e => setPfMontant(e.target.value)} />
              <input style={{ ...styles.input, flex: 1 }} placeholder="Prix d'achat (€)" type="number" value={pfPrix} onChange={e => setPfPrix(e.target.value)} />
            </div>
            <button style={styles.searchBtn} onClick={ajouterPortefeuille} disabled={!pfNom || !pfMontant || !pfPrix}>
              ➕ Ajouter au portefeuille
            </button>

            {portefeuille.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 8 }}>Mes positions :</div>
                {portefeuille.map((p, i) => {
                  const cryptoPrix = cryptoList.find(c => c.symbol.toUpperCase() === p.nom.toUpperCase())?.current_price;
                  const quantite = p.montant / p.prixAchat;
                  const valeurActuelle = cryptoPrix ? cryptoPrix * quantite : null;
                  const gainPerte = valeurActuelle ? valeurActuelle - p.montant : null;
                  return (
                    <div key={i} style={{ ...styles.cryptoItem, marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: 'white', fontWeight: 700 }}>{p.nom}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                          Investi : {p.montant}€ · Achat : {p.prixAchat}€ · {p.date}
                        </div>
                        {valeurActuelle && (
                          <div style={{ fontSize: 12, color: gainPerte >= 0 ? '#2dce89' : '#e74c3c', fontWeight: 600 }}>
                            Valeur : {valeurActuelle.toFixed(2)}€ ({gainPerte >= 0 ? '+' : ''}{gainPerte.toFixed(2)}€)
                          </div>
                        )}
                      </div>
                      <button onClick={() => supprimerPortefeuille(i)}
                        style={{ background: 'rgba(231,76,60,0.2)', border: 'none', color: '#e74c3c', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>
                        ✕
                      </button>
                    </div>
                  );
                })}
                <div style={{ ...styles.macroBox, marginTop: 8 }}>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 4 }}>Total investi</div>
                  <div style={{ color: 'white', fontSize: 20, fontWeight: 800 }}>
                    {portefeuille.reduce((sum, p) => sum + p.montant, 0).toFixed(2)}€
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BUSINESS PLAN */}
      {section === 'businessplan' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>📋 Générateur de Business Plan — IA</div>
            <input style={styles.input} placeholder="Secteur d'activité (ex: restauration, tech, mode...)" value={bpSecteur} onChange={e => setBpSecteur(e.target.value)} />
            <input style={styles.input} placeholder="Produit ou service" value={bpProduit} onChange={e => setBpProduit(e.target.value)} />
            <input style={styles.input} placeholder="Cible client (ex: jeunes 18-25, PME, seniors...)" value={bpCible} onChange={e => setBpCible(e.target.value)} />
            <input style={styles.input} placeholder="Budget initial (ex: 5000€, 50000€...)" value={bpBudget} onChange={e => setBpBudget(e.target.value)} />
            <button style={styles.searchBtn} onClick={genererBusinessPlan} disabled={bpLoading || !bpSecteur || !bpProduit}>
              {bpLoading ? '⏳ Génération en cours...' : '✨ Générer le Business Plan'}
            </button>
          </div>
          {bpResult && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>📋 Votre Business Plan</div>
              <div style={{ ...styles.infoBox, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8, color: '#333' }}>
                {bpResult}
              </div>
              <button onClick={() => navigator.clipboard.writeText(bpResult).then(() => alert('Copié !'))}
                style={{ ...styles.searchBtn, marginTop: 12, background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                📋 Copier
              </button>
            </div>
          )}
        </div>
      )}

      {/* RENTABILITÉ */}
      {section === 'rentabilite' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>💰 Calculateur de rentabilité</div>
            <input style={styles.input} placeholder="Chiffre d'affaires annuel (€)" type="number" value={rentCA} onChange={e => setRentCA(e.target.value)} />
            <input style={styles.input} placeholder="Charges totales annuelles (€)" type="number" value={rentCharges} onChange={e => setRentCharges(e.target.value)} />
            <input style={styles.input} placeholder="Investissement initial (€) — optionnel" type="number" value={rentInvest} onChange={e => setRentInvest(e.target.value)} />
            <button style={styles.searchBtn} onClick={calculerRentabilite} disabled={!rentCA || !rentCharges}>
              💰 Calculer
            </button>
          </div>
          {rentResult && (
            <div style={styles.card}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={styles.macroBox}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: rentResult.benefice >= 0 ? '#2dce89' : '#e74c3c' }}>
                    {rentResult.benefice.toLocaleString('fr-FR')}€
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Bénéfice net</div>
                </div>
                <div style={styles.macroBox}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#2dce89' }}>{rentResult.margeNette}%</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Marge nette</div>
                </div>
                {rentResult.roi && (
                  <div style={styles.macroBox}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#f39c12' }}>{rentResult.roi}%</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>ROI</div>
                  </div>
                )}
                {rentResult.pointMort && (
                  <div style={styles.macroBox}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#667eea' }}>{rentResult.pointMort} mois</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Point mort</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* JURIDIQUE */}
      {section === 'juridique' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>⚖️ Conseils juridiques — IA</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              {[
                { id: 'statuts', label: '🏢 Statuts' },
                { id: 'contrats', label: '📝 Contrats' },
                { id: 'fiscalite', label: '💶 Fiscalité' },
                { id: 'propriete', label: '™️ Propriété IP' },
              ].map(c => (
                <button key={c.id} onClick={() => setJuridiqueCategorie(c.id)}
                  style={{ ...styles.typeBtn, ...(juridiqueCategorie === c.id ? styles.typeBtnActive : {}) }}>
                  {c.label}
                </button>
              ))}
            </div>
            <textarea style={{ ...styles.input, height: 100, resize: 'vertical' }}
              placeholder="Votre question juridique..."
              value={juridiqueQuestion}
              onChange={e => setJuridiqueQuestion(e.target.value)} />
            <button style={styles.searchBtn} onClick={conseilJuridique} disabled={juridiqueLoading || !juridiqueQuestion}>
              {juridiqueLoading ? '⏳ Analyse...' : '⚖️ Obtenir un conseil'}
            </button>
          </div>
          {juridiqueResult && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>⚖️ Conseil juridique</div>
              <div style={{ ...styles.infoBox, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8, color: '#333' }}>
                {juridiqueResult}
              </div>
              <div style={{ marginTop: 12, background: 'rgba(243,156,18,0.1)', border: '1px solid rgba(243,156,18,0.3)', borderRadius: 10, padding: 12 }}>
                <p style={{ color: '#f39c12', fontSize: 12, margin: 0 }}>
                  ⚠️ Ces informations sont indicatives. Consultez un avocat ou expert-comptable pour votre situation spécifique.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MARKETING */}
      {section === 'marketing' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>📣 Générateur Marketing — IA</div>
            <input style={styles.input}
              placeholder="Votre produit ou service..."
              value={marketingProduit}
              onChange={e => setMarketingProduit(e.target.value)} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {[
                { id: 'slogan', label: '✨ Slogans' },
                { id: 'description', label: '📝 Description' },
                { id: 'reseaux', label: '📱 Réseaux sociaux' },
                { id: 'email', label: '📧 Email pro' },
                { id: 'pitch', label: '🎤 Pitch 60s' },
              ].map(t => (
                <button key={t.id} onClick={() => setMarketingType(t.id)}
                  style={{ ...styles.filtreBtn, ...(marketingType === t.id ? styles.filtreBtnActive : {}) }}>
                  {t.label}
                </button>
              ))}
            </div>
            <button style={styles.searchBtn} onClick={genererMarketing} disabled={marketingLoading || !marketingProduit}>
              {marketingLoading ? '⏳ Génération...' : '✨ Générer'}
            </button>
          </div>
          {marketingResult && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>📣 Contenu marketing</div>
              <div style={{ ...styles.infoBox, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8, color: '#333' }}>
                {marketingResult}
              </div>
              <button onClick={() => navigator.clipboard.writeText(marketingResult).then(() => alert('Copié !'))}
                style={{ ...styles.searchBtn, marginTop: 12, background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                📋 Copier
              </button>
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
  searchBtn: { width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #2dce89, #26af74)', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  navBtn: { padding: '10px 6px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 12, fontWeight: 600 },
  navBtnActive: { background: 'rgba(45,206,137,0.2)', color: '#2dce89', border: '1px solid #2dce89' },
  badge: { padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  infoBox: { background: 'linear-gradient(135deg, #f8f9ff, #f3e8ff)', borderRadius: 12, padding: 16 },
  typeBtn: { flex: 1, padding: '10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 13 },
  typeBtnActive: { background: 'rgba(45,206,137,0.2)', color: '#2dce89', border: '1px solid #2dce89' },
  filtreBtn: { padding: '8px 12px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 12 },
  filtreBtnActive: { background: 'rgba(45,206,137,0.2)', color: '#2dce89', border: '1px solid #2dce89' },
  macroBox: { background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '14px', textAlign: 'center' },
  cryptoItem: { display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '10px 14px', marginBottom: 6 },
};
