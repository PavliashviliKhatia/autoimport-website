"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n";

export default function HeroSearch() {
  const router = useRouter();
  const t = useT();
  const [q, setQ] = useState("");
  const [year, setYear] = useState("");
  const [max, setMax] = useState("");
  const y = new Date().getFullYear();
  const go = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (year) p.set("year", year);
    if (max) p.set("max", max);
    router.push("/cars" + (p.toString() ? "?" + p.toString() : ""));
  };
  const sel = { background: "var(--card)", border: "1px solid var(--bd)", color: "var(--tx)", padding: "12px 14px", borderRadius: 999, font: "inherit" };
  return (
    <form className="bar" style={{ marginTop: 18, maxWidth: 640 }} onSubmit={go}>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("Search make, model, year…")} />
      <select style={sel} value={year} onChange={(e) => setYear(e.target.value)}>
        <option value="">{t("Year from")}</option>
        {Array.from({ length: 15 }, (_, i) => y - i).map((v) => <option key={v} value={v}>{v}</option>)}
      </select>
      <input type="number" style={{ maxWidth: 160, minWidth: 120 }} value={max} onChange={(e) => setMax(e.target.value)} placeholder={t("Max car price (USD)")} />
      <button className="btn">🔍</button>
    </form>
  );
}
