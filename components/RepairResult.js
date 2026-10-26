"use client";
import { useT } from "@/lib/i18n";
import { money } from "@/lib/site";
const rng = (r) => (r && r.length === 2 ? `${money(r[0])}–${money(r[1])}` : "—");

export default function RepairResult({ res, base = 0 }) {
  const t = useT();
  if (res.error) return <p style={{ color: "var(--ac)" }}>{res.error}</p>;
  const tot = res.repair_total_usd;
  return (
    <div style={{ marginTop: 12, fontSize: 14 }}>
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
      {tot && base > 0 && <p style={{ color: "var(--ac2)" }}><b>{t("Total budget (car + repair)")}: {money(base + tot[0])}–{money(base + tot[1])}</b></p>}
      <small style={{ color: "var(--mu)" }}>{t("Does not include transport and customs.")} {res.caveat}</small>
    </div>
  );
}
