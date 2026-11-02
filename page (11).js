import Link from "next/link";
import { T } from "@/lib/i18n";
import { STAGES } from "@/lib/site";
import RequestForm from "@/components/RequestForm";
import TrackForm from "@/components/TrackForm";

const HOW = [["Choose", "Pick a car from our list or tell us what you want."], ["Buy", "We bid and purchase at USA auctions for you."], ["Ship", "Safe sea shipping with tracking at every stage."], ["Receive", "Customs clearance and delivery to your door."]];
const FAQ = [["How long does delivery take?", "Usually 45–60 days from auction win to the keys in your hands."], ["What is included in the price?", "Car, auction fees and customs — all shown in the estimate."], ["Can I see the car before buying?", "Yes. We send full photos and videos, and inspection reports on request."]];

export const metadata = { title: "Car import & order tracking", description: "Order car delivery from the USA to Georgia and track every stage with your tracking code." };

export default function ImportPage() {
  return (
    <main>
      <section style={{ paddingTop: 50 }}>
        <div className="wrap" style={{ maxWidth: 820 }}>
          <h2>🚢 <T>Car import</T></h2>
          <p className="sub"><T>Order delivery and track your car step by step.</T></p>
          <div className="co">{STAGES.map((s, i) => <div className="tl" key={s}><span>{i + 1}. <T>{s}</T></span></div>)}</div>
          <h3 style={{ marginTop: 30 }}><T>How it works</T></h3>
          <div className="steps">{HOW.map((s, i) => <div className="step" key={s[0]}><i>{i + 1}</i><h3><T>{s[0]}</T></h3><p><T>{s[1]}</T></p></div>)}</div>
          <h3 style={{ marginTop: 40 }}>📍 <T>Track your car</T></h3>
          <TrackForm />
          <h3 style={{ marginTop: 40 }}><T>Order import</T></h3>
          <RequestForm type="order" extraLabel="Auction lot link / car" detailsLabel="Details (budget, wishes, questions)" button="Send order request" />
          <p style={{ marginTop: 30 }}><Link className="chip" href="/faq">❓ <T>Frequently asked questions</T></Link></p>
        </div>
      </section>
    </main>
  );
}
