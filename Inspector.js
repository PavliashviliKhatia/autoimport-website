"use client";
import { useState } from "react";
import { useLang, useT } from "@/lib/i18n";
import { shrink } from "@/lib/img";

const COL = { minor: "#2ecc71", moderate: "#ffb703", severe: "#e5322d", unclear: "#9aa3b5" };

export default function Inspector() {
  const t = useT();
  const { lang } = useLang();
  const [files, setFiles] = useState([]);
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const go = async () => {
    if (!files.length) return;
    setBusy(true); setErr(""); setRes(null);
    try {
      const images = [];
      for (const f of files.slice(0, 4)) images.push(await shrink(f));
      const r = await fetch("/api/ai", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode: "inspect", images, lang }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Error");
      setRes(j);
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };
  return (
    <div className="co">
      <input type="file" accept="image/*" multiple onChange={(e) => setFiles([...e.target.files].slice(0, 4))} />
      {files.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          {files.map((f, i) => <img key={i} src={URL.createObjectURL(f)} alt="" style={{ height: 64, borderRadius: 8 }} />)}
        </div>
      )}
      <button className="btn" style={{ marginTop: 14 }} disabled={busy || !files.length} onClick={go}>{busy ? t("Thinking…") : "🔍 " + t("Analyze photos")}</button>
      {err && <p style={{ color: "var(--ac)" }}>{err}</p>}
      {res && (
        <div style={{ marginTop: 18 }}>
          <p><b>{res.overall}</b></p>
          {(res.findings || []).map((f, i) => (
            <div key={i} className="tl" style={{ borderColor: COL[f.severity] || "var(--bd)", display: "block" }}>
              <b>{f.area}</b> <small style={{ color: COL[f.severity] }}>● {f.severity}{f.photo ? ` · #${f.photo}` : ""}</small>
              <div style={{ color: "var(--mu)", fontWeight: 400 }}>{f.note}</div>
            </div>
          ))}
          {res.consistency && <p><b>{t("Consistency across photos")}:</b> {res.consistency}</p>}
          {res.cannot_judge && <p style={{ color: "var(--mu)" }}><b>{t("Cannot be judged from photos")}:</b> {res.cannot_judge}</p>}
        </div>
      )}
    </div>
  );
}
