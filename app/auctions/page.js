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
          <h2>🇺🇸 <T>US auctions</T></h2>
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
