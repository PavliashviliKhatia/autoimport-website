# AUTOUSAKHATIA (Next.js)

## Run on your computer
1. Install Node.js 18+ (nodejs.org)
2. In this folder: `npm install` then `npm run dev` -> open http://localhost:3000

## Put it online (Vercel, free)
1. Upload this folder to a GitHub repository
2. vercel.com -> New Project -> import the repo -> Deploy
3. Project Settings -> Domains -> add your domain, follow the DNS steps
4. Settings -> Environment Variables: NEXT_PUBLIC_SITE_URL = https://your-domain.com (for Google sitemap)

## Admin panel (add / edit / delete cars)
Open https://your-domain.com/admin and log in.
Setup (once):
1. supabase.com -> New project (free)
2. SQL Editor -> paste supabase.sql (replace OWNER_EMAIL with her email) -> Run
3. Authentication -> Users -> Add user (her email + password).
   Authentication -> Sign In / Providers -> turn OFF "Allow new users to sign up".
4. Project Settings -> API -> copy Project URL and anon public key
5. Put them in .env.local (local) and in Vercel -> Settings -> Environment Variables:
   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY -> redeploy
Until Supabase is connected the site shows the sample cars from data/cars.json.
Changes appear on the public site within about 30 seconds.

## Change phone / email / address
`lib/site.js`

## Translations (EN / RU / KA)
`lib/translations.js`

## AI features (Gemini: assistant, photo damage check, car report, price check, repair estimate)
1. Create a Gemini API key in Google AI Studio: https://aistudio.google.com/apikey
2. In Vercel -> Project -> Settings -> Environment Variables, add `GEMINI_API_KEY` with your key (do not use a `NEXT_PUBLIC_` prefix and never commit the key to GitHub).
3. Redeploy the project so the server-side API route receives the new variable.
4. Google AI Studio's free tier availability, quotas, and search-grounding limits depend on model and account; check the current limits before relying on it for production.
5. Run the new "alerts" part of supabase.sql (replace OWNER_EMAIL) so customer requests are saved.
Customer requests appear at the bottom of /admin.

## Price Alerts (automatic) and Repair estimator
- Customers fill the alert form (car, year, max price, max TOTAL cost, auction, damage). Requests appear at the bottom of /admin.
- When she adds a NEW car in /admin, the site checks all requests. Matching customers are shown right there.
  - E-mail contacts get an e-mail automatically if RESEND_API_KEY is set (resend.com; verify your domain to send to customers).
  - WhatsApp/Telegram contacts: one tap on "Message" opens the chat with a ready text. (Fully automatic WhatsApp/Telegram needs a bot/business API - possible later.)
- "Max total cost" matching adds EXTRA_COSTS (transport + customs estimate) from lib/site.js to the car price. Edit that number.
- Run the new SQL block at the bottom of supabase.sql (adds auction / damage columns).

## Trust system (Verified Seller for your company)
- lib/site.js -> TRUST: fill in companyId, founded, deals, avgDays. Only TRUE facts! Empty ones are hidden.
- Customers can leave reviews; they appear ONLY after she approves them in /admin (Reviews section). She can mark a review "verified buyer".
- Each car can show "Real photos / VIN checked / Inspection report" badges and its VIN (tick them in the admin form).
- "Safe deal process" text is in components/Trust.js - edit it so it matches how you REALLY work.
- Real escrow (money held by a third party) is not built in: it needs a bank / licensed payment provider and a lawyer.
- Run the last SQL block of supabase.sql (cars columns + reviews table).

## Auto Intelligence, Buy it for me, Market Radar
- **Auto Intelligence**: one button in every car window -> verdict (buy / consider / avoid), price comparison, visible damage from the car's own photos, extra costs, missing info.
- **Buy it for me**: customer describes the car + max TOTAL cost in Georgia. AI checks if it is realistic (US price + EXTRA_COSTS from lib/site.js). Then the request is saved (alerts) for your team to search auctions. Nothing is bought without written consent.
- **Market Radar** (/radar): once a week Vercel runs /api/radar (vercel.json cron) and saves a snapshot for each model in RADAR_MODELS (lib/site.js). Needs env vars SUPABASE_SERVICE_ROLE_KEY and CRON_SECRET and the "radar" SQL block. The snapshots are written in English.
- Not possible without paid data feeds: live auction listings, real "fastest selling" statistics. Radar is a web-search summary, not exact statistics.

