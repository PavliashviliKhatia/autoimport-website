import Link from "next/link";
import { T } from "@/lib/i18n";
import { getCars } from "@/lib/cars";
import CarsView from "@/components/CarsView";
import RequestForm from "@/components/RequestForm";
import OpenAI from "@/components/OpenAI";

export const revalidate = 30;
export const metadata = { alternates: { canonical: "/auctions" }, title: "US auctions — Copart, IAAI", description: "Send us a Copart or IAAI lot. We check the lot, damage and full cost, and bid only with your written consent." };

export default async function Auctions() {
  const cars = (await getCars()).filter((c) => c.auction && c.status !== "sold");
  return (
    <main>
      <section style={{ paddingTop: 50 }}>
        <div className="wrap" style={{ maxWidth: 820 }}>
          <h2><svg aria-hidden="true" viewBox="0 0 190 100" style={{ width: "1.15em", height: "0.7em", verticalAlign: "0.02em", border: "1px solid #dfe3ea", borderRadius: 2 }}><rect width="190" height="100" fill="#fff"/>{Array.from({length:7},(_,i) => <rect key={i} y={i*200/13} width="190" height={100/13} fill="#b22234"/>)}<rect width="76" height={700/13} fill="#3c3b6e"/>{Array.from({length:9},(_,r) => Array.from({length:r%2?5:6},(_,c) => <path key={`${r}-${c}`} transform={`translate(${(r%2?12.67:6.33)+c*12.67} ${5.38+r*5.38})`} d="M0 -2.2 .52 -.71 2.09 -.68 .84 .27 1.29 1.78 0 .88 -1.29 1.78 -.84 .27 -2.09 -.68 -.52 -.71Z" fill="#fff"/>))}</svg>{" "}<T>US auctions</T></h2>
          <p className="sub"><T>Paste the Copart / IAAI lot link or lot number, and tell us your maximum total budget. We check the lot, the damage and the full cost — and bid only with your written consent.</T></p>
          <RequestForm type="lot" extraLabel="Lot link or number" detailsLabel="Details (car, budget, questions)" button="Send lot request" />
          <p style={{ marginTop: 20 }}>
            <OpenAI tab="damage" className="chip">🔍 <T>AI photo damage check</T></OpenAI>{" "}
            <OpenAI tab="price" className="chip">💰 <T>AI price check</T></OpenAI>{" "}
            <Link className="chip" href="/#tools">🧮 <T>Cost estimate</T></Link>
          </p>
          <h3 style={{ marginTop: 40 }}><T>Auction cars in stock</T></h3>
          <CarsView cars={cars} compact />
        </div>
      </section>
    </main>
  );
}
