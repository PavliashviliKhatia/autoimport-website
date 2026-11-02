import "./globals.css";
import { LangProvider } from "@/lib/i18n";
import Nav from "@/components/Nav";
import { SITE } from "@/lib/site";
import Footer from "@/components/Footer";
import FloatingAI from "@/components/FloatingAI";
import { getCars } from "@/lib/cars";

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "AUTOUSAKHATIA — Cars from USA to Georgia", template: "%s | AUTOUSAKHATIA" },
  description:
    "We buy cars at US auctions, ship them to Poti and clear customs in Georgia. ავტომობილების იმპორტი აშშ-დან საქართველოში. Авто из США в Грузию.",
  keywords: ["car import Georgia", "cars from USA", "ავტომობილები აშშ-დან", "авто из США в Грузию", "Copart", "IAAI"],
  openGraph: { title: "AUTOUSAKHATIA", description: "Cars from the USA, delivered to Georgia.", type: "website", images: ["/logo.png"] },
  alternates: { canonical: "/" },
};

export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export const revalidate = 30;

export default async function RootLayout({ children }) {
  const cars = (await getCars()).filter((c) => c.status !== "sold").map(({ id, make, model, year, price, img }) => ({ id, make, model, year, price, img }));
  const ld = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: SITE.name,
    telephone: SITE.phone,
    email: SITE.email,
    address: { "@type": "PostalAddress", streetAddress: SITE.address, addressCountry: "GE" },
    url: SITE.url,
  };
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
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
