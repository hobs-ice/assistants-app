export default function Legal({ type, onBack }) {
  const C = {
    bg: '#0a0f1a', card: '#0e1420', cardBorder: '#1c2535',
    accent: '#f0b429', text: '#f1f5f9', muted: '#64748b',
  };

  const content = {
    privacy: {
      title: '🔒 Politique de Confidentialité',
      sections: [
        { title: 'Données collectées', text: 'Nous collectons uniquement votre email et votre statut d\'abonnement. Aucune donnée personnelle supplémentaire n\'est requise.' },
        { title: 'Utilisation des données', text: 'Vos données sont utilisées uniquement pour gérer votre compte et votre abonnement MacAlfer. Elles ne sont jamais vendues à des tiers.' },
        { title: 'Hébergement', text: 'Vos données sont hébergées sur Supabase (serveurs EU) et Stripe (certifié PCI DSS). Tous les échanges sont chiffrés via HTTPS.' },
        { title: 'Vos droits (RGPD)', text: 'Vous avez le droit d\'accéder à vos données, les rectifier ou les supprimer. Contactez-nous à contact@macaifer.com pour exercer ces droits.' },
        { title: 'Conservation', text: 'Vos données sont conservées tant que votre compte est actif. Après suppression, elles sont effacées sous 30 jours.' },
        { title: 'Paiements', text: 'Les paiements sont gérés par Stripe. Macaifer ne stocke aucune donnée bancaire.' },
      ]
    },
    cgu: {
      title: '📋 Conditions Générales d\'Utilisation',
      sections: [
        { title: '1. Objet', text: 'Macaifer est une application d\'assistants IA spécialisés. Elle fournit des informations à titre indicatif uniquement.' },
        { title: '2. Responsabilité', text: 'Les réponses des assistants sont générées par IA et peuvent contenir des erreurs. Consultez toujours un professionnel pour des décisions importantes.' },
        { title: '3. Abonnement', text: 'L\'abonnement Premium est à 4,99€/mois. Vous pouvez annuler à tout moment via le portail de gestion d\'abonnement.' },
        { title: '4. Essai gratuit', text: 'Un essai gratuit de 48h est offert à la première connexion. Après expiration, un abonnement Premium est requis pour accéder aux assistants premium.' },
        { title: '5. Utilisation', text: 'L\'utilisation de MacAlfer à des fins illégales ou contraires à l\'éthique est strictement interdite.' },
        { title: '6. Résiliation', text: 'Vous pouvez supprimer votre compte à tout moment. Les données sont supprimées sous 30 jours.' },
      ]
    }
  };

  const page = content[type];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', marginBottom: 20, fontSize: 14 }}>
        ← Retour
      </button>
      <div style={{ color: C.text, fontWeight: 800, fontSize: 22, marginBottom: 8 }}>{page.title}</div>
      <div style={{ color: C.muted, fontSize: 12, marginBottom: 24 }}>Dernière mise à jour : juin 2026</div>
      {page.sections.map((s, i) => (
        <div key={i} style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <div style={{ color: C.text, fontWeight: 700, marginBottom: 8 }}>{s.title}</div>
          <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{s.text}</div>
        </div>
      ))}
    </div>
  );
}
