import { createClient } from "@supabase/supabase-js";
import { SITE, EXTRA_COSTS, wa } from "@/lib/site";

const norm = (s) => String(s || "").toLowerCase();
function matches(a, c) {
  const want = norm(a.make_model);
  if (!want) return false; // alerts without a car name are handled by hand in /admin
  const hay = norm(`${c.make} ${c.model}`);
  if (!want.split(/\s+/).every((w) => hay.includes(w))) return false;
  if (a.year_from && c.year && c.year < a.year_from) return false;
  if (a.max_price && c.price > a.max_price) return false;
  if (a.max_total && c.price + EXTRA_COSTS > a.max_total) return false;
  if (a.auction && a.auction !== "any" && norm(c.auction) !== norm(a.auction)) return false;
  if (a.damage && !norm(`${c.damage} ${c.description}`).includes(norm(a.damage))) return false;
  return true;
}

// Called by /admin right after a NEW car is saved. Uses the logged-in owner's token,
// so database rules (RLS) make sure only the owner can read customer requests.
export async function POST(req) {
  try {
    const token = (req.headers.get("authorization") || "").replace("Bearer ", "");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key || !token) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const sb = createClient(url, key, { global: { headers: { Authorization: "Bearer " + token } } });
    const { id } = await req.json();
    const { data: car, error: e1 } = await sb.from("cars").select("*").eq("id", id).single();
    const { data: alerts, error: e2 } = await sb.from("alerts").select("*");
    if (e1 || e2) return Response.json({ error: (e1 || e2).message }, { status: 403 });

    const title = `${car.year} ${car.make} ${car.model}`;
    const message = `Hello! A car matching your request is now available: ${title}, $${car.price}. Details: ${SITE.url}/cars`;
    const out = [];
    for (const a of alerts.filter((x) => matches(x, car))) {
      let emailed = false;
      const isMail = a.contact.includes("@") && !a.contact.startsWith("@");
      if (isMail && process.env.RESEND_API_KEY) {
        const r = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "content-type": "application/json" },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || "AUTOUSAKHATIA <onboarding@resend.dev>",
            to: [a.contact.trim()],
            subject: `New car for you: ${title}`,
            html: `<p>${message}</p><p>WhatsApp: <a href="${wa()}">${SITE.phone}</a></p><p>მოგესალმებით! თქვენი მოთხოვნის შესაბამისი მანქანა დაემატა: <b>${title}</b>, $${car.price}.</p>`,
          }),
        });
        emailed = r.ok;
      }
      out.push({ id: a.id, contact: a.contact, channel: a.channel, request: a.request, emailed });
    }
    return Response.json({ matches: out, message });
  } catch (e) {
    return Response.json({ error: e.message || "Error" }, { status: 500 });
  }
}
