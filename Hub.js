import Link from "next/link";
import { T } from "@/lib/i18n";
import OpenAI from "./OpenAI";

const ITEMS = [
  ["🇺🇸", "US auctions", "Send us a Copart / IAAI lot and we check it for you.", "/auctions"],
  ["🚢", "Car import", "Order delivery and track your car step by step.", "/import"],
  ["🇬🇪", "Georgian car market", "Buy and sell cars in Georgia.", "/market"],
  ["🤖", "AI car assistant", "Describe the car you need — AI picks the best options.", "#ai"],
  ["🔧", "Parts and services", "Find parts, mechanics and service centers.", "/services"],
  ["🏢", "For dealers", "Partner terms for dealers and importers.", "/dealers"],
];

export default function Hub() {
  return (
    <section>
      <div className="wrap">
        <h2><T>Our directions</T></h2>
        <p className="sub" />
        <div className="steps">
          {ITEMS.map(([ic, t, d, href]) => {
            const inner = <><div style={{ fontSize: 34 }}>{ic}</div><h3><T>{t}</T></h3><p><T>{d}</T></p></>;
            return href === "#ai"
              ? <OpenAI key={t} tab="assistant" className="step" style={{ display: "block" }}>{inner}</OpenAI>
              : <Link key={t} href={href} className="step" style={{ display: "block" }}>{inner}</Link>;
          })}
        </div>
      </div>
    </section>
  );
}
