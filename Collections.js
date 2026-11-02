"use client";
import { useState } from "react";
import { useT } from "@/lib/i18n";
import CarsView from "./CarsView";

const TABS = [["latest", "Latest"], ["popular", "Popular"], ["best", "Best total cost"], ["drops", "Price drops"], ["minor", "Minor damage"], ["auction", "From auctions"]];

export default function Collections({ cars }) {
  const t = useT();
  const pool = cars.filter((c) => c.status !== "sold");
  const pick = {
    latest: () => pool,
    popular: () => pool.filter((c) => c.featured),
    best: () => pool.filter((c) => c.status === "available").sort((a, b) => a.price - b.price),
    drops: () => pool.filter((c) => c.old_price > c.price).sort((a, b) => b.old_price - b.price - (a.old_price - a.price)),
    minor: () => pool.filter((c) => c.damage_level === "minor"),
    auction: () => pool.filter((c) => c.auction),
  };
  const tabs = TABS.filter(([k]) => k === "latest" || pick[k]().length);
  const [tab, setTab] = useState("latest");
  return (
    <>
      <div className="bar">
        {tabs.map(([k, l]) => <button key={k} className={"chip" + (tab === k ? " on" : "")} onClick={() => setTab(k)}>{t(l)}</button>)}
      </div>
      <CarsView key={tab} cars={(pick[tab] || pick.latest)().slice(0, 6)} compact />
    </>
  );
}
