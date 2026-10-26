import { T } from "@/lib/i18n";
import CarsView from "@/components/CarsView";
import Contact from "@/components/Contact";
import { getCars } from "@/lib/cars";

export const metadata = {
  title: "Cars from USA — available now",
  description: "Cars available and in transit from US auctions to Georgia. ავტომობილები აშშ-დან. Авто из США.",
  alternates: { canonical: "/cars" },
};

export const revalidate = 30;
export default async function CarsPage() {
  const cars = await getCars();
  return (
    <main>
      <section id="cars" style={{ paddingTop: 50, minHeight: "70vh" }}>
        <div className="wrap">
          <h2><T>Our cars</T></h2>
          <p className="sub"><T>Fresh arrivals, cars in transit and recently sold.</T></p>
          <CarsView cars={cars} />
        </div>
      </section>
      <Contact />
    </main>
  );
}
