import { createClient } from "@supabase/supabase-js";
import fallback from "@/data/cars.json";

const norm = (r) => {
  const images = r.images && r.images.length ? r.images : r.img ? [r.img] : [];
  return { ...r, desc: r.description ?? r.desc ?? "", images, img: images[0] || "" };
};

// Reads cars from Supabase. Falls back to data/cars.json if Supabase is not set up yet.
export async function getCars() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return fallback.map(norm);
  try {
    const sb = createClient(url, key);
    const { data, error } = await sb.from("cars").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data.map(norm);
  } catch (e) {
    console.error("Supabase error:", e);
    return fallback.map(norm);
  }
}
