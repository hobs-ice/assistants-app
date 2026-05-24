import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const allergenes = [
  { id: 'gluten', label: 'Sans gluten', emoji: '🌾' },
  { id: 'lactose', label: 'Sans lactose', emoji: '🥛' },
  { id: 'oeuf', label: 'Sans œuf', emoji: '🥚' },
  { id: 'arachide', label: 'Sans arachide', emoji: '🥜' },
  { id: 'crustace', label: 'Sans crustacé', emoji: '🦞' },
  { id: 'oxalate', label: 'Sans oxalate', emoji: '🫘' },
  { id: 'soja', label: 'Sans soja', emoji: '🌱' },
  { id: 'fruit_sec', label: 'Sans fruits à coque', emoji: '🌰' },
];

const objectifs = [
  { id: 'perte_poids', label: 'Perte de poids', emoji: '⚖️', multiplicateur: 0.8 },
  { id: 'maintien', label: 'Maintien', emoji: '🎯', multiplicateur: 1.0 },
  { id: 'muscle', label: 'Prise de muscle', emoji: '💪', multiplicateur: 1.2 },
  { id: 'endurance', label: 'Endurance', emoji: '🏃', multiplicateur: 1.1 },
];

const niveauxActivite = [
  { id: 'sedentaire', label: 'Sédentaire', desc: 'Peu ou pas d\'exercice', facteur: 1.2 },
  { id: 'leger', label: 'Légèrement actif', desc: '1-3 jours/semaine', facteur: 1.375 },
  { id: 'modere', label: 'Modérément actif', desc: '3-5 jours/semaine', facteur: 1.55 },
  { id: 'actif', label: 'Très actif', desc: '6-7 jours/semaine', facteur: 1.725 },
  { id: 'extreme', label: 'Extrêmement actif', desc: 'Athlète professionnel', facteur: 1.9 },
];



const alimOxalate = {
  eleve: [
    'épinards', 'betterave', 'chocolat noir', 'noix', 'rhubarbe',
    'amandes', 'cacahuètes', 'patate douce', 'figue', 'mûres',
    'framboises', 'kiwi', 'poireaux', 'blettes', 'persil',
    'cacao', 'thé noir', 'café', 'soja', 'tofu',
    'sarrasin', 'quinoa', 'graines de sésame', 'tahini', 'curry',
  ],
  moyen: [
    'haricots verts', 'carottes', 'céleri', 'abricots', 'oranges',
    'fraises', 'asperges', 'brocoli', 'chou-fleur', 'maïs',
    'tomates', 'aubergines', 'poivrons', 'petits pois', 'lentilles',
    'pois chiches', 'pain complet', 'riz brun', 'avoine', 'mûres',
    'ananas', 'mangue', 'pêches', 'prunes', 'raisins',
  ],
  faible: [
    'chou', 'courgette', 'concombre', 'pomme', 'banane',
    'riz blanc', 'poulet', 'poisson', 'œufs', 'lait',
    'fromage', 'yaourt', 'beurre', 'huile d\'olive', 'avocat',
    'melon', 'pastèque', 'poire', 'cerise', 'myrtilles',
    'champignons', 'ail', 'oignon', 'pomme de terre', 'patate douce cuite',
    'pain blanc', 'pâtes blanches', 'semoule', 'bœuf', 'agneau',
  ],
};



