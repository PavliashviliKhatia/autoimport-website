"use client";
import { useState } from "react";
import { useLang, useT } from "@/lib/i18n";
import AlertForm from "./AlertForm";

const F = { yes: ["Realistic budget", "#2ecc71"], maybe: ["Possible, tight", "#ffb703"], no: ["Budget too low", "#e5322d"], unclear: ["Unclear", "#9aa3b5"] };
const rng = (r) => (r && r.length === 2 ? `$${r[0].toLocaleString("en-US")}–$${r[1].toLocaleString("en-US")}` : "—");

export default function BuyForMe() {
  const t = useT();
  const { lang } = useLang();
  const [text, setText] = useState("");
  const [max, setMax] = useState("");
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);
  const go = async () => {
    setBusy(true); setRes(null);
    try {
      const r = await fetch("/api/ai", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode: "buyforme", text, max_total: max, lang }) });
      setRes(await r.json());
    } catch (e) { setRes({ error: "Error" }); }
    setBusy(false);
  };
  const f = res && F[res.feasible];
  return (
    <div className="co">
      <textarea rows="3" value={text} onChange={(e) => setText(e.target.value)} placeholder="Tesla Model 3 2022, minor damage" style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--bd)", color: "var(--tx)", borderRadius: 12, padding: 12, font: "inherit" }} />
      <label>{t("Maximum total cost in Georgia (USD)")}</label>
      <input type="number" value={max} onChange={(e) => setMax(e.target.value)} />
      <button className="btn" style={{ marginTop: 14 }} disabled={busy || text.trim().length < 5} onClick={go}>{busy ? t("Thinking…") : "🛒 " + t("Check and request")}</button>
      {res && (res.error ? <p style={{ color: "var(--ac)" }}>{res.error}</p> : (
        <div style={{ marginTop: 16, fontSize: 14 }}>
          {f && <b style={{ color: f[1], fontSize: 16 }}>● {t(f[0])}</b>}
          <p>{res.summary}</p>
          <p><b>{t("Typical US price")}:</b> {rng(res.us_price_usd)}<br /><b>{t("Estimated total in Georgia")}:</b> {rng(res.est_total_usd)}</p>
          {res.advice && <p>{res.advice}</p>}
          {res.questions && res.questions.length > 0 && <div><b>{t("What we still need to know")}</b><ul style={{ color: "var(--mu)", paddingLeft: 20 }}>{res.questions.map((q, i) => <li key={i}>{q}</li>)}</ul></div>}
          <AlertForm key={res.summary} initial={`[Buy for me] ${text}${max ? " (max total $" + max + ")" : ""}`} />
          <small style={{ color: "var(--mu)" }}>{t("Nothing is bought or bid on without your written consent.")}</small>
        </div>
      ))}
    </div>
  );
}
