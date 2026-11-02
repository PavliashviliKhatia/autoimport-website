import { createClient } from "@supabase/supabase-js";
import { T } from "@/lib/i18n";
import { getCars } from "@/lib/cars";

export const revalidate = 3600;
export const metadata = { title: "Car Market Radar", description: "Weekly market snapshot for popular car models imported from the USA." };

const COL = { high: "#2ecc71", medium: "#ffb703", low: "#9aa3b5", rising: "#e5322d", stable: "#3da5ff", falling: "#2ecc71", unclear: "#9aa3b5" };
const LBL = { high: "High", medium: "Medium", low: "Low", rising: "Rising", stable: "Stable", falling: "Falling", unclear: "Unclear" };

async function getRadar() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const { data, error } = await createClient(url, key).from("radar").select("*").order("model");
    if (error) throw error;
    return data;
  } catch (e) { return []; }
}

export default async function Radar() {
  const [rows, cars] = await Promise.all([getRadar(), getCars()]);
  const stock = {};
  cars.filter((c) => c.status !== "sold").forEach((c) => { stock[c.make] = (stock[c.make] || 0) + 1; });
  const range = (r) => (r && r.length === 2 ? `$${r[0].toLocaleString("en-US")}–$${r[1].toLocaleString("en-US")}` : "—");
  return (
    <main>
      <section style={{ paddingTop: 50 }}>
        <div className="wrap">
          <h2>📡 <T>Car Market Radar</T></h2>
          <p className="sub"><T>Weekly market snapshot for popular models, based on public web sources. Indicative only.</T></p>
          {rows.length === 0 && <div className="empty"><T>No radar data yet.</T></div>}
          <div className="grid">
            {rows.map((r) => {
              const d = r.data || {};
              return (
                <div className="step" key={r.model}>
                  <h3>{r.model}</h3>
                  <p><T>Demand</T>: <b style={{ color: COL[d.demand] }}>{d.demand ? <T>{LBL[d.demand]}</T> : "—"}</b>{d.fast_selling ? " 🔥" : ""}<br />
                    <T>Price trend</T>: <b style={{ color: COL[d.price_trend] }}>{d.price_trend ? <T>{LBL[d.price_trend]}</T> : "—"}</b><br />
                    <T>Typical price</T>: <b>{range(d.typical_price_usd)}</b></p>
                  {d.discounts && <p style={{ fontSize: 13 }}>{d.discounts}</p>}
                  {d.deals && <p style={{ fontSize: 13 }}><b><T>Deals</T>:</b> {d.deals}</p>}
                  {d.note && <small style={{ color: "var(--mu)" }}>{d.note}</small>}
                  <br /><small style={{ color: "var(--mu)" }}><T>Updated</T>: {new Date(r.updated_at).toLocaleDateString()}</small>
                </div>
              );
            })}
          </div>
          {Object.keys(stock).length > 0 && (
            <>
              <h3 style={{ marginTop: 30 }}><T>In our stock</T></h3>
              <p style={{ color: "var(--mu)" }}>{Object.entries(stock).map(([k, v]) => `${k}: ${v}`).join(" · ")}</p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
