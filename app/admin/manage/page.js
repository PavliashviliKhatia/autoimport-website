"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { STAGES, TRACKERS, money } from "@/lib/site";

const TABS = ["Requests", "Orders", "Market", "Services"];
const TABLE = { Requests: "requests", Orders: "orders", Market: "market_listings", Services: "services" };
const KINDS = ["Service center", "Mechanic", "Body shop", "Parts shop", "Tire shop"];
const code8 = () => { const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; return [...crypto.getRandomValues(new Uint8Array(8))].map((x) => a[x % a.length]).join(""); };
const digits = (s) => String(s || "").replace(/\D/g, "");

export default function Manage() {
  const [session, setSession] = useState(undefined);
  const [tab, setTab] = useState("Requests");
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState("");
  const [nf, setNf] = useState({ customer: "", car: "", container: "", carrier: "", vessel: "" });
  const [sv, setSv] = useState({ name: "", kind: KINDS[0], city: "", phone: "", address: "", note: "" });

  useEffect(() => {
    if (!supabase) { setSession(null); return; }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  const load = async () => {
    const { data, error } = await supabase.from(TABLE[tab]).select("*").order("created_at", { ascending: false });
    if (error) setMsg(error.message); else { setRows(data); setMsg(""); }
  };
  useEffect(() => { if (session) load(); }, [session, tab]);
  const upd = async (id, patch) => { const { error } = await supabase.from(TABLE[tab]).update(patch).eq("id", id); if (error) setMsg(error.message); else load(); };
  const del = async (id) => { if (confirm("Delete?")) { await supabase.from(TABLE[tab]).delete().eq("id", id); load(); } };

  if (!supabase) return <div className="wrap" style={{ padding: 60 }}>Supabase is not connected.</div>;
  if (session === undefined) return <div className="wrap" style={{ padding: 60 }}>Loading…</div>;
  if (!session) return <div className="wrap" style={{ padding: 60 }}>Please <a href="/admin" style={{ textDecoration: "underline" }}>log in</a> first.</div>;

  const addOrder = async () => {
    if (!nf.car.trim()) return setMsg("Enter the car.");
    const { error } = await supabase.from("orders").insert({ code: code8(), customer: nf.customer.trim(), car: nf.car.trim(), container: nf.container.trim(), carrier: nf.carrier, vessel: nf.vessel.trim(), stage_dates: { 0: new Date().toLocaleDateString() } });
    if (error) setMsg(error.message); else { setNf({ customer: "", car: "", container: "", carrier: "", vessel: "" }); load(); }
  };
  const setStage = (o, s) => upd(o.id, { stage: s, stage_dates: { ...(o.stage_dates || {}), [s]: new Date().toLocaleDateString() }, updated_at: new Date().toISOString() });
  const addService = async () => {
    if (!sv.name.trim()) return setMsg("Enter a name.");
    const { error } = await supabase.from("services").insert(sv);
    if (error) setMsg(error.message); else { setSv({ name: "", kind: KINDS[0], city: "", phone: "", address: "", note: "" }); load(); }
  };
  const sel = { background: "var(--card)", color: "var(--tx)", border: "1px solid var(--bd)", borderRadius: 8, padding: 6 };

  return (
    <div className="wrap" style={{ padding: "30px 20px 80px", maxWidth: 820 }}>
      <a href="/admin" className="chip">← Cars</a>
      <h2>Manage</h2>
      <div className="bar">{TABS.map((x) => <button key={x} className={"chip" + (tab === x ? " on" : "")} onClick={() => setTab(x)}>{x}</button>)}</div>
      {msg && <p style={{ color: "var(--ac2)" }}>{msg}</p>}

      {tab === "Orders" && (
        <div className="co" style={{ marginBottom: 16 }}>
          <div className="two">
            <div><label>Customer (private)</label><input value={nf.customer} onChange={(e) => setNf({ ...nf, customer: e.target.value })} /></div>
            <div><label>Car</label><input value={nf.car} onChange={(e) => setNf({ ...nf, car: e.target.value })} placeholder="2022 Tesla Model 3" /></div>
          </div>
          <div className="two">
            <div><label>Container / B/L number (optional)</label><input value={nf.container} onChange={(e) => setNf({ ...nf, container: e.target.value })} /></div>
            <div><label>Carrier website</label><select style={{ ...sel, width: "100%" }} value={nf.carrier} onChange={(e) => setNf({ ...nf, carrier: e.target.value })}><option value="">—</option>{TRACKERS.map((x) => <option key={x.name}>{x.name}</option>)}</select></div>
          </div>
          <label>Vessel name (optional)</label><input value={nf.vessel} onChange={(e) => setNf({ ...nf, vessel: e.target.value })} />
          <button className="btn" style={{ marginTop: 12 }} onClick={addOrder}>＋ New order (creates tracking code)</button>
        </div>
      )}
      {tab === "Services" && (
        <div className="co" style={{ marginBottom: 16 }}>
          <div className="two">
            <div><label>Name</label><input value={sv.name} onChange={(e) => setSv({ ...sv, name: e.target.value })} /></div>
            <div><label>Type</label><select style={{ ...sel, width: "100%" }} value={sv.kind} onChange={(e) => setSv({ ...sv, kind: e.target.value })}>{KINDS.map((k) => <option key={k}>{k}</option>)}</select></div>
            <div><label>City</label><input value={sv.city} onChange={(e) => setSv({ ...sv, city: e.target.value })} /></div>
            <div><label>Phone</label><input value={sv.phone} onChange={(e) => setSv({ ...sv, phone: e.target.value })} /></div>
          </div>
          <label>Address</label><input value={sv.address} onChange={(e) => setSv({ ...sv, address: e.target.value })} />
          <label>Note</label><input value={sv.note} onChange={(e) => setSv({ ...sv, note: e.target.value })} />
          <button className="btn" style={{ marginTop: 12 }} onClick={addService}>＋ Add</button>
        </div>
      )}
      {rows.length === 0 && <div className="empty">Nothing here yet.</div>}
      <div style={{ display: "grid", gap: 10 }}>
        {rows.map((r) => (
          <div key={r.id} className="tl" style={{ display: "block" }}>
            {tab === "Requests" && (<>
              <b>[{r.type}] {r.contact}</b> <small style={{ color: r.handled ? "var(--ok)" : "var(--ac2)" }}>{r.handled ? "handled" : "new"}</small>
              <div style={{ color: "var(--mu)", fontWeight: 400 }}>{r.extra ? r.extra + " — " : ""}{r.details}</div>
              <div className="mini">
                {digits(r.contact).length > 6 && <a className="chip on" target="_blank" rel="noopener noreferrer" href={"https://wa.me/" + digits(r.contact)}>WhatsApp</a>}
                <button className="chip" onClick={() => upd(r.id, { handled: !r.handled })}>{r.handled ? "Mark new" : "Mark handled"}</button>
                <button className="chip" onClick={() => del(r.id)}>Delete</button>
              </div>
            </>)}
            {tab === "Orders" && (<>
              <b>{r.code}</b> — {r.car} <small style={{ color: "var(--mu)" }}>{r.customer}</small>
              <div className="mini" style={{ flexWrap: "wrap" }}>
                <select style={sel} defaultValue={r.carrier || ""} onChange={(e) => upd(r.id, { carrier: e.target.value })}><option value="">—</option>{TRACKERS.map((x) => <option key={x.name}>{x.name}</option>)}</select>
                <input style={{ ...sel, minWidth: 150 }} defaultValue={r.container || ""} placeholder="Container / B/L number" onBlur={(e) => e.target.value !== (r.container || "") && upd(r.id, { container: e.target.value })} />
                <input style={{ ...sel, minWidth: 120 }} defaultValue={r.vessel || ""} placeholder="Vessel" onBlur={(e) => e.target.value !== (r.vessel || "") && upd(r.id, { vessel: e.target.value })} />
              </div>
              <div className="mini" style={{ flexWrap: "wrap" }}>
                <select style={sel} value={r.stage} onChange={(e) => setStage(r, +e.target.value)}>
                  {STAGES.map((s, i) => <option key={s} value={i}>{i + 1}. {s}</option>)}<option value={STAGES.length}>Delivered ✓</option>
                </select>
                <input style={{ ...sel, flex: 1, minWidth: 160 }} defaultValue={r.notes} placeholder="Note for the customer" onBlur={(e) => e.target.value !== r.notes && upd(r.id, { notes: e.target.value, updated_at: new Date().toISOString() })} />
                <button className="chip" onClick={() => navigator.clipboard && navigator.clipboard.writeText(location.origin + "/import?code=" + r.code)}>Copy link</button>
                <button className="chip" onClick={() => del(r.id)}>Delete</button>
              </div>
            </>)}
            {tab === "Market" && (<>
              <b>{r.year} {r.make} {r.model}</b> {r.price ? money(r.price) : ""} <small style={{ color: r.approved ? "var(--ok)" : "var(--ac2)" }}>{r.approved ? "published" : "pending"}</small>
              <div style={{ color: "var(--mu)", fontWeight: 400 }}>{r.city} · {r.contact}<br />{r.description}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>{(r.images || []).map((u) => <img key={u} src={u} alt="" style={{ height: 50, borderRadius: 6 }} />)}</div>
              <div className="mini">
                <button className={"chip" + (r.approved ? "" : " on")} onClick={() => upd(r.id, { approved: !r.approved })}>{r.approved ? "Unpublish" : "Approve"}</button>
                <button className="chip" onClick={() => del(r.id)}>Delete</button>
              </div>
            </>)}
            {tab === "Services" && (<>
              <b>{r.name}</b> <small style={{ color: "var(--mu)" }}>{r.kind} · {r.city} · {r.phone}</small>
              <div className="mini"><button className="chip" onClick={() => del(r.id)}>Delete</button></div>
            </>)}
          </div>
        ))}
      </div>
    </div>
  );
}
