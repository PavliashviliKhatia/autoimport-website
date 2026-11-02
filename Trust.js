import { T } from "@/lib/i18n";
import { SITE, TRUST } from "@/lib/site";
import Reviews from "./Reviews";

const STEPS = [
  "Written contract before any payment",
  "Pay only to the company's official account against an invoice",
  "You receive the auction receipt and purchase documents",
  "Shipping tracking at every stage",
  "Documents and car handover with a signed act",
];

export default function Trust({ reviews }) {
  const n = reviews.length;
  const avg = n ? (reviews.reduce((a, r) => a + r.rating, 0) / n).toFixed(1) : null;
  const years = TRUST.founded ? Math.max(1, new Date().getFullYear() - TRUST.founded) : null;
  const card = { background: "var(--card)", border: "1px solid var(--bd)", borderRadius: 18, padding: 18 };
  return (
    <section id="trust">
      <div className="wrap">
        <h2>🏆 <T>Why customers trust us</T></h2>
        <p className="sub" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
          {TRUST.companyId ? <div style={card}><b>✓ <T>Verified business</T></b><br /><small style={{ color: "var(--mu)" }}><T>Company ID</T>: {TRUST.companyId}</small></div> : null}
          {years ? <div style={card}><b>📅 {years}+ <T>years in business</T></b><br /><small style={{ color: "var(--mu)" }}>{TRUST.founded}</small></div> : null}
          {TRUST.deals ? <div style={card}><b>🚗 {TRUST.deals}+</b><br /><small style={{ color: "var(--mu)" }}><T>Cars delivered</T></small></div> : null}
          {avg ? <div style={card}><b>⭐ {avg} / 5</b><br /><small style={{ color: "var(--mu)" }}>{n} <T>reviews</T></small></div> : null}
          <div style={card}><b>📞 <T>Verified contact</T></b><br /><small style={{ color: "var(--mu)" }}>{SITE.phone}<br />{SITE.email}<br />{SITE.address}</small></div>
        </div>

        <h3 style={{ marginTop: 30 }}>🔒 <T>Safe deal process</T></h3>
        <div className="co">
          {STEPS.map((s, i) => (
            <div key={s} className="tl"><span>{i + 1}. <T>{s}</T></span></div>
          ))}
        </div>

        <Reviews reviews={reviews} />
      </div>
    </section>
  );
}
