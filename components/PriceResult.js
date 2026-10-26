"use client";
import { useT } from "@/lib/i18n";
import { money } from "@/lib/site";

const COL = { cheap: "#2ecc71", fair: "#3da5ff", expensive: "#e5322d", unclear: "#9aa3b5" };
const LBL = { cheap: "Cheap", fair: "Fair", expensive: "Expensive", unclear: "Unclear" };

export default function PriceResult({ res, price }) {
  const t = useT();
  if (res.error) return <p style={{ color: "var(--ac)" }}>{res.error}</p>;
  const { low_usd: lo, high_usd: hi, avg_usd: av } = res;
  const has = lo && hi && hi > lo;
  const pct = has ? Math.max(0, Math.min(100, ((price - lo) / (hi - lo)) * 100)) : 0;
  return (
    <div style={{ marginTop: 16, fontSize: 14 }}>
      <p><b style={{ color: COL[res.position] || COL.unclear }}>● {t(LBL[res.position] || "Unclear")}</b> — {res.position_note}</p>
      {has && (
        <>
          <div style={{ position: "relative", height: 10, borderRadius: 6, background: "linear-gradient(90deg,#2ecc71,#ffb703,#e5322d)", margin: "18px 0 6px" }}>
            <i style={{ position: "absolute", left: `calc(${pct}% - 7px)`, top: -4, width: 14, height: 18, borderRadius: 4, background: "#fff", border: "2px solid #111" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "var(--mu)", gap: 8, flexWrap: "wrap" }}>
            <span>{t("Lowest")} {money(lo)}</span>{av ? <span>{t("Average")} {money(av)}</span> : null}<span>{t("Highest")} {money(hi)}</span>
          </div>
        </>
      )}
      {res.trend_note && <p><b>{t("Price trend")}:</b> {res.trend_note}</p>}
      {res.resale_note && <p><b>{t("Resale value")}:</b> {res.resale_note}</p>}
      <p style={{ color: "var(--mu)" }}>{t("Confidence")}: {res.confidence} · {res.caveat}</p>
      {res._sources && res._sources.length > 0 && (
        <p style={{ color: "var(--mu)" }}>{t("Sources")}: {res._sources.map((s, i) => (
          <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", marginRight: 8 }}>{s.title || "link"}</a>
        ))}</p>
      )}
    </div>
  );
}