## Home page & listing page (what is where)
Home: search bar (hero) -> AI assistant -> "Our cars" tabs (Latest / Popular / Best total cost / Price drops / Minor damage / From auctions) -> Buy it for me -> photo damage check -> how it works -> AI price check -> repair estimator -> cost calculator -> transport calculator -> trust & reviews -> FAQ -> contact.
- Tabs fill from the admin form: "Popular" checkbox, "Old price" (discount), "Damage level", "Auction".
- Listing window: photos + video link, VIN decode (free NHTSA: make/model/year/engine - NOT accident history), history notes, damage analysis, price comparison, repair estimate, estimated total in Georgia, seller trust line.
- Transport calculator shows "ask for a quote" until you fill TRANSPORT rates in lib/site.js.
- Not included (needs paid services): accident/title history reports (Carfax/AutoCheck), live auction feeds.

## The 6 directions (what each one really does)
- /auctions - customer sends a Copart/IAAI lot link or number (saved in "requests"); you check it and bid only with written consent. There is NO live Copart/IAAI search (no data access).
- /import - delivery process, order form and order tracking by secret code. In /admin/manage -> Orders you create an order (gets a code), change its stage, add notes; send the customer the link.
- /market - Georgian car market: visitors submit listings (with photos); they appear only after you approve them in /admin/manage -> Market. No payments or guarantees.
- AI assistant - on the home page.
- /services - directory of mechanics / service centers / parts shops YOU add (/admin/manage -> Services) + "find me a part" requests (answered by you).
- /dealers - partner page + form. Multi-dealer inventory/CRM software is NOT built; for your own business use /admin (per-car costs and profit).
Run the last SQL block of supabase.sql. Tracking needs SUPABASE_SERVICE_ROLE_KEY (same one as the radar).

## Site structure (multi-page)
Top bar: Home, Cars, Auctions, Import, Market, Services, About, Contact (+ phone and WhatsApp buttons, EN/RU/KA). The phone menu also lists For dealers and Radar.
- / Home: hero + search (text, year from, max price), stats, cars collections, quick tools (cost estimate / track), 6 directions
- /cars all cars | /auctions | /import (how it works, tracking, order)
- /market | /services | /dealers | /radar | /about (trust, reviews) | /contact

## Footer, FAQ, Privacy, Terms
- The footer (every page, incl. Home): contact (call / WhatsApp / e-mail / map), page links, FAQ, Privacy policy, Terms of use, copyright and the "estimates are not an offer" line. Edit in components/Footer.js; contact data comes from lib/site.js.
- /faq has 6 questions (edit app/faq/page.js). /privacy and /terms are DRAFTS written to match how this site works (forms, reviews, AI, Supabase). Have a lawyer review them before you rely on them.

## Floating AI button
A round 🤖 button (bottom right, every page except /admin) opens one panel with all AI tools as tabs: Assistant, Buy for me, Damage check, Price check, Repair. There are no separate AI pages. Any element can open it on a tab with <OpenAI tab="damage">...</OpenAI> (components/OpenAI.js).

## Logo
Speedometer logo: public/logo.svg (header, top right), app/icon.svg (browser tab), app/apple-icon.png (phone home screen), public/logo.png (picture shown when the link is shared). Replace these files to change the logo.

## Tracking with other websites
Track tab = (1) our own code (set in /admin/manage -> Orders; each order can also hold a container / B-L number, carrier and vessel) and (2) "Track on other websites": the customer picks a carrier site, the number is copied and the carrier's tracking page opens. The list is TRACKERS in lib/site.js (links open the carrier's own page; they do not auto-fill the number, so check them now and then). The transport calculator was removed. Run the last SQL block (orders columns).
