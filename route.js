// Decodes a VIN with the free public NHTSA service (make, model, year, engine...).
// It does NOT give accident history - that needs paid services (Carfax, AutoCheck...).
export async function GET(req) {
  const vin = (new URL(req.url).searchParams.get("vin") || "").trim().toUpperCase();
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) return Response.json({ error: "VIN must be 17 characters." }, { status: 400 });
  try {
    const r = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`, { next: { revalidate: 86400 } });
    const j = await r.json();
    const d = (j.Results && j.Results[0]) || {};
    if (!d.Make) return Response.json({ error: "No data found for this VIN." }, { status: 404 });
    return Response.json({
      make: d.Make, model: d.Model, year: d.ModelYear, body: d.BodyClass,
      engine: [d.DisplacementL && d.DisplacementL + "L", d.EngineCylinders && d.EngineCylinders + " cyl"].filter(Boolean).join(" "),
      fuel: d.FuelTypePrimary, drive: d.DriveType, country: d.PlantCountry,
    });
  } catch (e) { return Response.json({ error: "VIN service unavailable." }, { status: 502 }); }
}
