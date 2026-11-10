# AUTOUSAKHATIA SEO setup

Canonical website: https://www.autousakhatia.com

## After uploading to GitHub / deploying on Vercel

1. In Vercel project Settings > Environment Variables, set `NEXT_PUBLIC_SITE_URL=https://www.autousakhatia.com` (or leave unset; the code now defaults to that domain). If you already have a different value, update it.
2. Keep all existing Supabase and AI environment variables unchanged.
3. Open `https://www.autousakhatia.com/robots.txt` and `https://www.autousakhatia.com/sitemap.xml` to verify they load and contain the www domain.
4. In Google Search Console, add the Domain property `autousakhatia.com`. Verify with the DNS TXT record in Namecheap; do not remove your existing A or CNAME records.
5. Submit `https://www.autousakhatia.com/sitemap.xml` under Search Console > Sitemaps. Request indexing of the homepage under URL Inspection.
6. Optional: set `GOOGLE_SITE_VERIFICATION` to the **content value** of a Google HTML verification meta tag if using URL-prefix verification instead of DNS. Domain-property DNS verification does not require this variable.

## Included changes

- Georgian-first title and description, English/Russian search terms; Open Graph and Twitter metadata
- Canonical URLs and metadata on each public page
- Organization and WebSite JSON-LD; no unverified physical business address
- robots.txt excludes admin and API routes; admin layout noindex
- sitemap.xml lists all public static routes, excluding admin/API
- Favicon/apple icon metadata; absolute site URL fallback

## Notes

- A sitemap and metadata help discovery but do not guarantee Google indexing or first-page rankings.
- Language switches happen on the same URL. Do not add hreflang language URLs until separate crawlable translated URLs exist.
- The current logo is used for social sharing. For better previews later, create a dedicated 1200x630 OG image.
- No new claims about company registration, ratings, or physical address were added.
- Dynamic Supabase cars are currently rendered on the `/cars` page rather than separate crawlable vehicle detail URLs; individual car SEO pages would be a separate feature.
- Search Console verification and sitemap submission require action in your own Google account.
