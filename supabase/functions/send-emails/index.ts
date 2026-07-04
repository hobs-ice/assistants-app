import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sendEmail(to: string, subject: string, html: string) {
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Macaifer <noreply@macaifer.com>",
      to,
      subject,
      html,
    }),
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { type, email } = await req.json();

  try {
    if (type === "welcome_premium") {
      await sendEmail(
        email,
        "💎 Bienvenue dans Macaifer Premium !",
        `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1a; color: #f1f5f9; padding: 40px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="font-size: 48px;">🤖</div>
            <h1 style="color: #f0b429; font-size: 28px; margin: 16px 0;">Bienvenue dans MacAlfer Premium !</h1>
          </div>
          <p>Bonjour 👋</p>
          <p>Votre abonnement Premium est maintenant actif ! Vous avez accès à tous les assistants IA sans limite.</p>
          <div style="background: #1a1a2e; border-radius: 12px; padding: 20px; margin: 24px 0;">
            <p style="color: #f0b429; font-weight: bold; margin-bottom: 12px;">✅ Vos avantages Premium :</p>
            <ul style="color: #94a3b8; line-height: 2;">
              <li>💊 Médicaments — illimité + reconnaissance photo</li>
              <li>🚨 Urgences — illimité</li>
              <li>💼 Emploi — France Travail + international</li>
              <li>⚖️ Justice — conseils juridiques</li>
              <li>📈 Business — stratégie et finances</li>
              <li>✈️ Voyage — optimiseur budget + visa</li>
              <li>🚗 Véhicule — reconnaissance pièce auto</li>
              <li>Et bien plus encore...</li>
            </ul>
          </div>
          <div style="text-align: center; margin-top: 32px;">
            <a href="https://macalfer.com" style="background: #f0b429; color: #080b12; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700;">
              🚀 Accéder à MacAlfer
            </a>
          </div>
          <p style="color: #64748b; font-size: 12px; margin-top: 32px; text-align: center;">MacAlfer — Le couteau suisse numérique du quotidien 🇨🇭</p>
        </div>
        `
      );
    }

if (type === "cancel_premium") {
  await sendEmail(
    email,
    "😢 Votre abonnement MacAlfer Premium a été résilié",
    `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0f1a; color: #f1f5f9; padding: 40px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="font-size: 48px;">😢</div>
        <h1 style="color: #f1f5f9; font-size: 24px; margin: 16px 0;">Votre abonnement a été résilié</h1>
      </div>
      <p>Bonjour 👋</p>
      <p>Votre abonnement MacAlfer Premium a bien été résilié. Vous conservez l'accès jusqu'à la fin de la période en cours.</p>
      <div style="background: #1a1a2e; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <p style="color: #94a3b8;">Après expiration vous aurez toujours accès à :</p>
        <ul style="color: #94a3b8; line-height: 2;">
          <li>🚨 Urgences — illimité</li>
          <li>💊 Médicaments — illimité</li>
        </ul>
      </div>
      <p style="color: #94a3b8;">Vous pouvez vous réabonner à tout moment pour retrouver tous vos assistants !</p>
      <div style="text-align: center; margin-top: 32px;">
        <a href="https://macalfer.com" style="background: #f0b429; color: #080b12; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700;">
          🔄 Se réabonner
        </a>
      </div>
      <p style="color: #64748b; font-size: 12px; margin-top: 32px; text-align: center;">MacAlfer — Le couteau suisse numérique du quotidien 🇨🇭</p>
    </div>
    `
  );
}


    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
