"use client";
import { useEffect, useState } from "react";
import { useT, useLang } from "@/lib/i18n";
import { money, wa, EXTRA_COSTS, TRUST } from "@/lib/site";
import VinCheck from "./VinCheck";
import RepairResult from "./RepairResult";
import PriceResult from "./PriceResult";
import IntelResult from "./IntelResult";

const LBL = { available: "Available", transit: "In transit", sold: "Sold", drops: "Price drops", minor: "Minor damage", auction: "From auctions" };
const yt = (u) => { const m = (u || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/); return m ? "https://www.youtube.com/embed/" + m[1] : null; };
const Placeholder = () => (
  <svg viewBox="0 0 120 40" fill="currentColor"><path d="M6 28c0-4 2-6 6-7l12-9c3-2 6-3 10-3h26c5 0 9 2 12 5l8 6c9 1 14 3 14 8v2H6z" /><circle cx="30" cy="31" r="7" fill="#12151d" /><circle cx="90" cy="31" r="7" fill="#12151d" /></svg>
);
const Photo = ({ c, t }) => (
  <div className="ph">
    {c.img ? <img src={c.img} alt={`${c.make} ${c.model}`} loading="lazy" /> : <Placeholder />}
    <span className={"st " + c.status}>{t(LBL[c.status] || "")}</span>
  </div>
);

