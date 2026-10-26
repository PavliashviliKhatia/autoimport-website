"use client";
import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import { STAGES, TRACKERS } from "@/lib/site";

// Copies the number, then opens the carrier's own tracking page in a new tab.
function openTracker(tracker, number, setMsg, t) {
  const n = (number || "").trim();
  if (n && navigator.clipboard) navigator.clipboard.writeText(n).catch(() => {});
  setMsg(t("Number copied. Paste it on the website."));
  window.open(tracker.url, "_blank", "noopener,noreferrer");
}

export default function TrackForm() {
  const t = useT();
  const [code, setCode] = useState("");
  const [r, setR] = useState(null);
  const [busy, setBusy] = useState(false);
  const [ti, setTi] = useState(0);
  const [num, setNum] = useState("");
  const [msg, setMsg] = useState("");
  const go = async (c = code) => {
    if (!c.trim()) return;
    setBusy(true); setR(null);
    try {
      const j = await (await fetch("/api/track?code=" + encodeURIComponent(c.trim()))).json();
      setR(j);
      if (j.container) setNum(j.container);
      if (j.carrier) { const i = TRACKERS.findIndex((x) => x.name === j.carrier); if (i >= 0) setTi(i); }
    } catch (e) { setR({ error: "Error" }); }
    setBusy(false);
  };
  useEffect(() => { const c = new URLSearchParams(window.location.search).get("code"); if (c) { setCode(c); go(c); } }, []);
  const sel = { width: "100%", background: "var(--card)", border: "1px solid var(--bd)", color: "var(--tx)", padding: "10px 12px", borderRadius: 12, font: "inherit" };
  return (
    <div className="co">
      <div className="bar" style={{ marginBottom: 0 }}>
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder={t("Our tracking code")} />
        <button className="btn" disabled={busy} onClick={() => go()}>{busy ? t("Thinking…") : "📍 " + t("Track")}</button>
      </div>
      {r && (r.error ? <p style={{ color: "var(--ac)" }}>{t("Code not found.")}</p> : (
        <div style={{ marginTop: 16 }}>
          <h3 style={{ margin: "0 0 8px" }}>{r.car}</h3>
          {STAGES.map((s, i) => {
            const done = i < r.stage, cur = i === r.stage;
            return (
              <div key={s} className={"tl" + (cur ? " on" : "")}>
                <span>{done ? "✅" : cur ? "🔵" : "⚪"} {t(s)}</span>
                <span>{(r.stage_dates && r.stage_dates[i]) || ""}</span>
              </div>
            );
          })}
          {r.stage >= STAGES.length && <p><b>🎉 {t("Delivered")}</b></p>}
          {r.notes && <p style={{ color: "var(--mu)" }}>{r.notes}</p>}
          {(r.container || r.vessel) && (
            <p style={{ color: "var(--mu)" }}>
              {r.container ? <>{t("Container")}: <b style={{ color: "var(--tx)" }}>{r.container}</b> </> : null}
              {r.vessel ? <>· {t("Vessel")}: <b style={{ color: "var(--tx)" }}>{r.vessel}</b></> : null}
            </p>
          )}
        </div>
      ))}

      <h3 style={{ margin: "24px 0 4px" }}>🌐 {t("Track on other websites")}</h3>
      <p className="sub" style={{ margin: "0 0 10px", fontSize: 13 }}>{t("These links open the carrier's own website. Ask us for your container or bill of lading number.")}</p>
      <div className="two">
        <div><label>{t("Carrier / website")}</label>
          <select style={sel} value={ti} onChange={(e) => setTi(+e.target.value)}>{TRACKERS.map((x, i) => <option key={x.name} value={i}>{x.name}</option>)}</select></div>
        <div><label>{t("Container or bill of lading number")}</label><input value={num} onChange={(e) => setNum(e.target.value)} placeholder="MSKU1234567" /></div>
      </div>
      <button type="button" className="btn" style={{ marginTop: 12 }} onClick={() => openTracker(TRACKERS[ti], num, setMsg, t)}>{t("Copy number and open tracker")} ↗</button>
      {msg && <p style={{ color: "var(--ac2)", fontSize: 13 }}>{msg}</p>}
    </div>
  );
}
