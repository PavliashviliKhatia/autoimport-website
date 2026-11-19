import Link from "next/link";
import { T } from "@/lib/i18n";
import Collections from "@/components/Collections";
import Contact from "@/components/Contact";
import Hub from "@/components/Hub";
import QuickTools from "@/components/QuickTools";
import HeroSearch from "@/components/HeroSearch";
import { getCars } from "@/lib/cars";
import { STAGES } from "@/lib/site";

const DAYS = ["Day 0", "3–7 days", "35–45 days", "2–4 days", "1–3 days"];

export const revalidate = 30;
export default async function Home() {
  const cars = await getCars();
  const count = (s) => cars.filter((c) => c.status === s).length;
  return (
    <main>
      <header className="hero">
        <div className="wrap">
          <div className="tag route-banner"><img src="/flags/us.svg" alt="" /><T>USA → Georgia</T><img src="/flags/ge.svg" alt="" /></div>
          <div className="hero-copy">
          <h1><T>Your dream car,</T><br /><span><T>straight from America.</T></span></h1>
          <p><T>We find, buy, ship and clear cars from US auctions. Transparent prices, real photos, full support from bid to keys.</T></p>
          <div className="cta">
            <Link className="btn" href="/cars"><T>Browse cars →</T></Link>
            <Link className="btn g" href="/#tools"><T>Cost estimate</T></Link>
          </div>
          <HeroSearch />
          </div>
          <div className="rc">
            <svg viewBox="0 0 400 170">
              <path id="rp" d="M20 140C100 20 200 20 280 100S350 140 380 80" fill="none" stroke="#e5322d" strokeWidth="3" strokeDasharray="7 6" />
              <g fill="var(--bg)" stroke="#fff" strokeWidth="2.5"><circle cx="20" cy="140" r="6" /><circle cx="280" cy="100" r="6" /><circle cx="380" cy="80" r="6" /></g>
              <text x="8" y="162"><T>USA</T></text><text x="262" y="126"><T>Poti</T></text><text x="340" y="62"><T>Tbilisi</T></text>
              <circle r="7" fill="#ffb703"><animateMotion dur="6s" repeatCount="indefinite"><mpath href="#rp" /></animateMotion></circle>
            </svg>
            {STAGES.map((s, i) => (
              <div className={"tl" + (i === 2 ? " on" : "")} key={s}><span><T>{s}</T></span><span><T>{DAYS[i]}</T></span></div>
            ))}
          </div>
        </div>
        <div className="road" />
      </header>

      <div className="wrap stats">
        <div className="stat"><b>{count("available")}</b><span><T>Available now</T></span></div>
        <div className="stat"><b>{count("transit")}</b><span><T>In transit</T></span></div>
        <div className="stat"><b>{count("sold")}</b><span><T>Sold</T></span></div>
      </div>

      <section id="latest" style={{ background: "var(--bg2)" }}>
        <div className="wrap">
          <h2><T>Our cars</T></h2>
          <p className="sub"><T>Fresh arrivals, cars in transit and recently sold.</T></p>
          <Collections cars={cars} />
          <p style={{ textAlign: "center", marginTop: 26 }}><Link className="btn" href="/cars"><T>View all cars →</T></Link></p>
        </div>
      </section>

      <section id="tools">
        <div className="wrap">
          <h2>🧮 <T>Our tools</T></h2>
          <p className="sub" />
          <QuickTools />
        </div>
      </section>

      <div style={{ background: "var(--bg2)" }}><Hub /></div>
      <Contact />
    </main>
  );
}
