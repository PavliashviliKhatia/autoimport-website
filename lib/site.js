export const SITE = {
  name: "AUTOUSAKHATIA",
  phone: "+995 598 60 80 95",
  email: "pavliashvili1998@gmail.com",
  address: "13 Asureli Father's street 95",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com",
};
export const wa = (text = "") =>
  `https://wa.me/${SITE.phone.replace(/\D/g, "")}${text ? "?text=" + encodeURIComponent(text) : ""}`;
export const money = (n) => "$" + Number(n || 0).toLocaleString("en-US");

// Estimated transport + customs added to a car's price when matching customers'
// "maximum total cost" alerts. Edit this number to match your real average costs.
export const EXTRA_COSTS = 4000;

// Trust facts shown on the site. Fill in ONLY real, true information.
// Anything left empty ("" or null) is simply not shown.
export const TRUST = {
  companyId: "",   // company tax / registration ID (საიდენტიფიკაციო კოდი)
  founded: null,   // year the company started, e.g. 2021
  deals: null,     // number of cars really delivered so far, e.g. 120
  avgDays: null,   // real average delivery time in days, e.g. 50
};

// Models the weekly "Car Market Radar" analyses (max ~6, each costs one AI web search). Edit freely.
export const RADAR_MODELS = ["Toyota Camry", "Tesla Model 3", "Honda Civic", "Hyundai Elantra", "Toyota RAV4", "BMW X5"];

// Websites customers can use to follow the ship / container (they open the carrier's own page).
// Check the links once in a while - carriers sometimes change their addresses. Add or remove lines freely.
export const TRACKERS = [
  { name: "Maersk", url: "https://www.maersk.com/tracking" },
  { name: "MSC", url: "https://www.msc.com/en/track-a-shipment" },
  { name: "CMA CGM", url: "https://www.cma-cgm.com/ebusiness/tracking" },
  { name: "Hapag-Lloyd", url: "https://www.hapag-lloyd.com/en/online-business/track/track-by-container-solution.html" },
  { name: "Track-Trace (all carriers)", url: "https://www.track-trace.com/container" },
  { name: "VesselFinder (ship position)", url: "https://www.vesselfinder.com" },
  { name: "MarineTraffic (ship position)", url: "https://www.marinetraffic.com" },
];

// Stages shown in order tracking (same wording as the home page timeline).
export const STAGES = ["Auction win", "US transport to port", "Ocean freight to Poti", "Customs clearance", "Delivery and registration"];
