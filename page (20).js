import { T } from "@/lib/i18n";
import RequestForm from "@/components/RequestForm";
import Link from "next/link";

export const metadata = { title: "For dealers and importers", description: "Partner terms for car dealers and importers: sourcing from US auctions, shipping and market data." };

export default function Dealers() {
  return (
    <main>
      <section style={{ paddingTop: 50 }}>
        <div className="wrap" style={{ maxWidth: 820 }}>
          <h2>🏢 <T>For dealers</T></h2>
          <p className="sub"><T>Partner terms for dealers and importers.</T></p>
          <div className="co">
            {["Sourcing from US auctions for your stock", "Shipping and customs handled by our team", "Order tracking for every car", "Weekly market radar"].map((x) => (
              <div className="tl" key={x}><span>✓ <T>{x}</T></span></div>
            ))}
            <p><Link className="chip" href="/radar">📡 <T>Car Market Radar</T></Link></p>
          </div>
          <h3 style={{ marginTop: 30 }}><T>Become a partner</T></h3>
          <RequestForm type="dealer" detailsLabel="About your business and how many cars per month" button="Send request" />
        </div>
      </section>
    </main>
  );
}
