import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CLIENT_ID = Deno.env.get("FRANCE_TRAVAIL_CLIENT_ID") ?? "";
const CLIENT_SECRET = Deno.env.get("FRANCE_TRAVAIL_CLIENT_SECRET") ?? "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function getToken() {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);
  params.append("scope", "api_offresdemploiv2 o2dsoffre");

  const res = await fetch("https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  const data = await res.json();
  return data.access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let keywords = "", location = "", contractType = "";
  try {
    const body = await req.json();
    keywords = body.keywords ?? "";
    location = body.location ?? "";
    contractType = body.contractType ?? "";
  } catch { /* ok */ }

  try {
    const token = await getToken();

    const searchParams = new URLSearchParams();
    if (keywords) searchParams.append("motsCles", keywords);
    if (location) searchParams.append("commune", location);
    if (contractType) searchParams.append("typeContrat", contractType);
    searchParams.append("range", "0-9");

    const offresRes = await fetch("https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search?" + searchParams.toString(), {
      headers: {
        "Authorization": "Bearer " + token,
        "Accept": "application/json",
      },
    });

    const text = await offresRes.text();
    const data = JSON.parse(text);

    return new Response(
      JSON.stringify({ offers: data.resultats || [], total: data.nbResultats || 0 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
