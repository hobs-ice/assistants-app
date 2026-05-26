import React, { useState } from 'react';

const SERVER = 'https://assistants-app-production.up.railway.app';

export default function Vehicule({ onBack }) {
  const [section, setSection] = useState('f1');

  // F1
  const [f1Section, setF1Section] = useState('calendrier');
  const [f1Loading, setF1Loading] = useState(false);
  const [f1Data, setF1Data] = useState(null);
  const [f1Question, setF1Question] = useState('');
  const [f1Result, setF1Result] = useState('');
  const [f1Loading2, setF1Loading2] = useState(false);

  // Mécanicien IA
  const [panneProblem, setPanneProblem] = useState('');
  const [panneResult, setPanneResult] = useState('');
  const [panneLoading, setPanneLoading] = useState(false);

  // VIN
  const [vin, setVin] = useState('');
  const [vinResult, setVinResult] = useState(null);
  const [vinLoading, setVinLoading] = useState(false);

  // Recherche véhicule
  const [rechMarque, setRechMarque] = useState('');
  const [rechBudget, setRechBudget] = useState('');
  const [rechKm, setRechKm] = useState('');
  const [rechAnnee, setRechAnnee] = useState('');

  const chargerF1 = async (type) => {
    setF1Loading(true);
    setF1Data(null);
    try {
      let url;
      if (type === 'calendrier') url = 'https://api.openf1.org/v1/sessions?year=2026&session_type=Race';
      if (type === 'pilotes') url = 'https://api.openf1.org/v1/drivers?session_key=latest';
      if (type === 'classement') url = 'https://api.openf1.org/v1/position?session_key=latest';
      const res = await fetch(url);
      const data = await res.json();
      setF1Data(data);
    } catch { setF1Data([]); }
    setF1Loading(false);
  };

  const simulationF1 = async () => {
    if (!f1Question.trim()) return;
    setF1Loading2(true);
    setF1Result('');
    try {
      const response = await fetch(`${SERVER}/api/claude`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Tu es un expert en Formule 1 avec une connaissance encyclopédique de toute l'histoire de ce sport.

Question ou simulation : "${f1Question}"

Si c'est une question historique, réponds avec précision et passion.
Si c'est un "et si..." ou une simulation, analyse de manière détaillée et réaliste.
Si c'est sur les rivalités ou stratégies, donne ton analyse d'expert.

Sois passionné, précis et détaillé. Maximum 400 mots.`
          }]
        })
      });
      const data = await response.json();
      setF1Result(data.content[0].text);
    } catch { setF1Result('Erreur — vérifiez que le serveur tourne'); }
    setF1Loading2(false);
  };

  const diagnosticPanne = async () => {
    if (!panneProblem.trim()) return;
    setPanneLoading(true);
    setPanneResult('');
    try {
      const response = await fetch(`${SERVER}/api/claude`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Tu es un mécanicien expert avec 20 ans d'expérience en automobile et moto.

Un client décrit ce problème : "${panneProblem}"

Réponds avec :
🔍 DIAGNOSTIC (causes probables par ordre de probabilité)
🛠️ VÉRIFICATIONS À FAIRE (étapes pratiques)
⚠️ URGENCE (peut-on continuer à rouler ?)
💰 COÛT ESTIMÉ (fourchette de prix pour la réparation)
💡 CONSEIL DU MÉCANICIEN

Sois clair, pratique et honnête. Maximum 300 mots.`
          }]
        })
      });
      const data = await response.json();
      setPanneResult(data.content[0].text);
    } catch { setPanneResult('Erreur — vérifiez que le serveur tourne'); }
    setPanneLoading(false);
  };

  const decoderVIN = async () => {
    if (!vin.trim() || vin.length !== 17) return;
    setVinLoading(true);
    setVinResult(null);
    try {
      const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`);
      const data = await res.json();
      const results = data.Results?.filter(r => r.Value && r.Value !== 'Not Applicable' && r.Value !== '0' && r.Value !== null);
      const infos = {};
      results?.forEach(r => { infos[r.Variable] = r.Value; });
      setVinResult(infos);
    } catch { setVinResult(null); }
    setVinLoading(false);
  };

  return (
    <div style={{ padding: '10px' }}>
      <button onClick={onBack} style={styles.backBtn}>← Retour</button>

      <div style={{ ...styles.header, background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}>
        <div style={{ fontSize: 48 }}>🚗</div>
        <h2 style={styles.headerTitle}>Assistant Véhicule</h2>
        <p style={styles.headerSub}>F1 · Mécanicien IA · VIN · Recherche Auto</p>
      </div>

      {/* NAVIGATION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
        {[
          { id: 'f1', label: '🏎️ Formule 1' },
          { id: 'mecanicien', label: '🔧 Mécanicien IA' },
          { id: 'vin', label: '🔍 Décodeur VIN' },
          { id: 'recherche', label: '🚗 Trouver un véhicule' },
        ].map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            style={{ ...styles.navBtn, ...(section === s.id ? styles.navBtnActive : {}), fontSize: 11 }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* FORMULE 1 */}
      {section === 'f1' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🏎️ Formule 1 2026</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {[
                { id: 'calendrier', label: '📅 Calendrier' },
                { id: 'pilotes', label: '👤 Pilotes' },
                { id: 'classement', label: '🏆 Classement' },
              ].map(t => (
                <button key={t.id} onClick={() => { setF1Section(t.id); chargerF1(t.id); }}
                  style={{ ...styles.typeBtn, ...(f1Section === t.id ? styles.typeBtnActive : {}), flex: 1 }}>
                  {t.label}
                </button>
              ))}
            </div>
            {f1Loading && <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>⏳ Chargement...</p>}
          </div>

          {/* RÉSULTATS F1 */}
          {f1Data && f1Data.length > 0 && f1Section === 'calendrier' && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>📅 Grands Prix 2026</div>
              {f1Data.slice(0, 15).map((session, i) => (
                <div key={i} style={{ ...styles.itemRow, marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>
                      {session.country_name || session.circuit_short_name}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                      {session.date_start ? new Date(session.date_start).toLocaleDateString('fr-FR') : ''}
                    </div>
                  </div>
                  <span style={{ ...styles.badge, background: '#e74c3c', color: 'white' }}>
                    {session.location || 'GP'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {f1Data && f1Data.length > 0 && f1Section === 'pilotes' && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>👤 Pilotes</div>
              {f1Data.slice(0, 20).map((pilote, i) => (
                <div key={i} style={{ ...styles.itemRow, marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>
                      {pilote.full_name || pilote.broadcast_name}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                      {pilote.team_name}
                    </div>
                  </div>
                  <span style={{ ...styles.badge, background: '#e74c3c', color: 'white' }}>
                    #{pilote.driver_number}
                  </span>
                </div>
              ))}
            </div>
          )}

          {f1Data && f1Data.length > 0 && f1Section === 'classement' && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>🏆 Classement</div>
              {f1Data.slice(0, 20).map((pos, i) => (
                <div key={i} style={{ ...styles.itemRow, marginBottom: 8 }}>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, minWidth: 24 }}>{pos.position}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>
                      Voiture #{pos.driver_number}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {f1Data && f1Data.length === 0 && (
            <div style={styles.card}>
              <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                Aucune donnée disponible pour le moment
              </p>
            </div>
          )}

          {/* SIMULATION IA */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>🤖 Expert F1 & Simulation IA</div>
            <div style={{ ...styles.infoBox, marginBottom: 12 }}>
              <p style={{ fontSize: 12, color: '#555', margin: 0 }}>
                💡 Pose des questions sur l'histoire F1, les rivalités, les stratégies ou fais des simulations "Et si..."
              </p>
            </div>
            <textarea style={{ ...styles.input, height: 120, resize: 'vertical' }}
              placeholder="Ex: Analyse la rivalité Verstappen vs Hamilton, Et si Ferrari avait eu les mêmes pneus que Mercedes en 2012, Quelle était la meilleure stratégie de Schumacher chez Ferrari, Qui aurait été champion si Prost et Senna avaient couru à la même époque moderne ?"
              value={f1Question}
              onChange={e => setF1Question(e.target.value)} />
            <button style={styles.searchBtn} onClick={simulationF1} disabled={f1Loading2 || !f1Question}>
              {f1Loading2 ? '⏳ Analyse...' : '🏎️ Simulation & Analyse'}
            </button>
          </div>

          {f1Result && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>🏎️ Analyse Expert F1</div>
              <div style={{ ...styles.infoBox, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8, color: '#333' }}>
                {f1Result}
              </div>
            </div>
          )}

          {/* LIENS F1 */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>🔗 Sources F1</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: '🏎️ Formula 1 Officiel', url: 'https://www.formula1.com', color: '#e10600' },
                { label: '📊 Résultats & Stats', url: 'https://www.formula1.com/en/results', color: '#1e1e1e' },
                { label: '📺 F1 TV', url: 'https://f1tv.formula1.com', color: '#e10600' },
              ].map((l, i) => (
                <a key={i} href={l.url} target="_blank" rel="noreferrer"
                  style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: `linear-gradient(135deg, ${l.color}, ${l.color}cc)` }}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MÉCANICIEN IA */}
      {section === 'mecanicien' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🔧 Mécanicien Expert IA</div>
            <div style={{ ...styles.infoBox, marginBottom: 12 }}>
              <p style={{ fontSize: 12, color: '#555', margin: 0 }}>
                🚗 Décris le problème de ton véhicule et le mécanicien IA te donnera un diagnostic
              </p>
            </div>
            <textarea style={{ ...styles.input, height: 120, resize: 'vertical' }}
              placeholder="Ex: Ma voiture fait un bruit de claquement au démarrage, Ma moto vibre fort à 100km/h, Mon moteur fume blanc..."
              value={panneProblem}
              onChange={e => setPanneProblem(e.target.value)} />
            <button style={styles.searchBtn} onClick={diagnosticPanne} disabled={panneLoading || !panneProblem}>
              {panneLoading ? '⏳ Diagnostic en cours...' : '🔧 Diagnostiquer'}
            </button>
          </div>

          {panneResult && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>🔧 Diagnostic du mécanicien</div>
              <div style={{ ...styles.infoBox, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8, color: '#333' }}>
                {panneResult}
              </div>
              <div style={{ marginTop: 12, background: 'rgba(243,156,18,0.1)', border: '1px solid rgba(243,156,18,0.3)', borderRadius: 10, padding: 12 }}>
                <p style={{ color: '#f39c12', fontSize: 12, margin: 0 }}>
                  ⚠️ Ce diagnostic est indicatif. Consultez toujours un professionnel pour les réparations.
                </p>
              </div>
            </div>
          )}

          {/* TROUVER UN GARAGE */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>🏪 Trouver un garage</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="https://www.google.com/maps/search/garage+automobile+près+de+moi"
                target="_blank" rel="noreferrer"
                style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center' }}>
                🗺️ Garage proche de moi
              </a>
              <a href="https://www.google.com/maps/search/concessionnaire+automobile+près+de+moi"
                target="_blank" rel="noreferrer"
                style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: 'linear-gradient(135deg, #0070f3, #005bb5)' }}>
                🏢 Concessionnaire proche
              </a>
            </div>
          </div>
        </div>
      )}

      {/* DÉCODEUR VIN */}
      {section === 'vin' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🔍 Décodeur VIN</div>
            <div style={{ ...styles.infoBox, marginBottom: 12 }}>
              <p style={{ fontSize: 12, color: '#555', margin: 0 }}>
                Le numéro VIN est un code de 17 caractères sur la plaque du véhicule ou la carte grise
              </p>
            </div>
            <input style={styles.input}
              placeholder="Ex: 1HGBH41JXMN109186 (17 caractères)"
              value={vin}
              onChange={e => setVin(e.target.value.toUpperCase())}
              maxLength={17} />
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textAlign: 'right', marginTop: -8, marginBottom: 12 }}>
              {vin.length}/17 caractères
            </div>
            <button style={styles.searchBtn} onClick={decoderVIN}
              disabled={vinLoading || vin.length !== 17}>
              {vinLoading ? '⏳ Décodage...' : '🔍 Décoder le VIN'}
            </button>
          </div>

          {vinResult && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>📋 Informations du véhicule</div>
              {[
                'Make', 'Model', 'Model Year', 'Body Class', 'Engine Number of Cylinders',
                'Displacement (L)', 'Fuel Type - Primary', 'Drive Type', 'Transmission Style',
                'Plant Country', 'Manufacturer Name'
              ].map((key, i) => vinResult[key] ? (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{key}</span>
                  <span style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>{vinResult[key]}</span>
                </div>
              ) : null)}
            </div>
          )}
        </div>
      )}

      {/* RECHERCHE VÉHICULE */}
      {section === 'recherche' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🚗 Trouver un véhicule</div>
            <input style={styles.input} placeholder="Marque (ex: Toyota, BMW, Renault...)" value={rechMarque} onChange={e => setRechMarque(e.target.value)} />
            <input style={styles.input} placeholder="Budget max (ex: 15000)" type="number" value={rechBudget} onChange={e => setRechBudget(e.target.value)} />
            <input style={styles.input} placeholder="Kilométrage max (ex: 100000)" type="number" value={rechKm} onChange={e => setRechKm(e.target.value)} />
            <input style={styles.input} placeholder="Année min (ex: 2018)" type="number" value={rechAnnee} onChange={e => setRechAnnee(e.target.value)} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href={`https://www.leboncoin.fr/recherche?category=2&text=${encodeURIComponent(rechMarque)}&price=min-${rechBudget || ''}&mileage=min-${rechKm || ''}`}
                target="_blank" rel="noreferrer"
                style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center' }}>
                🟠 Leboncoin
              </a>
              <a href={`https://www.lacentrale.fr/listing?makesModelsCommercialNames=${encodeURIComponent(rechMarque)}&priceMax=${rechBudget || ''}&mileageMax=${rechKm || ''}`}
                target="_blank" rel="noreferrer"
                style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: 'linear-gradient(135deg, #0070f3, #005bb5)' }}>
                🔵 La Centrale
              </a>
              <a href={`https://www.autoscout24.fr/lst/${encodeURIComponent(rechMarque.toLowerCase())}?pricefrom=0&priceto=${rechBudget || ''}&kmto=${rechKm || ''}&fregfrom=${rechAnnee || ''}`}
                target="_blank" rel="noreferrer"
                style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: 'linear-gradient(135deg, #f39c12, #e67e22)' }}>
                🟡 AutoScout24
              </a>
              <a href={`https://www.paruvendu.fr/a/voiture-occasion/${encodeURIComponent(rechMarque.toLowerCase())}/?rechpv=1&px1=${rechBudget || ''}&km1=${rechKm || ''}&a0=${rechAnnee || ''}`}
  target="_blank" rel="noreferrer"
  style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: 'linear-gradient(135deg, #27ae60, #1e8449)' }}>
  🟢 ParuVendu

              </a>
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
  searchBtn: { width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #e74c3c, #c0392b)', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  navBtn: { padding: '10px 6px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 12, fontWeight: 600 },
  navBtnActive: { background: 'rgba(231,76,60,0.2)', color: '#e74c3c', border: '1px solid #e74c3c' },
  badge: { padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  infoBox: { background: 'linear-gradient(135deg, #f8f9ff, #f3e8ff)', borderRadius: 12, padding: 16 },
  typeBtn: { padding: '10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 13 },
  typeBtnActive: { background: 'rgba(231,76,60,0.2)', color: '#e74c3c', border: '1px solid #e74c3c' },
  itemRow: { display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '10px 14px' },
};