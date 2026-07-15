import { useState } from 'react';
import { supabase } from './supabase';
import Legal from './Legal';


export default function Auth() { 
  const [isReset, setIsReset] = useState(false);
const [newPassword, setNewPassword] = useState('');

useEffect(() => {
  const hash = window.location.hash;
  if (hash && hash.includes('type=recovery')) {
    setIsReset(true);
  }
}, []);

  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showLegal, setShowLegal] = useState(null);
  



  const handleAuth = async () => {
    setLoading(true);
    setMessage('');
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setMessage(error.message);
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setMessage(error.message);
        else {
  setMessage('✅ Compte créé ! Vérifiez votre email pour confirmer votre inscription.');
  
  await fetch('https://ywtngdmvlfgoptwdejje.supabase.co/functions/v1/send-emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'welcome',
      email: email,
    })
  });
}

      }
    } catch (e) {
      setMessage('Erreur de connexion');
    }
    setLoading(false);
  };

if (isReset) return (
  <div style={{ minHeight: '100vh', background: '#0a0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
    <div style={{ maxWidth: 400, width: '100%', background: '#1a1a2e', borderRadius: 16, padding: 32 }}>
      <h2 style={{ color: 'white', marginBottom: 24 }}>🔑 Nouveau mot de passe</h2>
      <input type="password" placeholder="Nouveau mot de passe"
        value={newPassword} onChange={e => setNewPassword(e.target.value)}
        style={{ width: '100%', background: '#0a0f1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '12px 16px', color: 'white', fontSize: 14, outline: 'none', marginBottom: 12, boxSizing: 'border-box' }} />
      <button onClick={async () => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) alert('Erreur: ' + error.message);
        else { alert('✅ Mot de passe mis à jour !'); setIsReset(false); }
      }} style={{ width: '100%', background: '#f0b429', border: 'none', borderRadius: 8, padding: 14, color: '#080b12', fontWeight: 700, cursor: 'pointer' }}>
        Mettre à jour le mot de passe
      </button>
    </div>
  </div>
);


if (showLegal) return <Legal type={showLegal} onBack={() => setShowLegal(null)} />;

  return (
    
    <div style={{ minHeight: '100vh', background: '#0a0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#0e1420', border: '1px solid #1c2535', borderRadius: 18, padding: 32, width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ marginBottom: 16 }}>
  <svg width="80" height="90" viewBox="0 0 80 90">
    {/* Corps sphère */}
    <circle cx="40" cy="62" r="26" fill="#1e293b" stroke="#f0b429" strokeWidth="2"/>
    {/* Détails corps */}
    <path d="M15 62 Q40 50 65 62" stroke="#f0b429" strokeWidth="1.5" fill="none" opacity="0.6"/>
    <path d="M16 68 Q40 80 64 68" stroke="#f0b429" strokeWidth="1.5" fill="none" opacity="0.4"/>
    <circle cx="30" cy="68" r="8" fill="none" stroke="#6366f1" strokeWidth="1.5"/>
    <circle cx="52" cy="60" r="5" fill="none" stroke="#f0b429" strokeWidth="1.5"/>
    
    {/* Tête */}
    <ellipse cx="40" cy="22" rx="18" ry="16" fill="#1e293b" stroke="#f0b429" strokeWidth="2"/>
    {/* Œil principal */}
    <circle cx="44" cy="20" r="8" fill="#0a0f1a" stroke="#6366f1" strokeWidth="2"/>
    <circle cx="44" cy="20" r="5" fill="#6366f1" opacity="0.8"/>
    <circle cx="44" cy="20" r="2" fill="white" opacity="0.9"/>
    {/* Petit œil */}
    <circle cx="32" cy="24" r="3" fill="#f0b429" opacity="0.8"/>
    {/* Antenne */}
    <line x1="38" y1="6" x2="35" y2="1" stroke="#6366f1" strokeWidth="1.5"/>
    <circle cx="35" cy="1" r="2" fill="#f0b429"/>
    <line x1="42" y1="6" x2="46" y2="2" stroke="#6366f1" strokeWidth="1.5"/>
    <circle cx="46" cy="2" r="1.5" fill="#6366f1"/>
    {/* Cou */}
    <rect x="34" y="36" width="12" height="6" rx="2" fill="#1e293b" stroke="#f0b429" strokeWidth="1"/>
  </svg>
</div>

          <div style={{ fontFamily: 'sans-serif', fontSize: 24, fontWeight: 800, color: '#f1f5f9' }}>Macaifer</div>
          <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>Le couteau suisse numérique du quotidien
</div>
        </div>

        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          style={{ width: '100%', background: '#1e293b', border: 'none', borderRadius: 10, padding: '12px 16px', color: '#f1f5f9', fontSize: 14, outline: 'none', marginBottom: 12, boxSizing: 'border-box' }} />

        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Mot de passe"
          onKeyDown={e => e.key === 'Enter' && handleAuth()}
          style={{ width: '100%', background: '#1e293b', border: 'none', borderRadius: 10, padding: '12px 16px', color: '#f1f5f9', fontSize: 14, outline: 'none', marginBottom: 16, boxSizing: 'border-box' }} />

        {message && (
          <div style={{ background: '#0a1a0a', border: '1px solid #10b98140', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#10b981', marginBottom: 16 }}>
            {message}
          </div>
        )}
{!isLogin && (
  <div style={{ fontSize: 11, color: '#64748b', textAlign: 'center', marginBottom: 12 }}>
    En vous inscrivant vous acceptez nos{' '}
    <button onClick={() => setShowLegal('cgu')} style={{ background: 'none', border: 'none', color: '#f0b429', cursor: 'pointer', fontSize: 11, padding: 0 }}>CGU</button>
    {' '}et notre{' '}
    <button onClick={() => setShowLegal('privacy')} style={{ background: 'none', border: 'none', color: '#f0b429', cursor: 'pointer', fontSize: 11, padding: 0 }}>Politique de confidentialité</button>
  </div>
)}

        <button onClick={handleAuth} disabled={loading}
          style={{ width: '100%', padding: '13px', borderRadius: 10, border: 'none', background: '#f0b429', color: '#080b12', fontWeight: 800, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, marginBottom: 12 }}>
          {loading ? '⏳...' : isLogin ? '🔐 Se connecter' : '✨ S\'inscrire'}
        </button>
        {isLogin && (
  <button onClick={async () => {
    if (!email) { setMessage('Entrez votre email d\'abord'); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) setMessage(error.message);
    else setMessage('✅ Email de réinitialisation envoyé !');
  }} style={{ width: '100%', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 12, marginBottom: 8 }}>
    Mot de passe oublié ?
  </button>
)}




        <button onClick={() => setIsLogin(!isLogin)}
          style={{ width: '100%', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13 }}>
          {isLogin ? 'Pas encore de compte ? S\'inscrire' : 'Déjà un compte ? Se connecter'}
        </button>
      </div>
    </div>
  );
}
