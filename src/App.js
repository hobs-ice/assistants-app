import React, { useState, useEffect } from 'react';
import './App.css';
import Medicaments from './Medicaments';
import Urgences from './Urgences';
import Nutrition from './Nutrition';
import Emploi from './Emploi';
import Films from './Films';
import Etudiant from './Etudiant';
import Business from './Business';
import Sport from './Sport';
import Game from './Game';
import Vehicule from './Vehicule';
import Justice from './Justice';
import { supabase } from './supabase';


import Auth from './Auth';
import Voyage from './Voyage';
import Permis from './Permis';




const assistants = [
  { id: 'medicaments', emoji: '💊', title: 'Médicaments', desc: 'Posologie, recommandations, pharmacies', color: '#667eea' },
  { id: 'nutrition', emoji: '🥗', title: 'Nutrition', desc: 'Calories, aliments, conseils nutritionnels', color: '#43e97b' },
  { id: 'urgences', emoji: '🚨', title: 'Urgences', desc: 'Premiers secours, numéros utiles', color: '#f5365c' },
  { id: 'emploi', emoji: '💼', title: 'Emploi', desc: 'CV, offres, conseils carrière', color: '#fb6340' },
  { id: 'films', emoji: '🎭', title: 'Audiovisuel', desc: 'Films, Séries, Acteurs, Musique', color: '#8965e0' },
  { id: 'etudiant', emoji: '🎓', title: 'Étudiant', desc: 'Cours, révisions, organisation', color: '#11cdef' },
  { id: 'business', emoji: '📈', title: 'Business', desc: 'Stratégie, finances, marketing', color: '#2dce89' },
  { id: 'sport', emoji: '🏅', title: 'Sport', desc: 'Résultats, palmarès, coaching', color: '#f5365c' },
  { id: 'game', emoji: '🎮', title: 'Gaming', desc: 'Jeux, Esports, IA Gaming', color: '#7928ca' },
  { id: 'vehicule', emoji: '🚗', title: 'Véhicule', desc: 'F1, Mécanicien IA, VIN, Auto', color: '#e74c3c' },
  { id: 'justice', emoji: '⚖️', title: 'Justice', desc: 'Avocat IA · Lois · Courriers', color: '#1a1a2e' },
  { id: 'voyage', emoji: '✈️', title: 'Voyage', desc: 'Budget, destinations, conseils', color: '#00b4d8' },
  { id: 'permis', emoji: '🪪', title: 'Permis',
 desc: 'Code, manœuvres, auto-écoles, conseils', color: '#2196f3' },


];



function Home({ onSelect, onSubscribe, hasAccess, onLogout, trialExpired, isPremium, userEmail }) {

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    
    <div className="home">
      <div className="header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h1 style={{ margin: 0 }}>MACAIFER</h1>
          <button onClick={onLogout} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 12, padding: '6px 12px' }}>
            Déconnexion
          </button>
          <button onClick={async () => {
          const message = isPremium 
  ? 'Vous avez un abonnement Premium actif. Veuillez d\'abord annuler votre abonnement via "Gérer abonnement". Voulez-vous quand même supprimer votre compte ?'
  : 'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.';
if (window.confirm(message)) {

    const { data: { session } } = await supabase.auth.getSession();
    await fetch('https://ywtngdmvlfgoptwdejje.supabase.co/functions/v1/delete-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.user.id })
    });
    await supabase.auth.signOut();
  }
}} style={{ background: 'none', border: '1px solid rgba(255,0,0,0.3)', borderRadius: 8, color: 'rgba(255,0,0,0.5)', cursor: 'pointer', fontSize: 11, padding: '4px 8px', marginLeft: 8 }}>
  🗑️ Supprimer compte
