"use client";
import { useState } from "react";
import { useT } from "@/lib/i18n";
import Calculator from "./Calculator";
import TrackForm from "./TrackForm";

const TABS = [["cost", "Cost estimate"], ["track", "Track your car"]];

export default function QuickTools() {
  const t = useT();
  const [tab, setTab] = useState("cost");
  return (
    <>
      <div className="bar">
        {TABS.map(([k, l]) => <button key={k} className={"chip" + (tab === k ? " on" : "")} onClick={() => setTab(k)}>{t(l)}</button>)}
      </div>
      {tab === "cost" && <Calculator />}
      {tab === "track" && <TrackForm />}
    </>
  );
}
