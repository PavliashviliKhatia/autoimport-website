import { SITE } from "@/lib/site";

export const carPath = (car) => `/cars/${encodeURIComponent(String(car.id))}`;
export const carUrl = (car) => new URL(carPath(car), SITE.url).toString();
export const isSampleCar = (car) => /^Sample car\b/i.test(String(car?.desc || ""));
export const isPublicCar = (car) => car && car.id != null && car.make && car.model && car.year && !isSampleCar(car);
export const carName = (car) => `${car.year} ${car.make} ${car.model}`.replace(/\s+/g, " ").trim();
export const carDescription = (car) => {
  const name = carName(car);
  const status = car.status === "sold" ? "Previously sold vehicle." : car.status === "transit" ? "In transit to Georgia." : "Explore this vehicle from the USA.";
  const extra = String(car.desc || "").replace(/\s+/g, " ").trim();
  return `${name} — ${status} ${extra ? extra + " " : ""}Photos, specifications and import information from AUTOUSAKHATIA.`.slice(0, 300);
};
export const carImage = (car) => {
  const candidate = (car.images || []).find(Boolean) || car.img;
  if (!candidate) return null;
  try { const url = new URL(candidate, SITE.url); return ["http:", "https:"].includes(url.protocol) ? url.toString() : null; } catch { return null; }
};
export function carStructuredData(car) {
  const name = carName(car), url = carUrl(car), image = carImage(car);
  const item = {
    "@context": "https://schema.org", "@type": "Car", "@id": `${url}#vehicle`,
    name, description: carDescription(car), url,
    brand: { "@type": "Brand", name: String(car.make) },
    model: String(car.model), vehicleModelDate: String(car.year),
    ...(image ? { image: [image] } : {}),
    ...(car.vin ? { vehicleIdentificationNumber: String(car.vin) } : {}),
    ...(Number(car.miles) > 0 ? { mileageFromOdometer: { "@type": "QuantitativeValue", value: Number(car.miles), unitCode: "SMI" } } : {}),
    ...(car.fuel ? { fuelType: String(car.fuel) } : {}),
    ...(car.trans ? { vehicleTransmission: String(car.trans) } : {}),
  };
  if (car.status !== "sold" && Number(car.price) > 0) {
    item.offers = {
      "@type": "Offer", url, priceCurrency: "USD", price: Number(car.price),
      availability: car.status === "available" ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      seller: { "@type": "Organization", name: SITE.name, url: SITE.url },
    };
  }
  return item;
}
