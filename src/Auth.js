import { useState } from 'react';
import { supabase } from './supabase';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
        else setMessage('Vérifie ton email pour confirmer ton compte !');
      }
    } catch (e) {
      setMessage('Erreur de connexion');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#0e1420', border: '1px solid #1c2535', borderRadius: 18, padding: 32, width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🤖</div>
          <div style={{ fontFamily: 'sans-serif', fontSize: 24, fontWeight: 800, color: '#f1f5f9' }}>Mes Assistants</div>
          <div style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>Vos assistants IA personnels</div>
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
