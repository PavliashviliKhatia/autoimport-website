import { SITE } from "@/lib/site";
import { getCars } from "@/lib/cars";
import { carUrl, isPublicCar } from "@/lib/car-seo";

const pages = [
  ["/", "weekly", 1], ["/cars", "daily", 0.9], ["/auctions", "weekly", 0.85],
  ["/import", "weekly", 0.9], ["/market", "daily", 0.75], ["/services", "weekly", 0.7],
  ["/dealers", "monthly", 0.6], ["/radar", "weekly", 0.65], ["/about", "monthly", 0.6],
  ["/contact", "monthly", 0.7], ["/faq", "monthly", 0.7],
  ["/privacy", "yearly", 0.2], ["/terms", "yearly", 0.2],
];

export default async function sitemap() {
  const staticPages = pages.map(([path, changeFrequency, priority]) => ({
    url: new URL(path, SITE.url).toString(), changeFrequency, priority,
  }));
  const cars = await getCars();
  const carPages = cars.filter(isPublicCar).map((car) => ({
    url: carUrl(car), changeFrequency: "weekly", priority: car.status === "sold" ? 0.4 : 0.7,
    ...(car.updated_at || car.created_at ? { lastModified: new Date(car.updated_at || car.created_at) } : {}),
  }));
  return [...staticPages, ...carPages];
}
