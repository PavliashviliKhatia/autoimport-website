"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useT } from "@/lib/i18n";

export default function Reviews({ reviews }) {
  const t = useT();
  const [f, setF] = useState({ name: "", rating: 5, text: "", car: "" });
  const [st, setSt] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const send = async () => {
    if (!f.name.trim() || !f.text.trim()) return setSt(t("Please fill in contact and request."));
    if (!supabase) return setSt("…");
    const { error } = await supabase.from("reviews").insert({ name: f.name.trim(), rating: +f.rating, text: f.text.trim(), car: f.car.trim() });
    setSt(error ? t("Could not send. Please use WhatsApp.") : t("Thank you! Your review will appear after approval."));
    if (!error) setF({ name: "", rating: 5, text: "", car: "" });
  };
  return (
    <div>
      <h3 style={{ marginTop: 30 }}>{t("Customer reviews")}</h3>
      <div className="grid">
        {reviews.length === 0 && <div className="empty">{t("Reviews are moderated before they appear.")}</div>}
        {reviews.map((r) => (
          <div key={r.id} className="step">
            <b style={{ color: "var(--ac2)" }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</b>
            <p style={{ color: "var(--tx)", fontSize: 15 }}>{r.text}</p>
            <small style={{ color: "var(--mu)" }}>{r.name}{r.car ? " · " + r.car : ""}{r.verified_buyer ? " · " + t("✓ Verified buyer") : ""}</small>
          </div>
        ))}
      </div>
      <form onSubmit={(e) => e.preventDefault()} style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 0 }}>{t("Leave a review")}</h3>
        <div className="two">
          <div><label>{t("Your name")}</label><input value={f.name} onChange={set("name")} /></div>
          <div><label>{t("Rating")}</label>
            <select value={f.rating} onChange={set("rating")} style={{ width: "100%", background: "var(--card)", border: "1px solid var(--bd)", color: "var(--tx)", padding: "10px 12px", borderRadius: 12, font: "inherit" }}>
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{"★".repeat(n)}</option>)}
            </select></div>
        </div>
        <label>{t("Car (optional)")}</label><input value={f.car} onChange={set("car")} />
        <label>{t("Your review")}</label><textarea rows="3" value={f.text} onChange={set("text")} />
        <button className="btn" style={{ marginTop: 14 }} onClick={send}>{t("Send review")}</button>
        {st && <p style={{ color: "var(--ac2)" }}>{st}</p>}
        <small style={{ color: "var(--mu)" }}>{t("Reviews are moderated before they appear.")}</small>
      </form>
    </div>
  );
}
