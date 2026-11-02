import { createClient } from "@supabase/supabase-js";
import { T } from "@/lib/i18n";
import RequestForm from "@/components/RequestForm";

export const revalidate = 60;
export const metadata = { title: "Car parts and services", description: "Mechanics, service centers, body shops and parts in Georgia." };

async function getServices() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const { data, error } = await createClient(url, key).from("services").select("*").eq("approved", true).order("kind").order("name");
    if (error) throw error;
    return data;
  } catch (e) { return []; }
}

export default async function Services() {
  const list = await getServices();
  const kinds = [...new Set(list.map((s) => s.kind))];
  return (
    <main>
      <section style={{ paddingTop: 50 }}>
        <div className="wrap" style={{ maxWidth: 820 }}>
          <h2>🔧 <T>Parts and services</T></h2>
          <p className="sub"><T>Find parts, mechanics and service centers.</T></p>
          <h3><T>Find me a part</T></h3>
          <RequestForm type="parts" detailsLabel="Car, part name and VIN if you have it" button="Send request" />
          {kinds.map((k) => (
            <div key={k}>
              <h3 style={{ marginTop: 30 }}>{k}</h3>
              {list.filter((s) => s.kind === k).map((s) => (
                <div key={s.id} className="tl" style={{ display: "block" }}>
                  <b>{s.name}</b> <small style={{ color: "var(--mu)" }}>{s.city}</small>
                  <div style={{ color: "var(--mu)", fontWeight: 400 }}>{s.address}{s.note ? " · " + s.note : ""}</div>
                  {s.phone && <a className="chip on" style={{ display: "inline-block", marginTop: 6 }} href={"tel:" + s.phone.replace(/\s/g, "")}>📞 {s.phone}</a>}
                </div>
              ))}
            </div>
          ))}
          {list.length === 0 && <div className="empty" style={{ marginTop: 20 }}><T>No listings yet.</T></div>}
        </div>
      </section>
    </main>
  );
}
