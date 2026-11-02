"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useT } from "@/lib/i18n";
import { wa } from "@/lib/site";

export default function RequestForm({ type, detailsLabel, extraLabel, placeholder = "", button = "Send request" }) {
  const t = useT();
  const [f, setF] = useState({ contact: "", details: "", extra: "" });
  const [st, setSt] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const send = async () => {
    if (!f.contact.trim() || !f.details.trim()) return setSt(t("Please fill in contact and request."));
    if (!supabase) return window.open(wa(`[${type}] ${f.details}\n${f.extra}\nContact: ${f.contact}`), "_blank", "noopener");
    const { error } = await supabase.from("requests").insert({ type, contact: f.contact.trim(), details: f.details.trim(), extra: f.extra.trim() });
    setSt(error ? t("Could not send. Please use WhatsApp.") : t("Sent! We will contact you soon."));
    if (!error) setF({ contact: "", details: "", extra: "" });
  };
  return (
    <form className="co" onSubmit={(e) => e.preventDefault()}>
      {extraLabel && <><label>{t(extraLabel)}</label><input value={f.extra} onChange={set("extra")} /></>}
      <label>{t(detailsLabel)}</label>
      <textarea rows="3" value={f.details} onChange={set("details")} placeholder={placeholder} />
      <label>{t("Your contact (WhatsApp, Telegram or email)")}</label>
      <input value={f.contact} onChange={set("contact")} />
      <button className="btn" style={{ marginTop: 14 }} onClick={send}>{t(button)}</button>
      {st && <p style={{ color: "var(--ac2)" }}>{st}</p>}
    </form>
  );
}
