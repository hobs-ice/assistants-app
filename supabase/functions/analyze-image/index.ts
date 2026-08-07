import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { imageData, mediaType, prompt } = await req.json();


    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType || "image/jpeg",
                data: imageData,
              }
            },
            {
              type: "text",
              text: prompt || `Tu es un expert en mécanique automobile. Analyse cette image et 
1. 🔧 Identifie la pièce automobile
2. 📝 Explique son rôle dans le véhicule
3. ⚠️ Indique si elle semble en bon état ou à remplacer
4. 💰 Donne une fourchette de prix moyenne
5. 🔍 Donne le nom exact pour la rechercher chez un vendeur

Sois précis et concis.`
            }
          ]
        }]
      }),
    });

    const data = await response.json();
        // Log de consommation
    try {
      await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/ia_usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        },
        body: JSON.stringify({
          provider: 'anthropic',
          model: 'claude-sonnet-4-6',
          assistant: 'image',
          input_tokens: data.usage?.input_tokens,
          output_tokens: data.usage?.output_tokens,
        }),
      });
    } catch (e) {
      console.error('logUsage:', e.message);
    }

    const text = data.content?.[0]?.text || "Impossible d'analyser l'image";

    return new Response(
      JSON.stringify({ text }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
