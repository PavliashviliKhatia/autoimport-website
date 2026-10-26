"use client";
import { useState } from "react";
import { useLang, useT } from "@/lib/i18n";
import { shrink } from "@/lib/img";
import { money } from "@/lib/site";

const PARTS = ["Front bumper", "Rear bumper", "Headlight", "Taillight", "Hood", "Fender", "Door", "Windshield", "Airbags", "Full paint"];
const rng = (r) => (r && r.length === 2 ? `${money(r[0])}–${money(r[1])}` : "—");

export default function RepairEstimator({ cars = [] }) {
  const t = useT();
  const { lang } = useLang();
  const [f, setF] = useState({ make: "", model: "", year: "", price: "" });
  const [sel, setSel] = useState([]);
  const [files, setFiles] = useState([]);
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const pick = (id) => { const c = cars.find((x) => x.id === id); if (c) setF({ make: c.make, model: c.model, year: String(c.year || ""), price: String(c.price || "") }); };
  const toggle = (p) => setSel(sel.includes(p) ? sel.filter((x) => x !== p) : [...sel, p]);
  const go = async () => {
    setBusy(true); setRes(null);
    try {
      const images = [];
      for (const x of files.slice(0, 4)) images.push(await shrink(x));
      const r = await fetch("/api/ai", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode: "repair", car: f, items: sel, images, lang }) });
      setRes(await r.json());
    } catch (e) { setRes({ error: "Error" }); }
    setBusy(false);
  };
  const tot = res && res.repair_total_usd;
  const base = +f.price || 0;
  return (
    <div className="co">
      {cars.length > 0 && (
        <select onChange={(e) => pick(e.target.value)} defaultValue="" style={{ width: "100%", background: "var(--card)", border: "1px solid var(--bd)", color: "var(--tx)", padding: "10px 12px", borderRadius: 12, font: "inherit", marginBottom: 8 }}>
          <option value="">{t("Choose from our cars")}</option>
          {cars.map((c) => <option key={c.id} value={c.id}>{c.year} {c.make} {c.model}</option>)}
        </select>
      )}
      <div className="two">
        <div><label>{t("Make")}</label><input value={f.make} onChange={set("make")} /></div>
        <div><label>{t("Model")}</label><input value={f.model} onChange={set("model")} /></div>
        <div><label>{t("Year")}</label><input type="number" value={f.year} onChange={set("year")} /></div>
        <div><label>{t("Car price (USD)")}</label><input type="number" value={f.price} onChange={set("price")} /></div>
      </div>
      <label>{t("Damaged parts")}</label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {PARTS.map((p) => <button type="button" key={p} className={"chip" + (sel.includes(p) ? " on" : "")} onClick={() => toggle(p)}>{t(p)}</button>)}
      </div>
      <label>{t("Photos (optional, up to 4)")}</label>
      <input type="file" accept="image/*" multiple onChange={(e) => setFiles([...e.target.files].slice(0, 4))} />
      <button className="btn" style={{ marginTop: 14 }} disabled={busy || !f.make || !f.model || (!sel.length && !files.length)} onClick={go}>{busy ? t("Thinking…") : "🛠️ " + t("Estimate repair")}</button>
      {res && (res.error ? <p style={{ color: "var(--ac)" }}>{res.error}</p> : (
        <div style={{ marginTop: 18, fontSize: 14 }}>
          {(res.items || []).map((it, i) => (
            <div key={i} className="tl" style={{ display: "block" }}>
              <b>{it.part}</b>
              <div style={{ color: "var(--mu)", fontWeight: 400 }}>
                {it.used_usd && <div>{t("Used")}: {rng(it.used_usd)}</div>}
                {it.aftermarket_usd && <div>{t("Aftermarket")}: {rng(it.aftermarket_usd)}</div>}
                {it.oem_usd && <div>{t("Original (OEM)")}: {rng(it.oem_usd)}</div>}
                {it.labor_usd && <div>{t("Labor")}: {rng(it.labor_usd)}</div>}
                {it.note && <div>{it.note}</div>}
              </div>
            </div>
          ))}
          {tot && <p><b>{t("Repair total")}: {rng(tot)}</b></p>}
          {tot && base > 0 && <p style={{ color: "var(--ac2)", fontSize: 16 }}><b>{t("Total budget (car + repair)")}: {money(base + tot[0])}–{money(base + tot[1])}</b></p>}
          <small style={{ color: "var(--mu)" }}>{t("Does not include transport and customs.")} {res.caveat}</small>
        </div>
      ))}
    </div>
  );
}
