import { createClient } from "@supabase/supabase-js";
import { RADAR_MODELS } from "@/lib/site";
export const maxDuration = 60;

async function analyze(model) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5", max_tokens: 1200,
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 3 }],
      system: `You are a used-car market analyst. Use web search (at most 3 searches) to describe the CURRENT USA used-car market (dealer and auction listings, mostly 2020-2024 model years) for the given model: demand, recent price trend, whether prices have dropped, where interesting deals appear, typical price range. Never invent numbers; use null / "unclear" when sources are thin. Reply with JSON only at the end: {"demand":"high|medium|low|unclear","price_trend":"rising|stable|falling|unclear","typical_price_usd":[number,number]|null,"fast_selling":boolean|null,"discounts":string,"deals":string,"note":string}. Keep strings short, in English.`,
      messages: [{ role: "user", content: model }],
    }),
  });
  if (!r.ok) throw new Error("AI error " + r.status);
  const j = await r.json();
  const txt = j.content.filter((b) => b.type === "text").map((b) => b.text).join("");
  const m = txt.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("No JSON");
  return JSON.parse(m[0]);
}

// Vercel Cron calls this weekly with "Authorization: Bearer CRON_SECRET".
export async function GET(req) {
  if (!process.env.CRON_SECRET || req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`)
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const out = await Promise.all(RADAR_MODELS.map(async (model) => {
    try {
      const data = await analyze(model);
      const { error } = await sb.from("radar").upsert({ model, data, updated_at: new Date().toISOString() });
      return { model, ok: !error, error: error && error.message };
    } catch (e) { return { model, ok: false, error: e.message }; }
  }));
  return Response.json(out);
}
