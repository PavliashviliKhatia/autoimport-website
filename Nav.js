"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang, T } from "@/lib/i18n";
import { SITE, wa } from "@/lib/site";

// [href, label, show in the top bar]  (everything also appears in the phone menu)
const ALL = [
  ["/", "Home", 1], ["/cars", "Cars", 1], ["/auctions", "Auctions", 1], ["/import", "Import", 1],
  ["/market", "Market", 1], ["/services", "Services", 1],
  ["/dealers", "For dealers", 0], ["/radar", "Radar", 0], ["/about", "About", 1], ["/contact", "Contact", 1],
];

export default function Nav() {
  const { lang, setLang } = useLang();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const act = (h) => (h === "/" ? path === "/" : path.startsWith(h));
  return (
    <nav>
      <div className="wrap">
        <Link className="logo" href="/" onClick={() => setOpen(false)}>AUTO<b>USA</b>KHATIA</Link>
        <div className="links">
          {ALL.filter((x) => x[2]).map(([h, l]) => <Link key={h} href={h} className={act(h) ? "act" : ""}><T>{l}</T></Link>)}
        </div>
        <div className="r">
          <a className="nbtn call" href={"tel:" + SITE.phone.replace(/\s/g, "")} aria-label="Call">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
            <span>{SITE.phone}</span>
          </a>
          <a className="nbtn wa" href={wa()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>
          </a>
          <span className="lg">
            {["en", "ru", "ka"].map((l) => <button key={l} className={lang === l ? "on" : ""} onClick={() => setLang(l)}>{l.toUpperCase()}</button>)}
          </span>
          <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu">{open ? "✕" : "☰"}</button>
        </div>
        <Link href="/" className="brandpic" aria-label="AUTOUSAKHATIA" onClick={() => setOpen(false)}><img src="/logo.svg" alt="AUTOUSAKHATIA" width="48" height="48" /></Link>
      </div>
      {open && (
        <div className="menu">
          {ALL.map(([h, l]) => <Link key={h} href={h} className={act(h) ? "act" : ""} onClick={() => setOpen(false)}><T>{l}</T></Link>)}
        </div>
      )}
    </nav>
  );
}
