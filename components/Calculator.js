"use client";
import { useState } from "react";
import { useT } from "@/lib/i18n";
import { money } from "@/lib/site";

const BASE = [["Auction price", 12000], ["Auction and broker fees", 1200], ["Customs and excise", 2800]];
const COL = ["#3da5ff", "#2ec4b6", "#e5322d", "#ffb703", "#a78bfa", "#f472b6", "#9aa3b5"];
const fresh = () => BASE.map(([label, v]) => ({ label, value: String(v), fixed: true }));
const num = (x) => Math.max(0, parseFloat(x) || 0);

// Type your numbers, add your own cost lines, and the total is summed up live.
export default function Calculator() {
  const t = useT();
  const [rows, setRows] = useState(fresh());
  const total = rows.reduce((a, r) => a + num(r.value), 0);
  const upd = (i, p) => setRows(rows.map((r, j) => (j === i ? { ...r, ...p } : r)));
  return (
    <div className="calc">
      <div className="co">
        <h3 style={{ margin: "0 0 14px" }}>{t("Enter your numbers")}</h3>
        {rows.map((r, i) => (
          <div className="crow" key={i}>
            {r.fixed
              ? <label>{t(r.label)}</label>
              : <input className="cl" value={r.label} placeholder={t("Other cost")} onChange={(e) => upd(i, { label: e.target.value })} />}
            <div className="money">
              <span>$</span>
              <input type="number" inputMode="decimal" min="0" placeholder="0" value={r.value} onFocus={(e) => e.target.select()} onChange={(e) => upd(i, { value: e.target.value })} />
            </div>
            {!r.fixed && <button type="button" className="chip" onClick={() => setRows(rows.filter((_, j) => j !== i))} aria-label="Remove">✕</button>}
          </div>
        ))}
        <div className="mini">
          <button type="button" className="chip on" onClick={() => setRows([...rows, { label: "", value: "", fixed: false }])}>＋ {t("Add cost")}</button>
          <button type="button" className="chip" onClick={() => setRows(fresh())}>{t("Reset")}</button>
        </div>
      </div>
      <div className="co">
        <small>{t("Your total")}</small>
        <div className="tot">{money(total)}</div>
        <div className="sb">
          {rows.map((r, i) => <i key={i} style={{ width: (total ? (num(r.value) / total) * 100 : 0) + "%", background: COL[i % COL.length] }} />)}
        </div>
        <div className="lgd">
          {rows.map((r, i) => (
            <div key={i}><span><em style={{ background: COL[i % COL.length] }} />{r.fixed ? t(r.label) : r.label || t("Other cost")}</span><b>{money(num(r.value))}</b></div>
          ))}
        </div>
        <div className="nt">{t("Transport and ocean freight are not included unless you add them as a cost.")}</div>
        <small>{t("Estimate only. Customs and excise depend on engine size, year and fuel type.")}</small>
      </div>
    </div>
  );
}
