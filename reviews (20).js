import { createClient } from "@supabase/supabase-js";

// Only reviews the owner has approved are public.
export async function getReviews() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const sb = createClient(url, key);
    const { data, error } = await sb.from("reviews").select("*").eq("approved", true).order("created_at", { ascending: false }).limit(30);
    if (error) throw error;
    return data;
  } catch (e) { return []; }
}
