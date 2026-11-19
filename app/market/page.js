import { createClient } from "@supabase/supabase-js";
import { T } from "@/lib/i18n";
import MarketView from "@/components/MarketView";

export const revalidate = 60;
export const metadata = { alternates: { canonical: "/market" }, title: "Georgian car market", description: "Cars for sale in Georgia. Sell your car — listings appear after review." };

async function getListings() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const { data, error } = await createClient(url, key).from("market_listings").select("*").eq("approved", true).order("created_at", { ascending: false }).limit(60);
    if (error) throw error;
    return data;
  } catch (e) { return []; }
}

export default async function Market() {
  const listings = await getListings();
  return (
    <main>
      <section style={{ paddingTop: 50 }}>
        <div className="wrap">
          <h2><svg aria-hidden="true" viewBox="0 0 90 60" style={{ width: "1.15em", height: "0.77em", verticalAlign: "-0.02em", border: "1px solid #dfe3ea", borderRadius: 2 }}><rect width="90" height="60" fill="#fff"/><path d="M39 0h12v60H39zM0 24h90v12H0z" fill="#d40000"/>{[[20,12],[70,12],[20,48],[70,48]].map(([x,y]) => <path key={`${x}-${y}`} transform={`translate(${x} ${y})`} d="M-3 -8Q0 -6 3 -8L2 -2 8 -3Q6 0 8 3L2 2 3 8Q0 6 -3 8L-2 2 -8 3Q-6 0 -8 -3L-2 -2Z" fill="#d40000"/>)}</svg>{" "}<T>Georgian car market</T></h2>
          <p className="sub"><T>Cars for sale in Georgia. Listings appear after our review. We do not guarantee deals between users — always inspect the car and check the documents.</T></p>
          <MarketView listings={listings} />
        </div>
      </section>
    </main>
  );
}
