"use client";
import { useState } from "react";
import { useLang, useT } from "@/lib/i18n";
import { money, wa } from "@/lib/site";
import AlertForm from "./AlertForm";

export default function AIAssistant({ cars }) {
  const t = useT();
  const { lang } = useLang();
  const [text, setText] = useState("");
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const go = async () => {
    if (text.trim().length < 5) return;
    setBusy(true); setErr(""); setRes(null);
    try {
      const r = await fetch("/api/ai", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode: "match", text, lang }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Error");
      setRes(j);
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };
  const picks = (res?.picks || []).map((p) => ({ ...p, car: cars.find((c) => c.id === p.id) })).filter((p) => p.car);
  return (
    <div className="co">
      <textarea rows="3" value={text} onChange={(e) => setText(e.target.value)} placeholder={t("e.g. Economical hybrid from 2022, up to $15,000, minor damage")} style={{ width: "100%", background: "var(--bg2)", border: "1px solid var(--bd)", color: "var(--tx)", borderRadius: 12, padding: 12, font: "inherit" }} />
      <button className="btn" style={{ marginTop: 12 }} disabled={busy} onClick={go}>{busy ? t("Thinking…") : "🤖 " + t("Find cars")}</button>
      {err && <p style={{ color: "var(--ac)" }}>{err}</p>}
      {res && (
        <div style={{ marginTop: 18 }}>
          <p>{res.summary}</p>
          {picks.length === 0 && <p style={{ color: "var(--mu)" }}>{t("No matching car in stock right now.")}</p>}
          {picks.map((p) => (
            <div key={p.id} className="tl" style={{ alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <span style={{ display: "flex", gap: 12, alignItems: "center", flex: 1, minWidth: 220 }}>
                {p.car.img && <img src={p.car.img} alt="" style={{ height: 56, width: 84, objectFit: "cover", borderRadius: 8 }} />}
                <span>{p.car.year} {p.car.make} {p.car.model} — <b style={{ color: "var(--ac2)" }}>{money(p.car.price)}</b><br /><small style={{ color: "var(--mu)", fontWeight: 400 }}>{p.why}</small></span>
              </span>
              <a className="chip on" target="_blank" rel="noopener noreferrer" href={wa(`Hello! I'm interested in the ${p.car.year} ${p.car.make} ${p.car.model}.`)}>WhatsApp</a>
            </div>
          ))}
          {res.missing && <p style={{ color: "var(--mu)", fontSize: 13 }}>{res.missing}</p>}
          <small style={{ color: "var(--mu)" }}>{t("Prices shown exclude transport and customs.")}</small>
          <AlertForm key={res.summary} initial={text} />
        </div>
      )}
    </div>
  );
}
