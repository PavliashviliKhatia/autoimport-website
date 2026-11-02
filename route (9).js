import { createClient } from "@supabase/supabase-js";

const hits = new Map();
const limited = (ip) => { const n = Date.now(), a = (hits.get(ip) || []).filter((t) => n - t < 3600e3); if (a.length >= 40) return true; a.push(n); hits.set(ip, a); return false; };

// Public lookup of ONE order by its secret code (the customer name is never returned).
export async function GET(req) {
  const ip = (req.headers.get("x-forwarded-for") || "x").split(",")[0];
  if (limited(ip)) return Response.json({ error: "Too many tries. Please wait." }, { status: 429 });
  const code = (new URL(req.url).searchParams.get("code") || "").trim().toUpperCase();
  if (!/^[A-Z0-9-]{4,16}$/.test(code)) return Response.json({ error: "Code not found." }, { status: 404 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return Response.json({ error: "Tracking is not configured yet." }, { status: 503 });
  const { data } = await createClient(url, key).from("orders").select("car,stage,notes,stage_dates,updated_at,container,carrier,vessel").eq("code", code).maybeSingle();
  if (!data) return Response.json({ error: "Code not found." }, { status: 404 });
  return Response.json(data);
}
