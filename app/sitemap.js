import { SITE } from "@/lib/site";
export default function sitemap() {
  return ["", "/cars", "/auctions", "/import", "/market", "/services", "/dealers", "/radar", "/about", "/contact", "/faq", "/privacy", "/terms"].map((p) => ({ url: SITE.url + p, lastModified: new Date() }));
}
