import { T } from "@/lib/i18n";

export const metadata = { title: "Terms of use" };

const P = [
  "Prices, calculators and AI answers are estimates, not an offer. The final price is confirmed in writing.",
  "We never buy a car or place a bid without your written consent.",
  "Georgian car market listings are published by users. We review them but do not guarantee any deal — inspect the car and check the documents.",
  "Damage descriptions are provided as accurately as possible; AI damage analysis is a preliminary opinion, not a professional inspection.",
];

// NOTE: draft text that matches how this site works - have it reviewed by a lawyer.
export default function Terms() {
  return (
    <main>
      <section style={{ paddingTop: 50 }}>
        <div className="wrap" style={{ maxWidth: 780 }}>
          <h2><T>Terms of use</T></h2>
          <p className="sub" />
          <div className="co">{P.map((p) => <p key={p}><T>{p}</T></p>)}</div>
        </div>
      </section>
    </main>
  );
}
