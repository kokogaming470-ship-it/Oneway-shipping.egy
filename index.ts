// Supabase Edge Function: dynamic-api
// بيستقبل { system, prompt } من الموقع ويرجّع { text } من Claude.
// النشر:
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//   supabase functions deploy dynamic-api --no-verify-jwt

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (o: unknown, status = 200) =>
  new Response(JSON.stringify(o), { status, headers: { ...CORS, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const { system, prompt } = await req.json();
    const key = Deno.env.get("ANTHROPIC_API_KEY");
    if (!key) return json({ error: "ANTHROPIC_API_KEY is not set" }, 500);
    if (!prompt) return json({ error: "empty prompt" }, 400);

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model: Deno.env.get("AI_MODEL") || "claude-haiku-5-5",
        max_tokens: 400,
        system: String(system || "").slice(0, 8000),
        messages: [{ role: "user", content: String(prompt).slice(0, 6000) }],
      }),
    });
    const j = await r.json();
    if (!r.ok) return json({ error: j?.error?.message || "upstream error" }, 502);
    const text = (j.content || []).filter((c: any) => c.type === "text").map((c: any) => c.text).join("").trim();
    return json({ text });
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 500);
  }
});
