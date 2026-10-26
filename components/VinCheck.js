"use client";
import { useState } from "react";
import { useT } from "@/lib/i18n";

export default function VinCheck({ car }) {
  const t = useT();
  const [r, setR] = useState(null);
  const [b, setB] = useState(false);
  const go = async () => {
    setB(true);
    try { setR(await (await fetch("/api/vin?vin=" + encodeURIComponent(car.vin))).json()); } catch (e) { setR({ error: "Error" }); }
    setB(false);
  };
  const bad = r && !r.error
    ? [[r.make, car.make], [r.model, car.model], [r.year, car.year]].filter(([a, c]) => a && c && !String(a).toLowerCase().includes(String(c).toLowerCase()) && !String(c).toLowerCase().includes(String(a).toLowerCase()))
    : [];
  return (
    <div style={{ marginBottom: 12 }}>
      <button className="btn g" disabled={b} onClick={go}>{b ? t("Thinking…") : "🔎 " + t("Decode VIN")}</button>
      {r && (r.error ? <p style={{ color: "var(--ac)" }}>{r.error}</p> : (
        <div style={{ fontSize: 14, marginTop: 8 }}>
          {bad.length > 0 && <p style={{ color: "var(--ac)" }}>⚠ {t("VIN does not match the listing!")}</p>}
          <div style={{ color: "var(--mu)" }}>
            {[["Make", r.make], ["Model", r.model], ["Year", r.year], ["Body", r.body], ["Engine", r.engine], ["Fuel", r.fuel], ["Drive", r.drive], ["Made in", r.country]].filter((x) => x[1]).map((x) => <div key={x[0]}>{x[0]}: <b style={{ color: "var(--tx)" }}>{x[1]}</b></div>)}
          </div>
        </div>
      ))}
    </div>
  );
}
