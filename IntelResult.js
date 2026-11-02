"use client";
import { useT } from "@/lib/i18n";
import PriceResult from "./PriceResult";

const V = { buy: ["Worth buying", "#2ecc71"], consider: ["Consider carefully", "#ffb703"], avoid: ["Not recommended", "#e5322d"], unclear: ["Not enough data", "#9aa3b5"] };
const SEV = { minor: "#2ecc71", moderate: "#ffb703", severe: "#e5322d", unclear: "#9aa3b5" };

export default function IntelResult({ res, price }) {
  const t = useT();
  if (res.error) return <p style={{ color: "var(--ac)" }}>{res.error}</p>;
  const v = V[res.verdict] || V.unclear;
  const p = res.price ? { ...res.price, position_note: res.price.note, confidence: res.confidence || "-", caveat: res.caveat || "", _sources: res._sources } : null;
  const list = (h, a) => (a && a.length ? <div><b>{t(h)}</b><ul style={{ color: "var(--mu)", margin: "4px 0 10px", paddingLeft: 20 }}>{a.map((x, i) => <li key={i}>{x}</li>)}</ul></div> : null);
  return (
    <div style={{ marginTop: 14, marginBottom: 14, fontSize: 14, border: "1px solid " + v[1], borderRadius: 16, padding: 16 }}>
      <b style={{ fontSize: 17, color: v[1] }}>● {t(v[0])}</b>
      <p>{res.verdict_note}</p>
      {p && <><b>{t("AI price check")}</b><PriceResult res={p} price={price} /></>}
      {res.visible_damage && res.visible_damage.length > 0 && (
        <div style={{ marginTop: 10 }}><b>{t("Visible damage")}</b>
          {res.visible_damage.map((d, i) => <div key={i} style={{ color: "var(--mu)" }}><b style={{ color: SEV[d.severity] }}>●</b> {d.area}: {d.note}</div>)}
        </div>
      )}
      {res.photos_note && <small style={{ color: "var(--mu)" }}>{t("Photos could not be analysed.")}</small>}
      <div style={{ marginTop: 10 }}>{list("Expected extra costs", res.extra_costs)}{list("Missing information", res.missing_info)}</div>
    </div>
  );
}
