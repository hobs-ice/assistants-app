import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function verifyStripeSignature(payload: string, sigHeader: string, secret: string): Promise<boolean> {
  const parts = sigHeader.split(",");
  const timestamp = parts.find(p => p.startsWith("t="))?.split("=")[1];
  const signature = parts.find(p => p.startsWith("v1="))?.split("=")[1];
  if (!timestamp || !signature) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedPayload));
  const expectedSig = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
  return expectedSig === signature;
}

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!signature) return new Response("Missing signature", { status: 400 });

 const valid = await verifyStripeSignature(body, signature, STRIPE_WEBHOOK_SECRET);
if (!valid) return new Response("Invalid signature", { status: 400 });





  const event = JSON.parse(body);
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Paiement abonnement réussi
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;

    if (userId) {
  await supabase.from("profiles").update({ is_premium: true }).eq("id", userId);
  
  // Envoyer email de bienvenue Premium
  const { data: userProfile } = await supabase.from("profiles").select("email").eq("id", userId).single();
  if (userProfile?.email) {
    await fetch(`${SUPABASE_URL}/functions/v1/send-emails`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`
      },
      body: JSON.stringify({
        type: "welcome_premium",
        email: userProfile.email,
      })
    });
  }
}

  }

  // Abonnement annulé
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    console.log("Subscription updated:", subscription.cancel_at_period_end, subscription.status);
    const customerId = subscription.customer;

    // Récupérer l'email du customer Stripe
    const customerRes = await fetch(`https://api.stripe.com/v1/customers/${customerId}`, {
      headers: { "Authorization": `Bearer ${STRIPE_SECRET_KEY}` }
    });
    const customer = await customerRes.json();

    if (customer.email) {
  await supabase.from("profiles").update({ is_premium: false }).eq("email", customer.email);
  
  // Email résiliation
  await fetch(`${SUPABASE_URL}/functions/v1/send-emails`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`
    },
    body: JSON.stringify({
      type: "cancel_premium",
      email: customer.email,
    })
  });
}

  }

  if (event.type === "customer.subscription.updated") {
  const subscription = event.data.object;
  if (subscription.cancel_at_period_end === true || subscription.status === "canceled") {

    const customerId = subscription.customer;
    const customerRes = await fetch(`https://api.stripe.com/v1/customers/${customerId}`, {
      headers: { "Authorization": `Bearer ${STRIPE_SECRET_KEY}` }
    });
    const customer = await customerRes.json();
    if (customer.email) {
      await fetch(`${SUPABASE_URL}/functions/v1/send-emails`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`
        },
        body: JSON.stringify({
          type: "cancel_premium",
          email: customer.email,
        })
      });
    }
  }
}


  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
