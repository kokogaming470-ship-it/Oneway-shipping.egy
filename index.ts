// Supabase Edge Function: dynamic-api  (مجاني: Gemini + Supabase)
// بيستقبل { system, prompt } من الموقع ويرجّع { text }.
// السر المطلوب في Supabase Secrets:  GEMINI_API_KEY

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
    const key = Deno.env.get("GEMINI_API_KEY");
    if (!key) return json({ error: "GEMINI_API_KEY is not set" }, 500);
    if (!prompt) return json({ error: "empty prompt" }, 400);

    const model = Deno.env.get("AI_MODEL") || "gemini-2.5-flash-lite";
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "x-goog-api-key": key, "content-type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: String(system || "").slice(0, 8000) }] },
          contents: [{ role: "user", parts: [{ text: String(prompt).slice(0, 6000) }] }],
          generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
        }),
      },
    );
    const j = await r.json();
    if (!r.ok) return json({ error: j?.error?.message || "upstream error" }, 502);
    const text = (j?.candidates?.[0]?.content?.parts || []).map((p: any) => p.text || "").join("").trim();
    return json({ text });
  } catch (e) {
    return json({ error: String((e as Error).message || e) }, 500);
  }
});
