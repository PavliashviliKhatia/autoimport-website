"use client";
import { useState } from "react";
import { useT } from "@/lib/i18n";
import { SITE, wa } from "@/lib/site";

export default function Contact() {
  const t = useT();
  const [f, setF] = useState({ name: "", phone: "", car: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const send = () =>
    window.open(wa(`Hello AUTOUSAKHATIA! My name is ${f.name || "-"}.\nPhone: ${f.phone || "-"}\nI'm looking for: ${f.car || "-"}`), "_blank", "noopener");
  return (
    <section id="contact">
      <div className="wrap">
        <div className="cg contact-card">
          <div>
            <h2>{t("Tell us what you want")}</h2>
            <p className="sub">{t("Model, year and budget are enough. We reply the same day.")}</p>
            <form onSubmit={(e) => e.preventDefault()}>
              <label>{t("Your name")}</label><input value={f.name} onChange={set("name")} autoComplete="name" />
              <label>{t("Phone")}</label><input type="tel" value={f.phone} onChange={set("phone")} autoComplete="tel" />
              <label>{t("Car and budget")}</label>
              <textarea rows="3" value={f.car} onChange={set("car")} placeholder="Toyota Camry 2020, up to $15,000" />
              <button className="btn" onClick={send}>{t("Send on WhatsApp")}</button>
            </form>
          </div>
          <div className="dc contact-direct">
            <h3>{t("Or reach us directly")}</h3>
            <a href={"tel:" + SITE.phone.replace(/\s/g, "")}>📞 {SITE.phone}</a>
            <a href={wa()} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <p>📍 <a href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(SITE.address + ", Georgia")} target="_blank" rel="noopener noreferrer">{SITE.address}</a><small>{t("Open Monday to Saturday.")}</small></p>
            <a href={"mailto:" + SITE.email}>✉️ {SITE.email}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
