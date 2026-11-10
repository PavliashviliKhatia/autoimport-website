import "./globals.css";
import { LangProvider } from "@/lib/i18n";
import Nav from "@/components/Nav";
import { SITE } from "@/lib/site";
import Footer from "@/components/Footer";
import FloatingAI from "@/components/FloatingAI";
import { getCars } from "@/lib/cars";

export const metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: "AUTOUSAKHATIA",
  title: {
    default: "მანქანების ჩამოყვანა ამერიკიდან | AUTOUSAKHATIA",
    template: "%s | AUTOUSAKHATIA",
  },
  description: "მანქანების ჩამოყვანა ამერიკიდან საქართველოში — Copart და IAAI აუქციონები, ავტომობილების შერჩევა, შეძენა, ტრანსპორტირება, განბაჟება და კონტეინერის თრექინგი. Cars from USA to Georgia.",
  keywords: [
    "მანქანის ჩამოყვანა ამერიკიდან", "მანქანები ამერიკიდან", "ავტომობილების იმპორტი",
    "მანქანის ჩამოყვანა აშშ-დან", "ამერიკის აუქციონები", "Copart Georgia", "IAAI Georgia",
    "ავტომობილის ტრანსპორტირება", "კონტეინერის თრექინგი", "cars from USA to Georgia",
    "USA car import Georgia", "авто из США в Грузию", "автомобили из Америки",
    "AUTOUSAKHATIA", "ავტოუსახათია",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", locale: "ka_GE", alternateLocale: ["en_US", "ru_RU"],
    url: SITE.url, siteName: "AUTOUSAKHATIA",
    title: "AUTOUSAKHATIA — მანქანების ჩამოყვანა ამერიკიდან",
    description: "ავტომობილების შერჩევა, შეძენა და ჩამოყვანა აშშ-დან საქართველოში. Copart, IAAI, ტრანსპორტირება და თრექინგი.",
    images: [{ url: "/logo.png", alt: "AUTOUSAKHATIA logo" }],
  },
  twitter: { card: "summary", title: "AUTOUSAKHATIA — Cars from USA to Georgia", description: "Car sourcing, US auctions, shipping and tracking to Georgia.", images: ["/logo.png"] },
  icons: { icon: "/icon.svg", apple: "/apple-icon.png" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  ...(process.env.GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } } : {}),
};

export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export const revalidate = 30;

export default async function RootLayout({ children }) {
  const cars = (await getCars()).filter((c) => c.status !== "sold").map(({ id, make, model, year, price, img }) => ({ id, make, model, year, price, img }));
  const ld = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/logo.png`,
    telephone: SITE.phone,
    email: SITE.email,
    areaServed: { "@type": "Country", name: "Georgia" },
    knowsLanguage: ["ka", "en", "ru"],
  };
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    publisher: { "@id": `${SITE.url}/#organization` },
    inLanguage: ["ka", "en", "ru"],
  };
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([ld, websiteLd]).replace(/</g, "\\u003c") }} />
        <LangProvider>
          <Nav />
          {children}
          <Footer />
          <FloatingAI cars={cars} />
        </LangProvider>
      </body>
    </html>
  );
}
