"use client";

// Anything wrapped in <OpenAI tab="damage"> opens the floating AI panel on that tab.
export default function OpenAI({ tab = "assistant", className, style, children }) {
  const open = () => window.dispatchEvent(new CustomEvent("open-ai", { detail: { tab } }));
  return (
    <span role="button" tabIndex={0} className={className} style={{ cursor: "pointer", display: "inline-block", ...style }}
      onClick={open} onKeyDown={(e) => { if (e.key === "Enter") open(); }}>{children}</span>
  );
}
