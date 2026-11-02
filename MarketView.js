"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useT } from "@/lib/i18n";
import { shrink } from "@/lib/img";
import { money, wa } from "@/lib/site";

const Placeholder = () => <svg viewBox="0 0 120 40" fill="currentColor"><path d="M6 28c0-4 2-6 6-7l12-9c3-2 6-3 10-3h26c5 0 9 2 12 5l8 6c9 1 14 3 14 8v2H6z" /><circle cx="30" cy="31" r="7" fill="#12151d" /><circle cx="90" cy="31" r="7" fill="#12151d" /></svg>;

export default function MarketView({ listings }) {
  const t = useT();
  const [f, setF] = useState({ make: "", model: "", year: "", price: "", miles: "", city: "", contact: "", description: "" });
  const [files, setFiles] = useState([]);
  const [st, setSt] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const send = async () => {
    if (!f.make.trim() || !f.model.trim() || !f.contact.trim()) return setSt(t("Please fill in contact and request."));
    if (!supabase) return setSt("…");
    setBusy(true); setSt("…");
    try {
      const images = [];
      for (const x of files.slice(0, 4)) {
        const b64 = await shrink(x, 1000, 0.7);
        const blob = await (await fetch("data:image/jpeg;base64," + b64)).blob();
        const path = crypto.randomUUID() + ".jpg";
        const { error } = await supabase.storage.from("market").upload(path, blob, { contentType: "image/jpeg" });
        if (error) throw error;
        images.push(supabase.storage.from("market").getPublicUrl(path).data.publicUrl);
      }
      const { error } = await supabase.from("market_listings").insert({ make: f.make.trim(), model: f.model.trim(), year: +f.year || null, price: +f.price || null, miles: +f.miles || null, city: f.city.trim(), contact: f.contact.trim(), description: f.description.trim(), images });
      if (error) throw error;
      setSt(t("Thank you! Your listing will appear after review.")); setF({ make: "", model: "", year: "", price: "", miles: "", city: "", contact: "", description: "" }); setFiles([]);
    } catch (e) { setSt(t("Could not send. Please use WhatsApp.")); }
    setBusy(false);
  };
  return (
    <>
      <div className="grid">
        {listings.length === 0 && <div className="empty">{t("No listings yet.")}</div>}
        {listings.map((c) => {
          const d = String(c.contact).replace(/\D/g, "");
          return (
            <div className="car in" key={c.id} style={{ cursor: "default" }}>
              <div className="ph">{c.images && c.images[0] ? <img src={c.images[0]} alt="" loading="lazy" /> : <Placeholder />}</div>
              <div className="info">
                <h3>{c.year} {c.make} {c.model}</h3>
                <div className="meta">{c.miles ? <span>{Number(c.miles).toLocaleString()} km</span> : null}{c.city ? <span>{c.city}</span> : null}</div>
                {c.description && <p style={{ color: "var(--mu)", fontSize: 13, margin: "0 0 8px" }}>{c.description}</p>}
                <div className="price">{c.price ? money(c.price) : ""}</div>
                {d.length > 6 && <a className="chip on" style={{ display: "inline-block", marginTop: 8 }} target="_blank" rel="noopener noreferrer" href={"https://wa.me/" + d + "?text=" + encodeURIComponent(`Hello! I'm interested in your ${c.year} ${c.make} ${c.model}.`)}>WhatsApp</a>}
              </div>
            </div>
          );
        })}
      </div>
      <h2 style={{ marginTop: 50 }}>{t("Sell your car")}</h2>
      <form className="co" onSubmit={(e) => e.preventDefault()}>
        <div className="two">
          <div><label>{t("Make")}</label><input value={f.make} onChange={set("make")} /></div>
          <div><label>{t("Model")}</label><input value={f.model} onChange={set("model")} /></div>
          <div><label>{t("Year")}</label><input type="number" value={f.year} onChange={set("year")} /></div>
          <div><label>{t("Price (USD)")}</label><input type="number" value={f.price} onChange={set("price")} /></div>
          <div><label>{t("Mileage")} (km)</label><input type="number" value={f.miles} onChange={set("miles")} /></div>
          <div><label>{t("City")}</label><input value={f.city} onChange={set("city")} /></div>
        </div>
        <label>{t("Your contact (WhatsApp, Telegram or email)")}</label><input value={f.contact} onChange={set("contact")} />
        <label>{t("Description")}</label><textarea rows="3" value={f.description} onChange={set("description")} />
        <label>{t("Photos (optional, up to 4)")}</label><input type="file" accept="image/*" multiple onChange={(e) => setFiles([...e.target.files].slice(0, 4))} />
        <button className="btn" style={{ marginTop: 14 }} disabled={busy} onClick={send}>{t("Submit for review")}</button>
        {st && <p style={{ color: "var(--ac2)" }}>{st}</p>}
      </form>
    </>
  );
}