export default function Nutrition({ onBack }) {
  const [section, setSection] = useState('imc');
  const [poids, setPoids] = useState('');
  const [taille, setTaille] = useState('');
  const [age, setAge] = useState('');
  const [sexe, setSexe] = useState('homme');
  const [activite, setActivite] = useState('modere');
  const [objectif, setObjectif] = useState('maintien');
  const [imcResult, setImcResult] = useState(null);
  const [searchAlim, setSearchAlim] = useState('');
  const [alimResult, setAlimResult] = useState(null);
  const [alimLoading, setAlimLoading] = useState(false);
  const [sourceAlim, setSourceAlim] = useState('us');
  const [scannerActif, setScannerActif] = useState(false);
  const [filtres, setFiltres] = useState([]);
  const [recetteDetail, setRecetteDetail] = useState(null);

  const [recettes, setRecettes] = useState([]);
  const [recettesLoading, setRecettesLoading] = useState(false);
  const [rechercheEffectuee, setRechercheEffectuee] = useState(false);
  const calculerIMC = () => {
    if (!poids || !taille || !age) return;
    const tailleM = taille / 100;
    const imc = (poids / (tailleM * tailleM)).toFixed(1);
    const niveauAct = niveauxActivite.find(n => n.id === activite);
    const obj = objectifs.find(o => o.id === objectif);

    

    let bmr;
    if (sexe === 'homme') {
      bmr = 10 * poids + 6.25 * taille - 5 * age + 5;
    } else {
      bmr = 10 * poids + 6.25 * taille - 5 * age - 161;
    }
    const tdee = Math.round(bmr * niveauAct.facteur * obj.multiplicateur);

    let categorie, couleur, conseil;
    if (imc < 18.5) { categorie = 'Insuffisance pondérale'; couleur = '#3498db'; conseil = 'Augmentez vos apports caloriques progressivement'; }
    else if (imc < 25) { categorie = 'Poids normal ✅'; couleur = '#27ae60'; conseil = 'Maintenez vos habitudes alimentaires actuelles'; }
    else if (imc < 30) { categorie = 'Surpoids'; couleur = '#f39c12'; conseil = 'Réduisez légèrement les apports et augmentez l\'activité'; }
    else { categorie = 'Obésité'; couleur = '#e74c3c'; conseil = 'Consultez un médecin ou nutritionniste'; }

<div style={{ ...styles.card, marginTop: 10, background: 'rgba(67,233,123,0.08)', border: '1px solid rgba(67,233,123,0.2)' }}>
  <p style={{ color: '#43e97b', fontSize: 14, textAlign: 'center', lineHeight: 1.7, margin: 0 }}>
    💡 <strong>Conseil :</strong> {imcResult?.conseil}
  </p>
</div>

    setImcResult({ imc, categorie, couleur, tdee, conseil, proteines: Math.round(poids * 1.6), glucides: Math.round(tdee * 0.5 / 4), lipides: Math.round(tdee * 0.3 / 9) });
  };



  const toggleFiltre = (id) => {
    setFiltres(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

 
useEffect(() => {
  if (sourceAlim === 'scanner' && scannerActif) {
    const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 250 });
    scanner.render(
      async (barcode) => {
        scanner.clear();
        setScannerActif(false);
        setAlimLoading(true);
        try {
          const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
          const data = await res.json();
          if (data.status === 1) {
            setAlimResult(data.product);
          } else {
            setAlimResult('notfound');
          }
        } catch {
          setAlimResult('unavailable');
        }
        setAlimLoading(false);
      },
      () => {}
    );
    return () => scanner.clear().catch(() => {});
  }
}, [sourceAlim, scannerActif]);


const rechercherAlimentUS = async () => {
  if (!searchAlim.trim()) return;
  setAlimLoading(true);
  setAlimResult(null);
  try {
    const API_KEY = 'Ght3P3Aks7oZuyvCEg0FIb5Koib46xA8WRiE7fVe';
    const res = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(searchAlim)}&api_key=${API_KEY}&pageSize=1&dataType=Foundation,SR%20Legacy`
    );
    const data = await res.json();
    if (data.foods && data.foods.length > 0) {
      const food = data.foods[0];
      const getNutrient = (id) => {
        const n = food.foodNutrients?.find(n => n.nutrientId === id);
        return n ? n.value : null;
      };
      setAlimResult({
        product_name: food.description,
        brands: 'USDA FoodData',
        nutriments: {
          'energy-kcal_100g': getNutrient(1008),
          'proteins_100g': getNutrient(1003),
          'carbohydrates_100g': getNutrient(1005),
          'fat_100g': getNutrient(1004),
          'fiber_100g': getNutrient(1079),
          'salt_100g': getNutrient(1093),
        }
      });
    } else {
      setAlimResult('notfound');
    }
  } catch {
    setAlimResult('unavailable');
  }
  setAlimLoading(false);
};

const categoriesParObjectif = {
  perte_poids: ['Vegetarian', 'Vegan', 'Side'],
  maintien: ['Chicken', 'Seafood', 'Pasta'],
  muscle: ['Beef', 'Chicken', 'Lamb'],
  endurance: ['Pasta', 'Miscellaneous', 'Breakfast'],
};

const rechercherRecettes = async () => {
  setRechercheEffectuee(true);
    setRecettesLoading(true);
  setRecettes([]);
  setRecetteDetail(null);
  try {
    const categories = categoriesParObjectif[objectif] || ['Chicken'];
    const categorie = categories[Math.floor(Math.random() * categories.length)];
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categorie}`
    );
    const data = await res.json();
    if (data.meals) {
      const melange = data.meals.sort(() => Math.random() - 0.5).slice(0, 20);

      // Charger le détail de chaque recette pour filtrer les allergènes
      const details = await Promise.all(
        melange.map(async (m) => {
          try {
            const r = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${m.idMeal}`);
            const d = await r.json();
            return d.meals?.[0] || null;
          } catch { return null; }
        })
      );

      // Mots clés allergènes à détecter dans les ingrédients
      const motsAllergenes = {
        gluten: ['flour', 'bread', 'wheat', 'pasta', 'spaghetti', 'noodle', 'barley', 'couscous', 'soy sauce', 'farine', 'pain', 'pâtes', 'orge', 'seigle', 'tagliatelle', 'penne', 'fusilli', 'lasagne', 'tortilla', 'breadcrumb', 'cracker'],
        lactose: ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'halloumi', 'parmesan', 'mozzarella', 'cheddar', 'brie', 'camembert', 'ricotta', 'feta', 'gouda', 'lait', 'fromage', 'beurre', 'crème', 'yaourt', 'ghee', 'whey'],
        oeuf: ['egg', 'eggs', 'oeuf', 'oeufs'],
        arachide: ['peanut', 'peanuts', 'cacahuète', 'arachide'],
        crustace: ['shrimp', 'prawn', 'lobster', 'crab', 'crevette', 'homard', 'crabe'],
        soja: ['soy', 'tofu', 'soya', 'soja'],
        fruit_sec: ['almond', 'walnut', 'cashew', 'pistachio', 'pecan', 'amande', 'noix', 'pistache'],
        oxalate: ['spinach', 'chocolate', 'cocoa', 'beet', 'rhubarb', 'épinards', 'chocolat', 'betterave'],
      };

      // Filtrer les recettes selon les allergènes sélectionnés
      const filtrees = details.filter(recette => {
        if (!recette) return false;
        if (filtres.length === 0) return true;

        // Récupérer tous les ingrédients de la recette
        const ingredients = Array.from({ length: 20 }, (_, i) => i + 1)
          .map(i => (recette[`strIngredient${i}`] || '').toLowerCase())
          .filter(Boolean)
          .join(' ');

        // Vérifier qu'aucun allergène filtré n'est présent
        return filtres.every(filtre => {
          const mots = motsAllergenes[filtre] || [];
          return !mots.some(mot => ingredients.includes(mot));
        });
      });

      setRecettes(filtrees.slice(0, 10));
    }
  } catch {
    setRecettes([]);
  }
  setRecettesLoading(false);
};



  return (
    <div style={{ padding: '10px' }}>
      <button onClick={onBack} style={styles.backBtn}>← Retour</button>

      <div style={{ ...styles.header, background: 'linear-gradient(135deg, #43e97b, #38f9d7)' }}>
        <div style={{ fontSize: 48 }}>🥗</div>
        <h2 style={{ ...styles.headerTitle, color: '#1a1a2e' }}>Assistant Nutrition</h2>
        <p style={{ ...styles.headerSub, color: 'rgba(0,0,0,0.6)' }}>IMC · Calories · Aliments · Recettes healthy</p>
      </div>


      {/* NAVIGATION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6, marginBottom: 16 }}>
        {[
          { id: 'imc', label: '📊 IMC' },
          { id: 'aliment', label: '🔍 Aliment' },
          { id: 'recettes', label: '🍳 Recettes' },
          { id: 'oxalate', label: '🫘 Oxalates' },
        ].map((s) => (
          <button key={s.id} onClick={() => setSection(s.id)}
            style={{ ...styles.navBtn, ...(section === s.id ? styles.navBtnActive : {}), fontSize: 11 }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* IMC & CALORIES */}
      {section === 'imc' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>📊 Calculateur IMC & Calories</div>

            <div style={styles.row}>
              <button style={{ ...styles.sexeBtn, ...(sexe === 'homme' ? styles.sexeBtnActive : {}) }} onClick={() => setSexe('homme')}>👨 Homme</button>
              <button style={{ ...styles.sexeBtn, ...(sexe === 'femme' ? styles.sexeBtnActive : {}) }} onClick={() => setSexe('femme')}>👩 Femme</button>
            </div>

            <div style={styles.row}>
              <input style={{ ...styles.input, flex: 1 }} placeholder="Poids (kg)" type="number" value={poids} onChange={e => setPoids(e.target.value)} />
              <input style={{ ...styles.input, flex: 1 }} placeholder="Taille (cm)" type="number" value={taille} onChange={e => setTaille(e.target.value)} />
              <input style={{ ...styles.input, flex: 1 }} placeholder="Âge" type="number" value={age} onChange={e => setAge(e.target.value)} />
            </div>

            <div style={styles.cardTitle}>🏃 Niveau d'activité</div>
            {niveauxActivite.map(n => (
              <button key={n.id} onClick={() => setActivite(n.id)}
                style={{ ...styles.optionBtn, ...(activite === n.id ? styles.optionBtnActive : {}) }}>
                <span style={{ fontWeight: 700 }}>{n.label}</span>
                <span style={{ opacity: 0.6, fontSize: 12 }}>{n.desc}</span>
              </button>
            ))}

            <div style={{ ...styles.cardTitle, marginTop: 12 }}>🎯 Objectif</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {objectifs.map(o => (
                <button key={o.id} onClick={() => setObjectif(o.id)}
                  style={{ ...styles.objectifBtn, ...(objectif === o.id ? styles.objectifBtnActive : {}) }}>
                  {o.emoji} {o.label}
                </button>
              ))}
            </div>

            <button style={{ ...styles.searchBtn, marginTop: 16 }} onClick={calculerIMC}>
              Calculer 📊
            </button>
          </div>

          {imcResult && (
            <div style={styles.card}>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: imcResult.couleur }}>
                  {imcResult.imc}
                </div>
                <div style={{ color: imcResult.couleur, fontWeight: 700, fontSize: 18 }}>
                  {imcResult.categorie}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={styles.macroBox}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#43e97b' }}>{imcResult.tdee}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Calories/jour</div>
                </div>
                <div style={styles.macroBox}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#667eea' }}>{imcResult.proteines}g</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Protéines/jour</div>
                </div>
                <div style={styles.macroBox}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#f39c12' }}>{imcResult.glucides}g</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Glucides/jour</div>
                </div>
                <div style={styles.macroBox}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#e74c3c' }}>{imcResult.lipides}g</div>
                  <div style={{ marginTop: 10, background: 'rgba(67,233,123,0.08)', border: '1px solid rgba(67,233,123,0.2)', borderRadius: 12, padding: 14 }}>
  <p style={{ color: '#43e97b', fontSize: 14, textAlign: 'center', lineHeight: 1.7, margin: 0 }}>
    💡 <strong>Conseil :</strong> {imcResult.conseil}
  </p>
</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Lipides/jour</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* RECHERCHE ALIMENT */}
      {section === 'aliment' && (
  <div>
    {/* ONGLETS SOURCE */}
    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      {[
        
        { id: 'us', label: '🇺🇸 Aliments US', desc: 'USDA FoodData' },
        { id: 'scanner', label: '📱 Scanner', desc: 'Code barre' },
      ].map(o => (
        <button key={o.id} onClick={() => { setSourceAlim(o.id); setAlimResult(null); setSearchAlim(''); }}
          style={{ ...styles.navBtn, flex: 1, ...(sourceAlim === o.id ? styles.navBtnActive : {}) }}>
          {o.label}<br />
          <span style={{ fontSize: 10, opacity: 0.6 }}>{o.desc}</span>
        </button>
      ))}
    </div>


    {/* RECHERCHE US */}
    {sourceAlim === 'us' && (
      <div style={styles.card}>
        <div style={styles.cardTitle}>🇺🇸 Recherche USDA FoodData</div>
        <input
          style={styles.input}
          placeholder="Ex: banana, chicken, brown rice, apple..."
          value={searchAlim}
          onChange={e => setSearchAlim(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && rechercherAlimentUS()}
        />
        <button style={styles.searchBtn} onClick={rechercherAlimentUS} disabled={alimLoading}>
          {alimLoading ? '⏳ Recherche...' : 'Rechercher 🔍'}
        </button>
        <div style={{ marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
          Source : USDA FoodData — base nutritionnelle officielle américaine
        </div>
      </div>
    )}



    {/* SCANNER */}
   {sourceAlim === 'scanner' && (
  <div style={styles.card}>
    <div style={styles.cardTitle}>📱 Scanner un code barre</div>
    {!scannerActif ? (
      <button style={styles.searchBtn} onClick={() => { setAlimResult(null); setScannerActif(true); }}>
        📷 Activer la caméra
      </button>
    ) : (
      <>
        <div id="qr-reader" style={{ width: '100%', borderRadius: 12, overflow: 'hidden' }}></div>
        <button style={{ ...styles.searchBtn, background: 'rgba(255,255,255,0.1)', marginTop: 10 }}
          onClick={() => setScannerActif(false)}>
          ✖ Annuler
        </button>
      </>
    )}
    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, textAlign: 'center', marginTop: 12 }}>
      Pointez la caméra vers le code barre du produit
    </p>
  </div>
)}

    {/* RÉSULTATS */}
    {alimResult === 'notfound' && (
      <div style={styles.card}>
        <p style={{ color: '#f5365c', textAlign: 'center' }}>❌ Aliment non trouvé</p>
      </div>
    )}

    {alimResult === 'unavailable' && (
      <div style={styles.card}>
        <p style={{ color: '#f39c12', textAlign: 'center', marginBottom: 12 }}>
          ⚠️ Service temporairement indisponible
        </p>
        <a href={`https://fr.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchAlim)}`}
          target="_blank" rel="noreferrer"
          style={{ ...styles.searchBtn, display: 'block', textAlign: 'center', textDecoration: 'none' }}>
          🔍 Rechercher sur Open Food Facts
        </a>
      </div>
    )}

    {alimResult && alimResult !== 'notfound' && alimResult !== 'unavailable' && (
      <div style={styles.card}>
        <div style={{ color: 'white', fontSize: 20, fontWeight: 800, marginBottom: 4 }}>
          {alimResult.product_name_fr || alimResult.product_name || searchAlim}
        </div>
        {alimResult.brands && (
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 12 }}>
            {alimResult.brands}
          </div>
        )}
        {alimResult.nutriments && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: '🔥 Calories', val: alimResult.nutriments['energy-kcal_100g'], unit: 'kcal/100g', color: '#e74c3c' },
              { label: '🥩 Protéines', val: alimResult.nutriments['proteins_100g'], unit: 'g/100g', color: '#667eea' },
              { label: '🍞 Glucides', val: alimResult.nutriments['carbohydrates_100g'], unit: 'g/100g', color: '#f39c12' },
              { label: '🧈 Lipides', val: alimResult.nutriments['fat_100g'], unit: 'g/100g', color: '#e67e22' },
              { label: '🌿 Fibres', val: alimResult.nutriments['fiber_100g'], unit: 'g/100g', color: '#27ae60' },
              { label: '🧂 Sel', val: alimResult.nutriments['salt_100g'], unit: 'g/100g', color: '#95a5a6' },
            ].map((n, i) => n.val !== undefined && n.val !== null && (
              <div key={i} style={styles.macroBox}>
                <div style={{ fontSize: 20, fontWeight: 800, color: n.color }}>{Number(n.val).toFixed(1)}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{n.label}</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{n.unit}</div>
              </div>
            ))}
          </div>
        )}
        {alimResult.nutriscore_grade && (
          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <span style={{
              background: alimResult.nutriscore_grade === 'a' ? '#27ae60' : alimResult.nutriscore_grade === 'b' ? '#8bc34a' : alimResult.nutriscore_grade === 'c' ? '#f39c12' : alimResult.nutriscore_grade === 'd' ? '#e67e22' : '#e74c3c',
              color: 'white', padding: '6px 16px', borderRadius: 20, fontWeight: 800, fontSize: 16,
            }}>
              Nutri-Score {alimResult.nutriscore_grade.toUpperCase()}
            </span>
          </div>
        )}
      </div>
    )}
  </div>
)}

      {/* RECETTES */}
      {section === 'recettes' && (
  <div>
    <div style={styles.card}>
      <div style={styles.cardTitle}>🎯 Objectif</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        {objectifs.map(o => (
          <button key={o.id} onClick={() => { setObjectif(o.id); setRecettes([]); setRecetteDetail(null); }}
            style={{ ...styles.objectifBtn, ...(objectif === o.id ? styles.objectifBtnActive : {}) }}>
            {o.emoji} {o.label}
          </button>
        ))}
      </div>

      <div style={styles.cardTitle}>🚫 Filtres allergènes</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {allergenes.map(a => (
          <button key={a.id} onClick={() => toggleFiltre(a.id)}
            style={{ ...styles.filtreBtn, ...(filtres.includes(a.id) ? styles.filtreBtnActive : {}) }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>

      <button style={styles.searchBtn} onClick={rechercherRecettes} disabled={recettesLoading}>
        {recettesLoading ? '⏳ Chargement...' : '🍳 Trouver des recettes'}
      </button>
    </div>

    {recetteDetail ? (
      <div style={styles.card}>
        <button onClick={() => setRecetteDetail(null)} style={{ ...styles.backBtn, marginBottom: 12 }}>
          ← Retour
        </button>
        {recetteDetail.strMealThumb && (
          <img src={recetteDetail.strMealThumb} alt={recetteDetail.strMeal}
            style={{ width: '100%', borderRadius: 12, marginBottom: 16, objectFit: 'cover', height: 200 }} />
        )}
        <div style={{ color: 'white', fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
          {recetteDetail.strMeal}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {recetteDetail.strCategory && (
            <span style={{ ...styles.badge, background: '#43e97b', color: '#1a1a2e' }}>
              🍽 {recetteDetail.strCategory}
            </span>
          )}
          {recetteDetail.strArea && (
            <span style={{ ...styles.badge, background: '#667eea', color: 'white' }}>
              🌍 {recetteDetail.strArea}
            </span>
          )}
        </div>

        <div style={styles.cardTitle}>🛒 Ingrédients</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          {Array.from({ length: 20 }, (_, i) => i + 1)
            .filter(i => recetteDetail[`strIngredient${i}`])
            .map(i => (
              <div key={i} style={styles.etapeBox}>
                <p style={{ margin: 0, fontSize: 14, color: '#333' }}>
                  • {recetteDetail[`strIngredient${i}`]} — {recetteDetail[`strMeasure${i}`]}
                </p>
              </div>
            ))}
        </div>

        <div style={styles.cardTitle}>👨‍🍳 Préparation</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {recetteDetail.strInstructions?.split('\n').filter(s => s.trim()).map((etape, i) => (
            <div key={i} style={{ ...styles.etapeBox, display: 'flex', gap: 10 }}>
              <span style={{ fontWeight: 800, color: '#43e97b', minWidth: 20 }}>{i + 1}</span>
              <p style={{ margin: 0, fontSize: 14, color: '#333' }}>{etape}</p>
            </div>
          ))}
        </div>

        {recetteDetail.strYoutube && (
          <a href={recetteDetail.strYoutube} target="_blank" rel="noreferrer"
            style={{ ...styles.searchBtn, display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: 16 }}>
            ▶️ Voir la vidéo YouTube
          </a>
        )}
      </div>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {recettes.length === 0 && !recettesLoading && (
  <div style={styles.card}>
    <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 1.8 }}>
      {!rechercheEffectuee
        ? '🍳 Choisissez un objectif et cliquez sur "Trouver des recettes"'
        : filtres.length > 0
          ? `😔 Aucune recette trouvée avec ${filtres.length} filtre(s) actif(s) — essayez de réduire les filtres`
          : '😔 Aucune recette trouvée — réessayez'
      }
    </p>
  </div>
)}
        {recettes.map((r, i) => (
  <button key={i} onClick={() => setRecetteDetail(r)} style={styles.recetteBtn}>
            {r.strMealThumb && (
              <img src={r.strMealThumb} alt={r.strMeal}
                style={{ width: 60, height: 60, borderRadius: 10, objectFit: 'cover' }} />
            )}
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>{r.strMeal}</div>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>›</span>
          </button>
        ))}
      </div>
    )}
  </div>
)}

      {/* OXALATES */}
      {section === 'oxalate' && (
        <div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>🫘 Guide des oxalates</div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
              Les oxalates sont des composés naturels présents dans certains aliments. Une consommation élevée peut favoriser les calculs rénaux chez les personnes sensibles.
            </p>

            {[
              { niveau: '🔴 Oxalate élevé', desc: 'À limiter si sensible', aliments: alimOxalate.eleve, color: '#e74c3c' },
              { niveau: '🟠 Oxalate moyen', desc: 'Consommer avec modération', aliments: alimOxalate.moyen, color: '#e67e22' },
              { niveau: '🟢 Oxalate faible', desc: 'Sans restriction', aliments: alimOxalate.faible, color: '#27ae60' },
            ].map((cat, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ color: cat.color, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{cat.niveau}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 8 }}>{cat.desc}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {cat.aliments.map((a, j) => (
                    <span key={j} style={{ ...styles.badge, background: cat.color + '22', color: cat.color, border: `1px solid ${cat.color}44` }}>
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 14, marginTop: 8 }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, margin: 0, lineHeight: 1.7 }}>
                💡 <strong style={{ color: 'white' }}>Conseil :</strong> Boire beaucoup d'eau (2L/jour minimum) aide à réduire le risque de calculs rénaux indépendamment des oxalates.
              </p>
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
  headerTitle: { fontSize: 24, fontWeight: 700, margin: '10px 0 6px' },
  headerSub: { fontSize: 14 },
  card: { background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 20, marginBottom: 16, backdropFilter: 'blur(10px)' },
  cardTitle: { color: 'white', fontSize: 16, fontWeight: 700, marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 8 },
  input: { width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: 15, marginBottom: 12, outline: 'none' },
  row: { display: 'flex', gap: 8, marginBottom: 12 },
  searchBtn: { width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #43e97b, #38f9d7)', color: '#1a1a2e', fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  navBtn: { padding: '10px 6px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 12, fontWeight: 600 },
  navBtnActive: { background: 'rgba(67,233,123,0.2)', color: '#43e97b', border: '1px solid #43e97b' },
  sexeBtn: { flex: 1, padding: '10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14 },
  sexeBtnActive: { background: 'rgba(67,233,123,0.2)', color: '#43e97b', border: '1px solid #43e97b' },
  optionBtn: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: 'white', cursor: 'pointer', marginBottom: 6, fontSize: 13 },
  optionBtnActive: { background: 'rgba(67,233,123,0.15)', border: '1px solid #43e97b' },
  objectifBtn: { padding: '12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  objectifBtnActive: { background: 'rgba(67,233,123,0.2)', color: '#43e97b', border: '1px solid #43e97b' },
  macroBox: { background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '14px', textAlign: 'center' },
  filtreBtn: { padding: '8px 12px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 12 },
  filtreBtnActive: { background: 'rgba(231,76,60,0.2)', color: '#e74c3c', border: '1px solid #e74c3c' },
  recetteBtn: { display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: '16px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', width: '100%' },
  badge: { padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  etapeBox: { background: 'white', borderRadius: 10, padding: '12px 16px' },
};