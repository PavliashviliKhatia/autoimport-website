"use client";
import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";
import { STAGES, TRACKERS } from "@/lib/site";

// Open a direct result when the carrier supports a verified deep link.
// For other carriers, copy the reference and open their official search form.
async function openTracker(tracker, number, setMsg, t) {
  const n = (number || "").trim().replace(/\s+/g, "").toUpperCase();
  if (!n) {
    setMsg(t("Enter a container or bill of lading number first."));
    return;
  }

  // Maersk supports /tracking/{reference}; the result opens with the reference loaded.
  if (tracker.deepLink === "maersk") {
    window.open(`${tracker.url.replace(/\/$/, "")}/${encodeURIComponent(n)}`, "_blank", "noopener,noreferrer");
    setMsg(t("Opening Maersk tracking for this number."));
    return;
  }

  // Open synchronously inside the click handler so mobile popup blockers allow it.
  window.open(tracker.url, "_blank", "noopener,noreferrer");
  let copied = false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(n);
      copied = true;
    }
  } catch (_) {}

  if (!copied) {
    try {
      const el = document.createElement("textarea");
      el.value = n;
      el.setAttribute("readonly", "");
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      copied = document.execCommand("copy");
      document.body.removeChild(el);
    } catch (_) {}
  }

  setMsg(copied
    ? t("Number copied. Paste it into the carrier tracking form.")
    : t("Carrier tracking opened. Copy the number and paste it into the tracking form."));
}

export default function TrackForm() {
  const t = useT();
  const [code, setCode] = useState("");
  const [r, setR] = useState(null);
  const [busy, setBusy] = useState(false);
  const [ti, setTi] = useState(0);
  const [autoDetect, setAutoDetect] = useState(true);
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
  const normalizedNum = num.trim().replace(/\s+/g, "").toUpperCase();
  const detectedIndex = TRACKERS.findIndex((x) => x.prefixes?.some((prefix) => normalizedNum.startsWith(prefix)));
  const selectedIndex = autoDetect ? detectedIndex : ti;
  const selectedTracker = selectedIndex >= 0 ? TRACKERS[selectedIndex] : null;
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
      <p className="sub" style={{ margin: "0 0 10px", fontSize: 13 }}>{t("Enter your container or bill of lading number. We can recognize some container prefixes automatically. The carrier's own website provides the tracking results; if it cannot accept a direct link, your number is copied for pasting.")}</p>
      <div className="two">
        <div><label>{t("Container or bill of lading number")}</label><input value={num} onChange={(e) => { setNum(e.target.value); setMsg(""); }} placeholder="MSKU1234567" /></div>
        <div><label>{t("Carrier / website")}</label>
          <select style={sel} value={autoDetect ? "auto" : ti} onChange={(e) => { if (e.target.value === "auto") setAutoDetect(true); else { setAutoDetect(false); setTi(+e.target.value); } }}>
            <option value="auto">{t("Auto-detect carrier")}{detectedIndex >= 0 ? ` — ${TRACKERS[detectedIndex].name}` : ""}</option>
            {TRACKERS.map((x, i) => <option key={x.name} value={i}>{x.name}</option>)}
          </select></div>
      </div>
      {autoDetect && normalizedNum.length >= 4 && detectedIndex < 0 && <p className="sub" style={{ fontSize: 12, margin: "8px 0 0" }}>{t("Carrier not recognized from this number. Please select it manually.")}</p>}
      <button type="button" className="btn" style={{ marginTop: 12 }} disabled={!selectedTracker} onClick={() => selectedTracker && openTracker(selectedTracker, num, setMsg, t)}>{selectedTracker?.deepLink === "maersk" ? t("Track container") : t("Copy number and open tracker")} ↗</button>
      {msg && <p style={{ color: "var(--ac2)", fontSize: 13 }}>{msg}</p>}
    </div>
  );
}
