"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useT } from "@/lib/i18n";
import AITools from "./AITools";
import { wa } from "@/lib/site";

// Floating AI button (bottom right, every page) + the panel with all AI tools.
export default function FloatingAI({ cars }) {
  const t = useT();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("assistant");
  useEffect(() => {
    const f = (e) => { setTab((e.detail && e.detail.tab) || "assistant"); setOpen(true); };
    window.addEventListener("open-ai", f);
    return () => window.removeEventListener("open-ai", f);
  }, []);
  if (path.startsWith("/admin")) return null;
  return (
    <>
      {open && (
        <div className="aipanel" role="dialog" aria-label="AI">
          <div className="hd"><b>🤖 {t("AI car assistant")}</b><button className="chip" onClick={() => setOpen(false)} aria-label="Close">✕</button></div>
          <AITools cars={cars} tab={tab} setTab={setTab} />
        </div>
      )}
      <div className="floating-shortcuts">
        {!open && <a className="whatsapp-fab" href={wa()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.669.149-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.007-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12 21.8a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.72.98.99-3.62-.24-.37A9.8 9.8 0 1 1 12 21.8M12 .2A11.8 11.8 0 0 0 1.8 17.9L.13 24l6.24-1.64A11.8 11.8 0 1 0 12 .2"/></svg></a>}
      <button type="button" className="aifab" onClick={() => setOpen(!open)} aria-label={t("AI car assistant")} title={t("AI car assistant")} aria-expanded={open}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="7" width="16" height="13" rx="4"/><path d="M12 7V3m-2 0h4M2 12v4m20-4v4M9 16h6"/><circle cx="9" cy="12" r=".7" fill="currentColor"/><circle cx="15" cy="12" r=".7" fill="currentColor"/></svg></button>
      </div>
    </>
  );
}
