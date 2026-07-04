import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

serve(async (req) => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Trouver les utilisateurs dont le trial a expiré et pas encore notifiés
    const { data: expiredUsers } = await supabase
      .from("profiles")
      .select("id, email")
      .lt("trial_started_at", new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString())
      .eq("is_premium", false)
      .eq("trial_email_sent", false);

    if (!expiredUsers || expiredUsers.length === 0) {
      return new Response(JSON.stringify({ message: "Aucun trial expiré" }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    let sent = 0;
    for (const user of expiredUsers) {
      if (!user.email) continue;

      // Envoyer email
      await fetch(`${SUPABASE_URL}/functions/v1/send-emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`
        },
        body: JSON.stringify({
          type: "trial_expired",
          email: user.email,
        })
      });

      // Marquer comme notifié
      await supabase.from("profiles").update({ trial_email_sent: true }).eq("id", user.id);
      sent++;
    }

    return new Response(
      JSON.stringify({ success: true, sent }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
