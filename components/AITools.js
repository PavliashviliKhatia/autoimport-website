"use client";
import { useT } from "@/lib/i18n";
import AIAssistant from "./AIAssistant";
import BuyForMe from "./BuyForMe";
import Inspector from "./Inspector";
import PriceCheck from "./PriceCheck";
import RepairEstimator from "./RepairEstimator";

export const TABS = [["assistant", "Assistant"], ["buy", "Buy for me"], ["damage", "Damage check"], ["price", "Price check"], ["repair", "Repair"]];
const DESC = {
  assistant: "Describe the car you need in your own words. The assistant picks the best matches from our cars.",
  buy: "Tell us the car and your total budget in Georgia. We check if it is realistic and our team searches auctions for you. Nothing is bought without your written consent.",
  damage: "Upload car or auction photos (up to 4). The AI describes visible damage. It is a preliminary opinion, not a professional inspection.",
  price: "Enter a car and its price. The AI compares it with similar offers found online. It is an estimate, not a guarantee.",
  repair: "Pick damaged parts or upload photos. The AI estimates a repair price range and your total budget (car + repair). It is an indication, not an offer.",
};

export default function AITools({ cars, tab, setTab }) {
  const t = useT();
  return (
    <>
      <div className="bar">
        {TABS.map(([k, l]) => <button key={k} className={"chip" + (tab === k ? " on" : "")} onClick={() => setTab(k)}>{t(l)}</button>)}
      </div>
      <p className="sub">{t(DESC[tab])}</p>
      {tab === "assistant" && <AIAssistant cars={cars} />}
      {tab === "buy" && <BuyForMe />}
      {tab === "damage" && <Inspector />}
      {tab === "price" && <PriceCheck />}
      {tab === "repair" && <RepairEstimator cars={cars} />}
    </>
  );
}
