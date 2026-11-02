import { createClient } from "@supabase/supabase-js";
import { T } from "@/lib/i18n";
import MarketView from "@/components/MarketView";

export const revalidate = 60;
export const metadata = { title: "Georgian car market", description: "Cars for sale in Georgia. Sell your car — listings appear after review." };

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
          <h2>🇬🇪 <T>Georgian car market</T></h2>
          <p className="sub"><T>Cars for sale in Georgia. Listings appear after our review. We do not guarantee deals between users — always inspect the car and check the documents.</T></p>
          <MarketView listings={listings} />
        </div>
      </section>
    </main>
  );
}
