import Link from "next/link";
import { notFound } from "next/navigation";
import { getCars } from "@/lib/cars";
import { SITE, money } from "@/lib/site";
import { carName, carDescription, carImage, carPath, carStructuredData, isPublicCar } from "@/lib/car-seo";

export const revalidate = 60;

async function findCar(id) {
  const cars = await getCars();
  return cars.find((car) => String(car.id) === String(id));
}

export async function generateMetadata({ params }) {
  const car = await findCar(params.id);
  if (!car) return { title: "Car not found", robots: { index: false, follow: false } };
  const name = carName(car), description = carDescription(car), image = carImage(car);
  return {
    title: `${name} from USA to Georgia`, description,
    alternates: { canonical: carPath(car) },
    robots: { index: isPublicCar(car), follow: true },
    openGraph: { type: "website", title: `${name} | AUTOUSAKHATIA`, description, url: new URL(carPath(car), SITE.url).toString(), ...(image ? { images: [{ url: image, alt: name }] } : {}) },
    twitter: { card: image ? "summary_large_image" : "summary", title: name, description, ...(image ? { images: [image] } : {}) },
  };
}

export default async function CarDetailsPage({ params }) {
  const car = await findCar(params.id);
  if (!car) notFound();
  const name = carName(car);
  const images = [...new Set([...(car.images || []), car.img].filter(Boolean))];
  const ld = isPublicCar(car) ? carStructuredData(car) : null;
  return (
    <main className="wrap" style={{ paddingTop: 48, paddingBottom: 64, minHeight: "65vh" }}>
      {ld && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />}
      <p><Link href="/cars" style={{ color: "var(--mu)" }}>← All cars</Link></p>
      <h1>{name}</h1>
      <p className="sub">{car.status === "sold" ? "Sold" : car.status === "transit" ? "In transit" : "Available"} · Cars from USA to Georgia</p>
      {images.length > 0 && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 12, margin: "24px 0" }}>
        {images.map((src, index) => <img key={src} src={src} alt={`${name} — photo ${index + 1}`} loading={index ? "lazy" : "eager"} style={{ width: "100%", maxHeight: 430, objectFit: "contain", borderRadius: 14, background: "var(--card, #181b24)" }} />)}
      </div>}
      <div className="car" style={{ padding: 24, cursor: "auto", maxWidth: 760 }}>
        {Number(car.price) > 0 && <p className="price">{money(car.price)}</p>}
        <div className="meta" style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {Number(car.miles) > 0 && <span>{Number(car.miles).toLocaleString("en-US")} mi</span>}
          {car.fuel && <span>{car.fuel}</span>}
          {car.trans && <span>{car.trans}</span>}
        </div>
        {car.desc && <p style={{ marginTop: 18, whiteSpace: "pre-wrap" }}>{car.desc}</p>}
        <p style={{ marginTop: 18 }}><a className="btn" href={`https://wa.me/${SITE.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello! I'm interested in ${name}.`)}`} target="_blank" rel="noopener noreferrer">Ask about this car</a></p>
      </div>
    </main>
  );
}
