import { getReviews } from "@/lib/reviews";
import Trust from "@/components/Trust";

export const revalidate = 60;
export const metadata = { alternates: { canonical: "/about" }, title: "About us — why customers trust us", description: "Verified business information, safe deal process and customer reviews." };

export default async function About() {
  const reviews = await getReviews();
  return <main style={{ paddingTop: 30 }}><Trust reviews={reviews} /></main>;
}