</button>
        </div>

        {isPremium && !isIOS && (
  <button onClick={async () => {
    const res = await fetch('https://ywtngdmvlfgoptwdejje.supabase.co/functions/v1/customer-portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, returnUrl: window.location.origin })
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }} style={{ background: 'none', border: '1px solid rgba(240,180,41,0.5)', borderRadius: 8, color: '#f0b429', cursor: 'pointer', fontSize: 12, padding: '6px 12px', width: '100%', marginBottom: 8 }}>
    💎 Gérer abonnement
  </button>
)}

{!isPremium && trialExpired && !isIOS && (
  <button onClick={onSubscribe} style={{ background: '#f0b429', border: 'none', borderRadius: 8, color: '#080b12', cursor: 'pointer', fontSize: 12, padding: '6px 12px', width: '100%', marginBottom: 8, fontWeight: 700 }}>
    💎 Passer Premium — 4,99€/mois
  </button>
)}

{!isPremium && trialExpired && isIOS && (
  <button onClick={() => {
    if (window.CdvPurchase) {
      const store = window.CdvPurchase.store;
      const product = store.get('com.macalfer.app.premium.monthly');
      if (product) product.getOffer()?.order();
    }
  }} style={{ background: '#f0b429', border: 'none', borderRadius: 8, color: '#080b12', cursor: 'pointer', fontSize: 12, padding: '6px 12px', width: '100%', marginBottom: 8, fontWeight: 700 }}>
    💎 Passer Premium — 4,99€/mois
  </button>
)}

<p>{isPremium ? '💎 Abonnement Premium actif' : trialExpired ? '⏰ Essai terminé' : '✨ Essai gratuit 48h actif'}</p>

      </div>

      <div className="grid">

        {assistants.map(a => {
          const accessible = hasAccess(a.id);
          return (
            <div key={a.id} className="card" 
              onClick={() => onSelect(a.id)} 
              style={{ borderTop: `4px solid ${a.color}`, opacity: accessible ? 1 : 0.7, position: 'relative' }}>
              {!accessible && (
                <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 16 }}>🔒</div>
              )}
              <div className="card-emoji">{a.emoji}</div>
              <div className="card-title">{a.title}</div>
              <div className="card-desc">{a.desc}</div>
              {!accessible && (
                <div style={{ fontSize: 10, color: '#f0b429', marginTop: 4, fontWeight: 600 }}>Premium 4,99€/mois</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


function Assistant({ id, onBack, hasAccess, isPremium, trialExpired }) {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);


  if (!hasAccess(id)) return (
    <div style={{ minHeight: '100vh', background: '#0a0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
        <div style={{ color: 'white', fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Assistant Premium</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>Votre essai gratuit de 48h est terminé</div>
        {isIOS ? (
  <button onClick={() => {
    if (window.CdvPurchase) {
      const store = window.CdvPurchase.store;
      const product = store.get('com.macaifer.app.premium.monthly');
      if (product) product.getOffer()?.order();
    }
  }} style={{ background: '#f0b429', border: 'none', borderRadius: 10, padding: '12px 24px', color: '#080b12', fontWeight: 700, cursor: 'pointer', marginBottom: 12, display: 'block', width: '100%' }}>
    💎 Passer Premium — 4,99€/mois
  </button>
) : (
  <button onClick={async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    const res = await fetch('https://ywtngdmvlfgoptwdejje.supabase.co/functions/v1/create-checkout', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        priceId: 'price_1TprDzEH6NYbHRJeb0FeMIYP',
        userId: currentSession?.user?.id,
        email: currentSession?.user?.email,
        successUrl: window.location.origin + '?premium=success',
        cancelUrl: window.location.origin,
      })
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }} style={{ background: '#f0b429', border: 'none', borderRadius: 10, padding: '12px 24px', color: '#080b12', fontWeight: 700, cursor: 'pointer', marginBottom: 12, display: 'block', width: '100%' }}>
    💎 Passer Premium — 4,99€/mois
  </button>
)}



        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 13 }}>
          ← Retour
        </button>
      </div>
    </div>
  );

  const a = assistants.find(x => x.id === id);

  if (id === 'medicaments') return <Medicaments onBack={onBack} isPremium={isPremium} trialExpired={trialExpired} />;



  if (id === 'urgences') return <Urgences onBack={onBack} />;
  if (id === 'nutrition') return <Nutrition onBack={onBack} />;
  if (id === 'emploi') return <Emploi onBack={onBack} />;
  if (id === 'films') return <Films onBack={onBack} />;
  if (id === 'etudiant') return <Etudiant onBack={onBack} />;
  if (id === 'business') return <Business onBack={onBack} />;
  if (id === 'sport') return <Sport onBack={onBack} />;
  if (id === 'game') return <Game onBack={onBack} />;
  if (id === 'vehicule') return <Vehicule onBack={onBack} />;
  if (id === 'justice') return <Justice onBack={onBack} />;
  if (id === 'voyage') return <Voyage onBack={onBack} />;
  if (id === 'permis') return <Permis onBack={onBack} />;


  return (
    <div className="assistant">
      <button className="back-btn" onClick={onBack}>← Retour</button>
      <div className="assistant-header" style={{ background: a.color }}>
        <div className="assistant-emoji">{a.emoji}</div>
        <h2>{a.title}</h2>
      </div>
      <div className="coming-soon">
        <p>🚧 En construction</p>
        <p>Cet assistant arrive bientôt !</p>
      </div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [current, setCurrent] = useState(null);
  const [profile, setProfile] = useState(null);
  

  

  const loadProfile = async (userId, currentSession) => {
 
  const { data: profileData } = await supabase.from('profiles')
.select('*').eq('id', userId).single();
  
  if (profileData) {
    setProfile(profileData);
    
  } else {
    const { data: newProfile } = await supabase.from('profiles').insert({
      id: userId,
      email: currentSession?.user?.email,
      trial_started_at: new Date().toISOString(),
    }).select().single();
    setProfile(newProfile);
  }
};

useEffect(() => {
  if (window.CdvPurchase) {
    const store = window.CdvPurchase.store;
    
    store.register([{
      id: 'com.macalfer.app.premium.monthly',
      type: window.CdvPurchase.ProductType.PAID_SUBSCRIPTION,
      platform: window.CdvPurchase.Platform.APPLE_APPSTORE,
    }]);

    store.when()
      .productUpdated(() => {})
      .approved(async (transaction) => {
        await transaction.verify();
        await transaction.finish();
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await supabase.from('profiles').update({ is_premium: true }).eq('id', session.user.id);
          window.location.reload();
        }
      });

    store.initialize([window.CdvPurchase.Platform.APPLE_APPSTORE]);
  }
}, []);



  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
  // Ne pas connecter si c'est un reset password
  if (localStorage.getItem('isRecovery') === 'true') {
  setSession(null);
  return;
}

  setSession(session);
  if (session) loadProfile(session.user.id, session);
});

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'PASSWORD_RECOVERY') {
    setSession(null);
    localStorage.setItem('isRecovery', 'true');
    return;
  }
  setSession(session);
  if (session) loadProfile(session.user.id, session);
});


    return () => subscription.unsubscribe();
  }, []);

  const isRecovery = window.location.hash?.includes('type=recovery') || window.location.href?.includes('type=recovery');
if (!session || isRecovery) return <Auth />;


  const trialExpired = profile && !profile.is_premium && 
  profile.trial_started_at && 
  new Date() - new Date(profile.trial_started_at) > 48 * 60 * 60 * 1000;

const hasAccess = (id) => {
  const freeAssistants = ['urgences', 'medicaments'];
  if (freeAssistants.includes(id)) return true;
  if (profile?.is_premium) return true;
  if (!trialExpired) return true; // Dans les 48h
  return false;
};
return (
    <div className="app">
      {current ? (
        <Assistant id={current} onBack={() => setCurrent(null)} hasAccess={hasAccess} isPremium={profile?.is_premium} trialExpired={trialExpired} />
      ) : (
        <Home onSelect={setCurrent} onSubscribe={() => setCurrent('premium')} hasAccess={hasAccess} onLogout={() => supabase.auth.signOut()} trialExpired={trialExpired} isPremium={profile?.is_premium} userEmail={profile?.email} />

      )}
    </div>
  ); 
}



export default App;