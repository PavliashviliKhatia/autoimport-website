"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { T as D } from "./translations";

const Ctx = createContext({ lang: "en", setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, set] = useState("en");
  useEffect(() => {
    try { const l = localStorage.getItem("lang"); if (l) set(l); } catch (e) {}
  }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const setLang = (l) => { set(l); try { localStorage.setItem("lang", l); } catch (e) {} };
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}
export const useLang = () => useContext(Ctx);
export function useT() {
  const { lang } = useLang();
  return (s) => {
    const t = D[s];
    if (!t) return s;
    return lang === "ru" ? t[0] : lang === "ka" ? t[1] : s;
  };
}
// <T>English text</T> -> translated text (works inside server components too)
export function T({ children }) {
  const t = useT();
  return t(children);
}