export default function CarsView({ cars, compact = false }) {
  const t = useT();
  const [q, setQ] = useState("");
  const [f, setF] = useState("all");
  const [yr, setYr] = useState("");
  const [mx, setMx] = useState("");
  useEffect(() => { const p = new URLSearchParams(window.location.search); if (p.get("q")) setQ(p.get("q")); if (p.get("year")) setYr(+p.get("year")); if (p.get("max")) setMx(+p.get("max")); }, []);
  const [open, setOpen] = useState(null);
  const [main, setMain] = useState(null);
  const { lang } = useLang();
  const [rep, setRep] = useState(null);
  const [rb, setRb] = useState(false);
  const [pr, setPr] = useState(null);
  const [pb, setPb] = useState(false);
  const [iv, setIv] = useState(null);
  const [ib, setIb] = useState(false);
  const [rp, setRp] = useState(null);
  const [rpb, setRpb] = useState(false);
  const repair = async (id) => {
    setRpb(true); setRp(null);
    try {
      const r = await fetch("/api/ai", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode: "repair", id, lang }) });
      setRp(await r.json());
    } catch (e) { setRp({ error: "Error" }); }
    setRpb(false);
  };
  const intel = async (id) => {
    setIb(true); setIv(null);
    try {
      const r = await fetch("/api/ai", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode: "intel", id, lang }) });
      setIv(await r.json());
    } catch (e) { setIv({ error: "Error" }); }
    setIb(false);
  };
  const price = async (id) => {
    setPb(true); setPr(null);
    try {
      const r = await fetch("/api/ai", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode: "price", id, lang }) });
      setPr(await r.json());
    } catch (e) { setPr({ error: "Error" }); }
    setPb(false);
  };
  const report = async (id) => {
    setRb(true); setRep(null);
    try {
      const r = await fetch("/api/ai", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode: "report", id, lang }) });
      setRep(await r.json());
    } catch (e) { setRep({ error: "Error" }); }
    setRb(false);
  };
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  const okF = (c) => f === "all" || (f === "drops" ? c.old_price > c.price : f === "minor" ? c.damage_level === "minor" : f === "auction" ? !!c.auction : c.status === f);
  const list = cars.filter((c) => okF(c) && words.every((w) => `${c.make} ${c.model} ${c.year}`.toLowerCase().includes(w)) && (!yr || c.year >= yr) && (!mx || c.price <= mx));
  return (
    <>
      {!compact && (
        <div className="bar">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("Search make, model, year…")} />
          {["all", "available", "transit", "sold", "drops", "minor", "auction"].map((s) => (
            <button key={s} className={"chip" + (f === s ? " on" : "")} onClick={() => setF(s)}>{t(s === "all" ? "All" : LBL[s])}</button>
          ))}
        </div>
      )}
      {(yr || mx) ? (
        <p style={{ color: "var(--mu)" }}>
          {yr ? `${t("Year from")} ${yr}` : ""}{yr && mx ? " · " : ""}{mx ? `${t("Max car price (USD)")}: ${money(mx)}` : ""}{" "}
          <button className="chip" onClick={() => { setYr(""); setMx(""); }}>✕</button>
        </p>
      ) : null}
      <div className="grid">
        {list.length ? list.map((c) => (
          <div className="car in" key={c.id} onClick={() => { setOpen(c); setMain(null); setRep(null); setPr(null); setIv(null); setRp(null); }}>
            <Photo c={c} t={t} />
            <div className="info">
              <h3>{c.year} {c.make} {c.model}</h3>
              <div className="meta"><span>{Number(c.miles || 0).toLocaleString()} mi</span><span>{c.fuel}</span><span>{c.trans}</span></div>
              <div className="price">{money(c.price)}{c.old_price > c.price ? <s style={{ color: "var(--mu)", fontSize: 14, marginLeft: 8 }}>{money(c.old_price)}</s> : null}</div>
              <small style={{ color: "var(--mu)" }}>≈ {money(c.price + EXTRA_COSTS)} {t("in Georgia (est.)")}</small>
            </div>
          </div>
        )) : <div className="empty">{t("New cars coming soon.")}</div>}
      </div>
      {open && (
        <div className="ov on" onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
          <div className="modal">
            <button className="x" onClick={() => setOpen(null)} aria-label="Close">✕</button>
            <Photo c={{ ...open, img: main || open.img }} t={t} />
            {open.images && open.images.length > 1 && (
              <div style={{ display: "flex", gap: 6, padding: "10px 22px 0", overflowX: "auto" }}>
                {open.images.map((u) => <img key={u} src={u} alt="" onClick={() => setMain(u)} style={{ height: 56, borderRadius: 8, cursor: "pointer" }} />)}
              </div>
            )}
            {open.video_url && (yt(open.video_url)
              ? <iframe src={yt(open.video_url)} title="video" allowFullScreen style={{ width: "100%", aspectRatio: "16/9", border: 0, marginTop: 10 }} />
              : <video src={open.video_url} controls playsInline style={{ width: "100%", marginTop: 10 }} />)}
            <div className="body">
              <h2>{open.year} {open.make} {open.model}</h2>
              <div className="price">{money(open.price)}</div>
              <div className="row">
                <div>Mileage<b>{Number(open.miles || 0).toLocaleString()} mi</b></div>
                <div>Fuel<b>{open.fuel}</b></div>
                <div>Transmission<b>{open.trans}</b></div>
                <div>Status<b>{t(LBL[open.status])}</b></div>
              </div>
              <p style={{ color: "var(--mu)" }}>{open.desc}</p>
              {(open.real_photos || open.vin_checked || open.inspection || open.vin) && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "0 0 12px" }}>
                  {open.real_photos && <span className="chip on">{t("✓ Real photos")}</span>}
                  {open.vin_checked && <span className="chip on">{t("✓ VIN checked")}</span>}
                  {open.inspection && <span className="chip on">{t("✓ Inspection report")}</span>}
                  {open.vin && <span className="chip">VIN: {open.vin}</span>}
                </div>
              )}
              {open.history && <p><b>{t("History")}:</b> <span style={{ color: "var(--mu)" }}>{open.history}</span></p>}
              <p style={{ margin: "0 0 12px" }}><b>{t("Estimated total in Georgia")}: ≈ {money(open.price + EXTRA_COSTS)}</b><br /><small style={{ color: "var(--mu)" }}>{t("Rough estimate incl. transport and customs. Exact quote on request.")}</small></p>
              {open.vin && <VinCheck car={open} />}
              <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--mu)" }}>🏆 AUTOUSAKHATIA{TRUST.companyId ? " · ✓ " + t("Verified business") : ""}{TRUST.founded ? " · " + TRUST.founded : ""}</p>
              <button className="btn" style={{ marginBottom: 12, width: "100%", justifyContent: "center" }} disabled={ib} onClick={() => intel(open.id)}>{ib ? t("Thinking…") : "🧠 " + t("Auto Intelligence")}</button>
              {iv && <IntelResult res={iv} price={open.price} />}
              <a className="btn" target="_blank" rel="noopener noreferrer" href={wa(`Hello! I'm interested in the ${open.year} ${open.make} ${open.model}.`)}>💬 WhatsApp</a>
              <button className="btn g" style={{ marginLeft: 8 }} disabled={rb} onClick={() => report(open.id)}>{rb ? t("Thinking…") : t("🤖 AI report")}</button>
              <button className="btn g" style={{ marginTop: 8 }} disabled={pb} onClick={() => price(open.id)}>{pb ? t("Thinking…") : t("💰 Is this car expensive or cheap?")}</button>
              {pr && <PriceResult res={pr} price={open.price} />}
              <button className="btn g" style={{ marginTop: 8, marginLeft: 8 }} disabled={rpb} onClick={() => repair(open.id)}>{rpb ? t("Thinking…") : "🛠️ " + t("Repair estimate")}</button>
              {rp && <RepairResult res={rp} base={open.price} />}
              {rep && (rep.error ? <p style={{ color: "var(--ac)" }}>{rep.error}</p> : (
                <div style={{ marginTop: 16, fontSize: 14 }}>
                  <p><b>{rep.verdict}</b></p>
                  {[["Good", rep.good], ["Check before buying", rep.check], ["Expected extra costs", rep.extra_costs], ["Missing information", rep.missing_info]].map(([h, a]) => a && a.length ? (
                    <div key={h}><b>{t(h)}</b><ul style={{ color: "var(--mu)", margin: "4px 0 10px", paddingLeft: 20 }}>{a.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
                  ) : null)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
