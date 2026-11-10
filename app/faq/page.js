import { T } from "@/lib/i18n";

export const metadata = { alternates: { canonical: "/faq" }, title: "FAQ", description: "Frequently asked questions about importing cars from the USA to Georgia." };

const FAQ = [
  ["How long does delivery take?", "Usually 45–60 days from auction win to the keys in your hands."],
  ["What is included in the price?", "Car, auction fees and customs — all shown in the estimate."],
  ["Is transport included in the estimate?", "No. The calculator shows the price without US transport and ocean freight. Shipping is quoted separately."],
  ["Can I see the car before buying?", "Yes. We send full photos and videos, and inspection reports on request."],
  ["Do you buy a car without my consent?", "No. Nothing is bought or bid on without your written consent."],
  ["How can I track my car?", "After you order, we give you a tracking code. Enter it on the Import page to see every stage."],
];

export default function FAQPage() {
  return (
    <main>
      <section style={{ paddingTop: 50 }}>
        <div className="wrap" style={{ maxWidth: 780 }}>
          <h2>❓ <T>Frequently asked questions</T></h2>
          <p className="sub" />
          {FAQ.map((q) => <details key={q[0]}><summary><T>{q[0]}</T></summary><p><T>{q[1]}</T></p></details>)}
        </div>
      </section>
    </main>
  );
}
