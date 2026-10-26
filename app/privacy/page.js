import { T } from "@/lib/i18n";
import { SITE } from "@/lib/site";

export const metadata = { title: "Privacy policy" };

const P = [
  "We collect only what you send us: name, phone, e-mail or messenger contact, car requests, reviews, and photos you upload.",
  "We use it to answer your requests, process orders and show approved reviews and listings.",
  "Contact details in requests and alerts are visible only to us. Contact details you put in a market listing are shown publicly after approval.",
  "AI features send the text and photos you enter to an AI provider (Anthropic) to produce an answer.",
  "Data is stored with our database provider (Supabase). We do not sell your data.",
];

// NOTE: draft text that describes how this site works - have it reviewed by a lawyer.
export default function Privacy() {
  return (
    <main>
      <section style={{ paddingTop: 50 }}>
        <div className="wrap" style={{ maxWidth: 780 }}>
          <h2><T>Privacy policy</T></h2>
          <p className="sub" />
          <div className="co">{P.map((p) => <p key={p}><T>{p}</T></p>)}
            <p><T>To see or delete your data, write to</T> <a href={"mailto:" + SITE.email} style={{ textDecoration: "underline" }}>{SITE.email}</a></p>
          </div>
        </div>
      </section>
    </main>
  );
}
