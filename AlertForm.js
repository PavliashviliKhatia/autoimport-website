"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useT } from "@/lib/i18n";
import { wa } from "@/lib/site";

export default function AlertForm({ initial = "" }) {
  const t = useT();
  const [f, setF] = useState({ make_model: "", year_from: "", max_price: "", max_total: "", auction: "any", damage: "", channel: "WhatsApp", contact: "", request: initial });
  const [st, setSt] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const send = async () => {
    if (!f.contact.trim() || !(f.make_model.trim() || f.request.trim())) return setSt(t("Please fill in contact and request."));
    const row = { contact: f.contact.trim(), channel: f.channel, request: (f.request || f.make_model).trim(), make_model: f.make_model.trim(), year_from: +f.year_from || null, max_price: +f.max_price || null, max_total: +f.max_total || null, auction: f.auction, damage: f.damage.trim() };
    if (!supabase) return window.open(wa(`Car alert: ${row.make_model} ${row.request}\nFrom ${row.year_from || "-"}, max ${row.max_price || "-"} / total ${row.max_total || "-"}\nContact: ${row.contact}`), "_blank", "noopener");
    const { error } = await supabase.from("alerts").insert(row);
    setSt(error ? t("Could not send. Please use WhatsApp.") : t("Saved! We will contact you when a matching car appears."));
  };
  const sel = { width: "100%", background: "var(--card)", border: "1px solid var(--bd)", color: "var(--tx)", padding: "10px 12px", borderRadius: 12, font: "inherit" };
  return (
    <form onSubmit={(e) => e.preventDefault()} style={{ marginTop: 18 }}>
      <h3 style={{ margin: "0 0 4px" }}>🔔 {t("Get a notification when a matching car appears")}</h3>
      <div className="two">
        <div><label>{t("Car (make and model)")}</label><input value={f.make_model} onChange={set("make_model")} placeholder="Tesla Model 3" /></div>
        <div><label>{t("Year from")}</label><input type="number" value={f.year_from} onChange={set("year_from")} placeholder="2022" /></div>
        <div><label>{t("Max car price (USD)")}</label><input type="number" value={f.max_price} onChange={set("max_price")} /></div>
        <div><label>{t("Maximum total budget (USD, including delivery)")}</label><input type="number" value={f.max_total} onChange={set("max_total")} /></div>
        <div><label>{t("Auction")}</label><select style={sel} value={f.auction} onChange={set("auction")}><option value="any">{t("Any")}</option><option>Copart</option><option>IAAI</option><option>Manheim</option></select></div>
        <div><label>{t("Preferred damage (optional)")}</label><input value={f.damage} onChange={set("damage")} placeholder="front, minor…" /></div>
      </div>
      <label>{t("What are you looking for?")}</label>
      <textarea rows="2" value={f.request} onChange={set("request")} />
      <div className="two">
        <div><label>{t("How should we contact you?")}</label><select style={sel} value={f.channel} onChange={set("channel")}><option>WhatsApp</option><option>Telegram</option><option value="Email">{t("Email")}</option></select></div>
        <div><label>{t("Your contact (WhatsApp, Telegram or email)")}</label><input value={f.contact} onChange={set("contact")} /></div>
      </div>
      <button className="btn" style={{ marginTop: 14 }} onClick={send}>{t("Notify me")}</button>
      {st && <p style={{ color: "var(--ac2)" }}>{st}</p>}
    </form>
  );
}
