import React, { useState, useEffect, useRef } from 'react';

export default function Etudiant({ onBack }) {
  const [section, setSection] = useState('fiches');
  
  // Fiches révision
  const [ficheMatiere, setFicheMatiere] = useState('');
  const [ficheCours, setFicheCours] = useState('');
  const [ficheResult, setFicheResult] = useState('');
  const [ficheLoading, setFicheLoading] = useState(false);

  // Pomodoro
  const [pomodoroMode, setPomodoroMode] = useState('work');
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroCycles, setPomodoroCycles] = useState(0);
  const intervalRef = useRef(null);

  // Moyenne
  const [notes, setNotes] = useState([{ matiere: '', note: '', coeff: '1' }]);
  const [moyenneResult, setMoyenneResult] = useState(null);

  // Ressources
  const [ressourceSearch, setRessourceSearch] = useState('');
 
  const [bienetreCategorie, setBienetreCategorie] = useState('stress');
  const [bienetreInput, setBienetreInput] = useState('');
  const [bienetreResult, setBienetreResult] = useState('');
  const [bienetreLoading, setBienetreLoading] = useState(false);
  

  // Pomodoro timer
  useEffect(() => {
    if (pomodoroRunning) {
      intervalRef.current = setInterval(() => {
        setPomodoroTime(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setPomodoroRunning(false);
            if (pomodoroMode === 'work') {
              setPomodoroCycles(c => c + 1);
              setPomodoroMode('break');
              setPomodoroTime(5 * 60);
            } else {
              setPomodoroMode('work');
              setPomodoroTime(25 * 60);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [pomodoroRunning, pomodoroMode]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const genererFiche = async () => {
    if (!ficheCours.trim()) return;
    setFicheLoading(true);
    setFicheResult('');
    try {
      const response = await fetch('https://assistants-app-production.up.railway.app/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Tu es un professeur expert. Génère une fiche de révision complète et structurée.

Matière : ${ficheMatiere || 'Non spécifiée'}
Cours : ${ficheCours}

Structure OBLIGATOIRE :
📌 POINTS CLÉS (5-7 points essentiels à retenir)
📖 DÉFINITIONS IMPORTANTES (termes clés avec définitions claires)
🔗 LIENS ET CONCEPTS (comment les idées sont connectées)
❓ QUESTIONS DE RÉVISION (5 questions pour tester la compréhension)
💡 ASTUCES POUR RETENIR (moyens mnémotechniques si possible)

Sois clair, concis et pédagogique. Maximum 500 mots.`
          }]
        })
      });
      const data = await response.json();
      setFicheResult(data.content[0].text);
    } catch {
      setFicheResult('Erreur — vérifiez que le serveur tourne sur port 3001');
    }
    setFicheLoading(false);
  };

  const calculerMoyenne = () => {
    const valides = notes.filter(n => n.note !== '' && n.coeff !== '');
    if (valides.length === 0) return;
    const total = valides.reduce((sum, n) => sum + parseFloat(n.note) * parseFloat(n.coeff), 0);
    const totalCoeff = valides.reduce((sum, n) => sum + parseFloat(n.coeff), 0);
    const moyenne = (total / totalCoeff).toFixed(2);
    let mention = '';
    if (moyenne >= 16) mention = '🏆 Très Bien';
    else if (moyenne >= 14) mention = '🎖️ Bien';
    else if (moyenne >= 12) mention = '✅ Assez Bien';
    else if (moyenne >= 10) mention = '👍 Passable';
    else mention = '❌ Insuffisant';
    setMoyenneResult({ moyenne, mention });
  };

  const ajouterNote = () => setNotes([...notes, { matiere: '', note: '', coeff: '1' }]);
  const supprimerNote = (i) => setNotes(notes.filter((_, idx) => idx !== i));
  const modifierNote = (i, champ, val) => {
    const nouv = [...notes];
    nouv[i][champ] = val;
    setNotes(nouv);
  };

  const genererConseilBienetre = async () => {
  if (!bienetreInput.trim()) return;
  setBienetreLoading(true);
  setBienetreResult('');
  try {
    const categories = {
      stress: 'gestion du stress et de l\'anxiété chez les étudiants',
      temps: 'gestion du temps et organisation du travail étudiant',
      finances: 'précarité financière et gestion du budget étudiant',
    };
    const response = await fetch('https://assistants-app-production.up.railway.app/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: `Tu es un conseiller bienveillant spécialisé dans ${categories[bienetreCategorie]}.

Un étudiant te décrit sa situation : "${bienetreInput}"

Réponds avec :
1. 💙 Validation de sa situation (empathie, 2 phrases)
2. 🛠️ 3-4 conseils pratiques et concrets adaptés à sa situation
3. 📅 Un plan d'action simple pour cette semaine
4. 🆘 Ressources professionnelles si nécessaire

Sois bienveillant, pratique et encourageant. Maximum 300 mots.
IMPORTANT : rappelle toujours qu'un professionnel peut aider si la situation est difficile.`
        }]
      })
    });
    const data = await response.json();
    setBienetreResult(data.content[0].text);
  } catch {
    setBienetreResult('Erreur — vérifiez que le serveur tourne');
  }
  setBienetreLoading(false);
};

  return (
    <div style={{ padding: '10px' }}>
      <button onClick={onBack} style={styles.backBtn}>← Retour</button>

      <div style={{ ...styles.header, background: 'linear-gradient(135deg, #11cdef, #1171ef)' }}>
        <div style={{ fontSize: 48 }}>🎓</div>
        <h2 style={styles.headerTitle}>Assistant Étudiant</h2>
        <p style={styles.headerSub}>Fiches · Pomodoro · Moyenne · Ressources · Bourses</p>
      </div>

      {/* NAVIGATION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 16 }}>
        {[
          { id: 'fiches', label: '🤖 Fiches IA' },
          { id: 'pomodoro', label: '⏱ Pomodoro' },
          { id: 'moyenne', label: '📊 Moyenne' },
          { id: 'ressources', label: '📚 Ressources' },
          { id: 'bourses', label: '💰 Bourses' },
          { id: 'bienetre', label: '🧠 Bien-être' },
        ].map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            style={{ ...styles.navBtn, ...(section === s.id ? styles.navBtnActive : {}), fontSize: 11 }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* FICHES IA */}
      {section === 'fiches' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🤖 Générateur de fiches — Powered by IA</div>
            <input style={styles.input}
              placeholder="Matière (ex: Histoire, Maths, Biologie...)"
              value={ficheMatiere}
              onChange={e => setFicheMatiere(e.target.value)} />
            <textarea style={{ ...styles.input, height: 150, resize: 'vertical' }}
              placeholder="Collez votre cours ici..."
              value={ficheCours}
              onChange={e => setFicheCours(e.target.value)} />
            <button style={styles.searchBtn} onClick={genererFiche} disabled={ficheLoading || !ficheCours}>
              {ficheLoading ? '⏳ Génération en cours...' : '✨ Générer la fiche de révision'}
            </button>
          </div>

          {ficheResult && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>📋 Votre fiche de révision</div>
              <div style={{ ...styles.infoBox, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8, color: '#333' }}>
                {ficheResult}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(ficheResult).then(() => alert('Fiche copiée !'))}
                style={{ ...styles.searchBtn, marginTop: 12, background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                📋 Copier la fiche
              </button>
            </div>
          )}
        </div>
      )}

      {/* POMODORO */}
      {section === 'pomodoro' && (
        <div>
          <div style={{ ...styles.card, textAlign: 'center' }}>
            <div style={styles.cardTitle}>⏱ Minuteur Pomodoro</div>

            <div style={{
              fontSize: 72,
              fontWeight: 900,
              color: pomodoroMode === 'work' ? '#11cdef' : '#27ae60',
              marginBottom: 8,
              fontFamily: 'monospace'
            }}>
              {formatTime(pomodoroTime)}
            </div>

            <div style={{ ...styles.badge, background: pomodoroMode === 'work' ? '#11cdef' : '#27ae60', color: 'white', fontSize: 14, display: 'inline-block', marginBottom: 16 }}>
              {pomodoroMode === 'work' ? '💪 Temps de travail' : '☕ Pause'}
            </div>

            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 20 }}>
              Cycles complétés : {pomodoroCycles} 🍅
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 16 }}>
              <button
                onClick={() => setPomodoroRunning(!pomodoroRunning)}
                style={{ ...styles.searchBtn, width: 'auto', padding: '14px 30px', background: pomodoroRunning ? 'linear-gradient(135deg, #e74c3c, #c0392b)' : 'linear-gradient(135deg, #11cdef, #1171ef)' }}>
                {pomodoroRunning ? '⏸ Pause' : '▶️ Démarrer'}
              </button>
              <button
                onClick={() => { setPomodoroRunning(false); setPomodoroTime(25 * 60); setPomodoroMode('work'); }}
                style={{ ...styles.searchBtn, width: 'auto', padding: '14px 20px', background: 'rgba(255,255,255,0.1)' }}>
                🔄 Reset
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button onClick={() => { setPomodoroRunning(false); setPomodoroTime(25 * 60); setPomodoroMode('work'); }}
                style={{ ...styles.filtreBtn, ...(pomodoroMode === 'work' && pomodoroTime === 25 * 60 ? styles.filtreBtnActive : {}) }}>
                25 min travail
              </button>
              <button onClick={() => { setPomodoroRunning(false); setPomodoroTime(5 * 60); setPomodoroMode('break'); }}
                style={{ ...styles.filtreBtn, ...(pomodoroMode === 'break' && pomodoroTime === 5 * 60 ? styles.filtreBtnActive : {}) }}>
                5 min pause
              </button>
              <button onClick={() => { setPomodoroRunning(false); setPomodoroTime(15 * 60); setPomodoroMode('break'); }}
                style={{ ...styles.filtreBtn }}>
                15 min longue pause
              </button>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>💡 La méthode Pomodoro</div>
            {[
              '🍅 Travaillez 25 minutes sans interruption',
              '☕ Faites une pause de 5 minutes',
              '🔄 Répétez 4 fois',
              '😴 Faites une longue pause de 15-30 minutes',
              '📱 Pas de téléphone pendant le travail !',
            ].map((tip, i) => (
              <div key={i} style={{ ...styles.infoBox, marginBottom: 8 }}>
                <p style={{ fontSize: 13, color: '#333', margin: 0 }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MOYENNE */}
      {section === 'moyenne' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>📊 Calculateur de moyenne</div>

            {notes.map((n, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                <input style={{ ...styles.input, flex: 2, marginBottom: 0 }}
                  placeholder="Matière"
                  value={n.matiere}
                  onChange={e => modifierNote(i, 'matiere', e.target.value)} />
                <input style={{ ...styles.input, flex: 1, marginBottom: 0 }}
                  placeholder="Note"
                  type="number" min="0" max="20"
                  value={n.note}
                  onChange={e => modifierNote(i, 'note', e.target.value)} />
                <input style={{ ...styles.input, flex: 1, marginBottom: 0 }}
                  placeholder="Coeff"
                  type="number" min="1"
                  value={n.coeff}
                  onChange={e => modifierNote(i, 'coeff', e.target.value)} />
                {notes.length > 1 && (
                  <button onClick={() => supprimerNote(i)}
                    style={{ background: 'rgba(231,76,60,0.2)', border: 'none', color: '#e74c3c', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', fontSize: 16 }}>
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button onClick={ajouterNote}
              style={{ ...styles.searchBtn, background: 'rgba(255,255,255,0.1)', marginBottom: 12 }}>
              ➕ Ajouter une matière
            </button>

            <button style={styles.searchBtn} onClick={calculerMoyenne}>
              📊 Calculer ma moyenne
            </button>
          </div>

          {moyenneResult && (
            <div style={styles.card}>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 56, fontWeight: 900, color: '#11cdef' }}>
                  {moyenneResult.moyenne}
                </div>
                <div style={{ color: 'white', fontSize: 14, opacity: 0.6 }}>sur 20</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'white', marginTop: 8 }}>
                  {moyenneResult.mention}
                </div>
              </div>
              <div style={styles.infoBox}>
                {notes.filter(n => n.note && n.coeff).map((n, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#333', marginBottom: 4 }}>
                    <span>{n.matiere || `Matière ${i + 1}`}</span>
                    <span>{n.note}/20 (coeff {n.coeff})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* RESSOURCES */}
      {section === 'ressources' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>📚 Rechercher des ressources</div>
            <input style={styles.input}
              placeholder="Ex: trigonométrie, révolution française, photosynthèse..."
              value={ressourceSearch}
              onChange={e => setRessourceSearch(e.target.value)} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href={`https://fr.khanacademy.org/search?page_search_query=${encodeURIComponent(ressourceSearch)}`}
                target="_blank" rel="noreferrer"
                style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: 'linear-gradient(135deg, #27ae60, #1e8449)' }}>
                🎓 Khan Academy
              </a>
              <a href={`https://www.youtube.com/results?search_query=cours+${encodeURIComponent(ressourceSearch)}`}
                target="_blank" rel="noreferrer"
                style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}>
                ▶️ YouTube — Cours
              </a>
              <a href={`https://fr.wikipedia.org/wiki/${encodeURIComponent(ressourceSearch)}`}
                target="_blank" rel="noreferrer"
                style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                📖 Wikipedia
              </a>
              <a href={`https://www.lumni.fr/recherche?q=${encodeURIComponent(ressourceSearch)}`}
                target="_blank" rel="noreferrer"
                style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: 'linear-gradient(135deg, #f39c12, #e67e22)' }}>
                📺 Lumni (France TV)
              </a>
              <a href={`https://www.cours-gratuit.com/?s=${encodeURIComponent(ressourceSearch)}`}
                target="_blank" rel="noreferrer"
                style={{ ...styles.searchBtn, textDecoration: 'none', textAlign: 'center', background: 'linear-gradient(135deg, #11cdef, #1171ef)' }}>
                📝 Cours Gratuit
              </a>
            </div>
          </div>
        </div>
      )}

      {/* BOURSES */}
      {section === 'bourses' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>💰 Aides et bourses étudiantes</div>

            {[
              { titre: '🎓 Bourse CROUS', desc: 'Bourse sur critères sociaux — de 0 à 7 échelons', lien: 'https://www.messervices.etudiant.gouv.fr', bouton: 'Faire une demande' },
              { titre: '🏠 APL Etudiant', desc: 'Aide au logement de la CAF', lien: 'https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/logement/l-aide-personnalisee-au-logement-apl', bouton: 'Simuler mes droits' },
              { titre: '🍽 Repas CROUS 1€', desc: 'Repas à 1€ dans les restaurants universitaires', lien: 'https://www.etudiant.gouv.fr', bouton: 'En savoir plus' },
              { titre: '💊 Complémentaire santé', desc: 'CSS — ancienne CMU-C, gratuite sous conditions', lien: 'https://www.ameli.fr', bouton: 'Vérifier mes droits' },
              { titre: '🚌 Réductions transport', desc: 'Carte jeune SNCF, réductions régionales', lien: 'https://www.sncf.com/fr/offres-voyageurs/jeunes', bouton: 'Voir les offres' },
              { titre: '💻 Aide PC étudiant', desc: 'Prêt à taux zéro pour équipement informatique', lien: 'https://www.etudiant.gouv.fr', bouton: 'En savoir plus' },
              { titre: '🌍 Erasmus+', desc: 'Bourse pour étudier en Europe', lien: 'https://info.erasmusplus.fr', bouton: 'Découvrir Erasmus' },
              { titre: '🔍 1jeune1solution', desc: 'Toutes les aides pour les jeunes en un seul endroit', lien: 'https://www.etudiant.gouv.fr', bouton: 'Explorer les aides' },
            ].map((aide, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ color: 'white', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{aide.titre}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 8 }}>{aide.desc}</div>
                <a href={aide.lien} target="_blank" rel="noreferrer"
                  style={{ ...styles.searchBtn, display: 'block', textAlign: 'center', textDecoration: 'none', padding: '10px', fontSize: 13 }}>
                  {aide.bouton} →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BIEN-ÊTRE */}
{section === 'bienetre' && (
  <div>
    <div style={styles.card}>
      <div style={styles.cardTitle}>🧠 Espace Bien-être Étudiant</div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[
          { id: 'stress', label: '😰 Stress' },
          { id: 'temps', label: '⏰ Temps' },
          { id: 'finances', label: '💰 Finances' },
        ].map(c => (
          <button key={c.id} onClick={() => { setBienetreCategorie(c.id); setBienetreResult(''); }}
            style={{ ...styles.filtreBtn, flex: 1, ...(bienetreCategorie === c.id ? styles.filtreBtnActive : {}) }}>
            {c.label}
          </button>
        ))}
      </div>

      <div style={{ ...styles.infoBox, marginBottom: 12 }}>
        <p style={{ fontSize: 13, color: '#333', margin: 0 }}>
          {bienetreCategorie === 'stress' && '😰 Décris ce qui te stresse — examens, pression, anxiété...'}
          {bienetreCategorie === 'temps' && '⏰ Décris ta situation — cours, travail, activités, manque de temps...'}
          {bienetreCategorie === 'finances' && '💰 Décris ta situation financière — loyer, bourses, petits boulots...'}
        </p>
      </div>

      <textarea style={{ ...styles.input, height: 120, resize: 'vertical' }}
        placeholder="Décris ta situation..."
        value={bienetreInput}
        onChange={e => setBienetreInput(e.target.value)} />

      <button style={styles.searchBtn} onClick={genererConseilBienetre}
        disabled={bienetreLoading || !bienetreInput}>
        {bienetreLoading ? '⏳ Analyse en cours...' : '💙 Obtenir des conseils'}
      </button>
    </div>

    {bienetreResult && (
      <div style={styles.card}>
        <div style={styles.cardTitle}>💙 Conseils personnalisés</div>
        <div style={{ ...styles.infoBox, whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8, color: '#333' }}>
          {bienetreResult}
        </div>
      </div>
    )}

    {/* RESSOURCES URGENCE */}
    <div style={{ ...styles.card, background: 'rgba(17,205,239,0.08)', border: '1px solid rgba(17,205,239,0.2)' }}>
      <div style={styles.cardTitle}>🆘 Ressources d'aide</div>
      {[
        { label: '📞 Nightline — Écoute étudiante', numero: '0800 235 236', desc: 'Gratuit, anonyme, par des étudiants', lien: 'https://www.nightline.fr' },
        { label: '📞 3114 — Prévention suicide', numero: '3114', desc: 'Numéro national, 24h/24', lien: 'tel:3114' },
        { label: '🏥 BAPU — Soin psy étudiant', numero: '', desc: 'Consultation psychologique gratuite', lien: 'https://www.etudiant.gouv.fr/fr/sante-et-social-1#sante-mentale' },
        { label: '💰 Aide d\'urgence CROUS', numero: '', desc: 'Aide financière exceptionnelle', lien: 'https://www.messervices.etudiant.gouv.fr' },
      ].map((r, i) => (
        <a key={i} href={r.lien} target="_blank" rel="noreferrer"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '12px 14px', marginBottom: 8, textDecoration: 'none' }}>
          <div>
            <div style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>{r.label}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{r.desc}</div>
          </div>
          {r.numero && <span style={{ ...styles.badge, background: '#11cdef', color: 'white' }}>{r.numero}</span>}
        </a>
      ))}
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
  searchBtn: { width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #11cdef, #1171ef)', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  navBtn: { padding: '10px 6px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 12, fontWeight: 600 },
  navBtnActive: { background: 'rgba(17,205,239,0.2)', color: '#11cdef', border: '1px solid #11cdef' },
  badge: { padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  infoBox: { background: 'linear-gradient(135deg, #f8f9ff, #f3e8ff)', borderRadius: 12, padding: 16 },
  filtreBtn: { padding: '8px 12px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 12 },
  filtreBtnActive: { background: 'rgba(17,205,239,0.2)', color: '#11cdef', border: '1px solid #11cdef' },
};