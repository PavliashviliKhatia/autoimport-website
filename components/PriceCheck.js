"use client";
import { useState } from "react";
import { useLang, useT } from "@/lib/i18n";
import PriceResult from "./PriceResult";

export default function PriceCheck() {
  const t = useT();
  const { lang } = useLang();
  const [f, setF] = useState({ make: "", model: "", year: "", miles: "", price: "" });
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const go = async () => {
    setBusy(true); setRes(null);
    try {
      const r = await fetch("/api/ai", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode: "price", car: f, lang }) });
      setRes(await r.json());
    } catch (e) { setRes({ error: "Error" }); }
    setBusy(false);
  };
  return (
    <div className="co">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="two">
          <div><label>{t("Make")}</label><input value={f.make} onChange={set("make")} placeholder="BMW" /></div>
          <div><label>{t("Model")}</label><input value={f.model} onChange={set("model")} placeholder="X5" /></div>
          <div><label>{t("Year")}</label><input type="number" value={f.year} onChange={set("year")} /></div>
          <div><label>{t("Mileage")}</label><input type="number" value={f.miles} onChange={set("miles")} /></div>
        </div>
        <label>{t("Price (USD)")}</label><input type="number" value={f.price} onChange={set("price")} />
        <button className="btn" style={{ marginTop: 14 }} disabled={busy || !f.make || !f.model || !f.price} onClick={go}>{busy ? t("Thinking…") : "💰 " + t("Check price")}</button>
      </form>
      {res && <PriceResult res={res} price={+f.price} />}
    </div>
  );
}
