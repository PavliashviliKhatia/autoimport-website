"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useT } from "@/lib/i18n";
import AITools from "./AITools";

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
      <button className="aifab" onClick={() => setOpen(!open)} aria-label="AI">🤖 <span>{t("AI car assistant")}</span></button>
    </>
  );
}
