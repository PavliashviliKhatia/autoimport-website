import Link from "next/link";
import { T } from "@/lib/i18n";
import { SITE, wa } from "@/lib/site";

const PAGES = [["/", "Home"], ["/cars", "Cars"], ["/auctions", "Auctions"], ["/import", "Import"],
  ["/market", "Market"], ["/services", "Services"], ["/dealers", "For dealers"], ["/radar", "Radar"], ["/about", "About"], ["/contact", "Contact"]];

export default function Footer() {
  const map = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(SITE.address + ", Georgia");
  return (
    <footer className="site">
      <div className="wrap">
        <div className="ft">
          <div>
            <div className="brand">AUTO<b>USA</b>KHATIA</div>
            <p><T>Cars from the USA to Georgia.</T></p>
          </div>
          <div>
            <h4><T>Contact</T></h4>
            <a href={"tel:" + SITE.phone.replace(/\s/g, "")}>📞 {SITE.phone}</a>
            <a href={wa()} target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
            <a href={"mailto:" + SITE.email}>✉️ {SITE.email}</a>
            <a href={map} target="_blank" rel="noopener noreferrer">📍 {SITE.address}</a>
            <span><T>Open Monday to Saturday.</T></span>
          </div>
          <div>
            <h4><T>Pages</T></h4>
            {PAGES.map(([h, l]) => <Link key={h} href={h}><T>{l}</T></Link>)}
          </div>
          <div>
            <h4><T>Help</T></h4>
            <Link href="/faq"><T>FAQ</T></Link>
            <Link href="/privacy"><T>Privacy policy</T></Link>
            <Link href="/terms"><T>Terms of use</T></Link>
          </div>
        </div>
        <div className="fb">
          <span>© {new Date().getFullYear()} AUTOUSAKHATIA. <T>All rights reserved.</T></span>
          <span><T>Estimates, calculators and AI answers are indicative only and are not an offer.</T></span>
        </div>
      </div>
    </footer>
  );
}
