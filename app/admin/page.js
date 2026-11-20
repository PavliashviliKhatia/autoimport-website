"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { money } from "@/lib/site";

const EMPTY = { make: "", model: "", year: new Date().getFullYear(), price: "", miles: "", fuel: "Gasoline", trans: "Automatic", status: "available", description: "", images: [], auction: "", damage: "", vin: "", real_photos: false, vin_checked: false, inspection: false, old_price: "", damage_level: "", featured: false, video_url: "", history: "", cost_buy: "", cost_ship: "", cost_customs: "", cost_repair: "" };
const ST = { available: "Available", transit: "In transit", sold: "Sold" };

function compress(file) {
  return new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => {
      const k = Math.min(1, 1400 / im.width), cv = document.createElement("canvas");
      cv.width = im.width * k; cv.height = im.height * k;
      cv.getContext("2d").drawImage(im, 0, 0, cv.width, cv.height);
      cv.toBlob((b) => (b ? res(b) : rej(new Error("Could not read photo"))), "image/jpeg", 0.8);
    };
    im.onerror = () => rej(new Error("Could not read photo"));
    im.src = URL.createObjectURL(file);
  });
}

export default function Admin() {
  const [session, setSession] = useState(undefined);
  const [cars, setCars] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [sorting, setSorting] = useState(false);
  const drag = useRef(null);
  const move = (id, target) => {
    if (id === target || sorting) return;
    setCars(old => { const a = [...old]; const i = a.findIndex(c => c.id === id), j = a.findIndex(c => c.id === target); if(i < 0 || j < 0) return old; a.splice(j, 0, a.splice(i, 1)[0]); return a; });
    setDirty(true);
  };
  const saveOrder = async () => {
    setSorting(true); setMsg("");
    try {
      const { error } = await supabase.rpc("save_car_order", { ordered_ids: cars.map(c => c.id) });
      if (error) throw error;
      setDirty(false); setMsg("Order saved. Public pages update shortly.");
    } catch(e) { setMsg("Could not save order: " + e.message); }
    finally { setSorting(false); }
  };
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [matches, setMatches] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  useEffect(() => {
    if (!supabase) { setSession(null); return; }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const load = async () => {
    const { data, error } = await supabase.from("cars").select("*").order("display_order", { ascending: true, nullsFirst: true }).order("created_at", { ascending: false }).order("id");
    if (error) setMsg(error.message); else { setCars(data); setDirty(false); }
    const a = await supabase.from("alerts").select("*").order("created_at", { ascending: false });
    if (!a.error) setAlerts(a.data);
    const rv = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    if (!rv.error) setReviews(rv.data);
  };
  useEffect(() => { if (session) load(); }, [session]);

  if (!supabase)
    return <div className="wrap" style={{ padding: "60px 20px" }}><h2>Supabase is not connected</h2><p className="sub">Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to the environment variables, then redeploy.</p></div>;
  if (session === undefined) return <div className="wrap" style={{ padding: 60 }}>Loading…</div>;

  if (!session)
    return (
      <div className="wrap" style={{ padding: "60px 20px", maxWidth: 420 }}>
        <h2>Admin login</h2>
        <form onSubmit={async (e) => {
          e.preventDefault(); setMsg("");
          const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
          if (error) setMsg("Wrong email or password.");
        }}>
          <label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          <label>Password</label><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" />
          <button className="btn" style={{ marginTop: 16, width: "100%", justifyContent: "center" }}>Log in</button>
          {msg && <p style={{ color: "var(--ac)" }}>{msg}</p>}
        </form>
      </div>
    );

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const addPhotos = async (files) => {
    setBusy(true); setMsg("Uploading photos…");
    try {
      const urls = [];
      for (const f of files) {
        const blob = await compress(f);
        const path = `${crypto.randomUUID()}.jpg`;
        const { error } = await supabase.storage.from("cars").upload(path, blob, { contentType: "image/jpeg" });
        if (error) throw error;
        urls.push(supabase.storage.from("cars").getPublicUrl(path).data.publicUrl);
      }
      setForm((f) => ({ ...f, images: [...f.images, ...urls] })); setMsg("");
    } catch (e) { setMsg("Photo upload failed: " + e.message); }
    setBusy(false);
  };

  const save = async () => {
    if (!form.make || !form.model) return setMsg("Enter make and model.");
    setBusy(true); setMsg("Saving…");
    const row = { make: form.make.trim(), model: form.model.trim(), year: +form.year || null, price: +form.price || 0, miles: +form.miles || 0, fuel: form.fuel, trans: form.trans, status: form.status, description: form.description, images: form.images, auction: form.auction || "", damage: form.damage || "", vin: form.vin || "", real_photos: !!form.real_photos, vin_checked: !!form.vin_checked, inspection: !!form.inspection, old_price: +form.old_price || null, damage_level: form.damage_level || "", featured: !!form.featured, video_url: form.video_url || "", history: form.history || "", cost_buy: +form.cost_buy || null, cost_ship: +form.cost_ship || null, cost_customs: +form.cost_customs || null, cost_repair: +form.cost_repair || null };
    let error, newId;
    if (form.id) ({ error } = await supabase.from("cars").update(row).eq("id", form.id));
    else { const r = await supabase.from("cars").insert(row).select("id").single(); error = r.error; newId = r.data && r.data.id; }
    setBusy(false);
    if (error) return setMsg("Could not save: " + error.message);
    setMsg("Saved. The public site updates within a minute."); setForm(null); load();
    if (newId) {
      try {
        const r = await fetch("/api/notify", { method: "POST", headers: { "content-type": "application/json", Authorization: "Bearer " + session.access_token }, body: JSON.stringify({ id: newId }) });
        const j = await r.json();
        if (j.matches && j.matches.length) setMatches(j);
      } catch (e) {}
    }
  };
  const setStatus = async (c, status) => { const { error } = await supabase.from("cars").update({ status }).eq("id", c.id); if (error) setMsg(error.message); else load(); };
  const upd = async (r, patch) => { const { error } = await supabase.from("reviews").update(patch).eq("id", r.id); if (error) setMsg(error.message); else load(); };
  const delR = async (r) => { if (confirm("Delete this review?")) { await supabase.from("reviews").delete().eq("id", r.id); load(); } };
  const del = async (c) => { if (!confirm(`Delete ${c.year} ${c.make} ${c.model}?`)) return; const { error } = await supabase.from("cars").delete().eq("id", c.id); if (error) setMsg(error.message); else load(); };

  return (
    <div className="wrap" style={{ padding: "30px 20px 80px", maxWidth: "none", width: "95%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0 }}>Cars</h2>
        <span style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button disabled={dirty || sorting} className="btn" onClick={() => { setForm({ ...EMPTY }); setMsg(""); }}>＋ Add car</button>
          <a className="btn g" href="/admin/manage">Requests · Orders · Market · Services</a>
          <button className="btn g" onClick={() => supabase.auth.signOut()}>Log out</button>
        </span>
      </div>
      {/* Temporary admin notice -- remove this block when no longer needed. */}
      <div lang="ka" style={{ marginTop: 20, padding: "18px 20px", background: "#FFF4E1", border: "1px solid #E8D5B3", borderRadius: 14, textAlign: "center", color: "#514332", lineHeight: 1.8, overflowWrap: "anywhere" }}>
        <div style={{ fontSize: 16, fontWeight: 600 }}>რაღაცები გავასწორე. შერიგების ფუნქცია ჯერ კიდევ მოლოდინის რეჟიმშია. 😂</div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>აღარ გავიდა მარტოობის 100 წელი?</div>
        <div style={{ borderTop: "1px solid #E8D5B3", marginTop: 12, paddingTop: 10, fontSize: 14, color: "#75634E" }}><b>P.S.</b> მანქანების ფასი ზოგზე 0$ და 1$ გიწერია და გაასწორე.</div>
      </div>
      {msg && <p style={{ color: "var(--ac2)" }}>{msg}</p>}
      {matches && (
        <div className="co" style={{ marginTop: 16 }}>
          <b>🔔 {matches.matches.length} customer request(s) match this car</b>
          {matches.matches.map((m) => {
            const d = m.contact.replace(/\D/g, "");
            const link = m.contact.startsWith("@") ? "https://t.me/" + m.contact.slice(1) : d.length > 6 ? "https://wa.me/" + d + "?text=" + encodeURIComponent(matches.message) : null;
            return (
              <div key={m.id} className="tl" style={{ display: "block" }}>
                <b>{m.contact}</b> <small style={{ color: "var(--ac2)" }}>{m.emailed ? "✓ e-mail sent" : ""}</small>
                <div style={{ color: "var(--mu)", fontWeight: 400 }}>{m.request}</div>
                {!m.emailed && link && <a className="chip on" target="_blank" rel="noopener noreferrer" href={link}>Message ({m.channel})</a>}
              </div>
            );
          })}
          <button className="chip" style={{ marginTop: 10 }} onClick={() => setMatches(null)}>Close</button>
        </div>
      )}

      {form && (
        <form className="co" style={{ marginTop: 20 }} onSubmit={(e) => e.preventDefault()}>
          <h3 style={{ marginTop: 0 }}>{form.id ? "Edit car" : "New car"}</h3>
          <div className="two">
            <div><label>Make</label><input value={form.make} onChange={set("make")} placeholder="Toyota" /></div>
            <div><label>Model</label><input value={form.model} onChange={set("model")} placeholder="Camry" /></div>
            <div><label>Year</label><input type="number" value={form.year} onChange={set("year")} /></div>
            <div><label>Price (USD)</label><input type="number" value={form.price} onChange={set("price")} /></div>
            <div><label>Mileage</label><input type="number" value={form.miles} onChange={set("miles")} /></div>
            <div><label>Status</label><select value={form.status} onChange={set("status")}>{Object.entries(ST).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
            <div><label>Fuel</label><select value={form.fuel} onChange={set("fuel")}>{["Gasoline", "Diesel", "Hybrid", "Electric"].map((x) => <option key={x}>{x}</option>)}</select></div>
            <div><label>Transmission</label><select value={form.trans} onChange={set("trans")}>{["Automatic", "Manual"].map((x) => <option key={x}>{x}</option>)}</select></div>
          </div>
          <div className="two">
            <div><label>Auction</label><select value={form.auction || ""} onChange={set("auction")}>{["", "Copart", "IAAI", "Manheim", "Other"].map((x) => <option key={x} value={x}>{x || "—"}</option>)}</select></div>
            <div><label>Damage (e.g. front, minor)</label><input value={form.damage || ""} onChange={set("damage")} /></div>
          </div>
          <div className="two">
            <div><label>Old price (shows a discount)</label><input type="number" value={form.old_price || ""} onChange={set("old_price")} /></div>
            <div><label>Damage level</label><select value={form.damage_level || ""} onChange={set("damage_level")}>{[["", "—"], ["none", "None"], ["minor", "Minor"], ["moderate", "Moderate"], ["severe", "Severe"]].map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
          </div>
          <label>Your costs (private, for profit): purchase / shipping / customs / repair</label>
          <div className="two">{[["cost_buy", "Purchase"], ["cost_ship", "Shipping"], ["cost_customs", "Customs"], ["cost_repair", "Repair"]].map(([k, l]) => <div key={k}><input type="number" placeholder={l} value={form[k] || ""} onChange={set(k)} /></div>)}</div>
          <label>Video link (YouTube or .mp4)</label><input value={form.video_url || ""} onChange={set("video_url")} />
          <label>History notes</label><textarea rows="2" value={form.history || ""} onChange={set("history")} />
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}><input type="checkbox" style={{ width: "auto" }} checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />Popular (show in “Popular” on the home page)</label>
          <label>VIN</label><input value={form.vin || ""} onChange={set("vin")} />
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", margin: "10px 0" }}>
            {[["real_photos", "Real photos"], ["vin_checked", "VIN checked"], ["inspection", "Inspection report"]].map(([k, l]) => (
              <label key={k} style={{ display: "flex", gap: 6, alignItems: "center", margin: 0 }}><input type="checkbox" style={{ width: "auto" }} checked={!!form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.checked })} />{l}</label>
            ))}
          </div>
          <label>Description</label><textarea rows="3" value={form.description} onChange={set("description")} />
          <label>Photos (the first one is the main photo)</label>
          <input type="file" accept="image/*" multiple onChange={(e) => addPhotos([...e.target.files])} />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
            {form.images.map((u, i) => (
              <div key={u} style={{ position: "relative" }}>
                <img src={u} alt="" style={{ height: 70, borderRadius: 8 }} />
                <button type="button" onClick={() => setForm({ ...form, images: form.images.filter((x) => x !== u) })} style={{ position: "absolute", top: 2, right: 2, border: 0, borderRadius: 50, width: 22, height: 22, cursor: "pointer" }}>✕</button>
                {i === 0 && <small style={{ position: "absolute", bottom: 2, left: 4, color: "#fff" }}>main</small>}
              </div>
            ))}
          </div>
          <div className="mini">
            <button className="btn" disabled={busy} onClick={save}>Save</button>
            <button type="button" className="btn g" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="mini" style={{ marginTop: 20, flexWrap: "wrap" }}>
        <button className="btn" disabled={!dirty || sorting || !!form} onClick={saveOrder}>Save order</button>
        <button className="chip" disabled={sorting || !!form} onClick={() => { setCars(old => [...old].sort((a,b) => new Date(b.created_at)-new Date(a.created_at) || String(a.id).localeCompare(String(b.id)))); setDirty(true); }}>Reset to newest first</button>
        <button className="chip" disabled={!dirty || sorting} onClick={load}>Discard changes</button>
        <span>Drag the handle or use arrows. {dirty ? "Unsaved order" : "Saved order"}</span>
      </div>
      <div style={{ marginTop: 20, display: "grid", gap: 10 }}>
        {cars.length === 0 && <div className="empty">No cars yet. Tap “Add car”.</div>}
        {cars.map((c, i) => (
          <div key={c.id} data-car-order={c.id} className="tl" style={{ alignItems: "center", flexWrap: "wrap" }}>
            <span style={{display:"flex",alignItems:"center",gap:8}}>
              <button type="button" className="chip" aria-label={"Drag " + c.make + " " + c.model} disabled={sorting || !!form} style={{touchAction:"none",cursor:"grab",fontSize:22}} onPointerDown={e => { drag.current = c.id; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerCancel={() => {drag.current=null;}} onPointerUp={e => { const target = document.elementFromPoint(e.clientX,e.clientY)?.closest("[data-car-order]")?.dataset.carOrder; if(drag.current && target) move(drag.current,target); drag.current=null; }}>⠿</button>
              <small>{i+1}</small>
              <button className="chip" aria-label="Move up" disabled={i===0 || sorting || !!form} onClick={()=>move(c.id,cars[i-1].id)}>↑</button>
              <button className="chip" aria-label="Move down" disabled={i===cars.length-1 || sorting || !!form} onClick={()=>move(c.id,cars[i+1].id)}>↓</button>
            </span>
            <span style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {c.images && c.images[0] && <img src={c.images[0]} alt="" style={{ height: 46, width: 70, objectFit: "cover", borderRadius: 8 }} />}
              <span>{c.year} {c.make} {c.model}<br /><small style={{ color: "var(--mu)" }}>{money(c.price)}{(c.cost_buy || c.cost_ship || c.cost_customs || c.cost_repair) ? " · costs " + money((c.cost_buy || 0) + (c.cost_ship || 0) + (c.cost_customs || 0) + (c.cost_repair || 0)) + (c.status === "sold" ? " · profit " + money(c.price - (c.cost_buy || 0) - (c.cost_ship || 0) - (c.cost_customs || 0) - (c.cost_repair || 0)) : "") : ""}</small></span>
            </span>
            <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <select disabled={dirty || sorting} value={c.status} onChange={(e) => setStatus(c, e.target.value)} style={{ background: "var(--card)", color: "var(--tx)", border: "1px solid var(--bd)", borderRadius: 8, padding: 6 }}>
                {Object.entries(ST).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <button disabled={dirty || sorting} className="chip" onClick={() => { setForm({ ...EMPTY, ...c, images: c.images || [], description: c.description || "" }); setMsg(""); window.scrollTo(0, 0); }}>Edit</button>
              <button disabled={dirty || sorting} className="chip" onClick={() => del(c)}>Delete</button>
            </span>
          </div>
        ))}
      </div>
      <h2 style={{ marginTop: 50 }}>Customer requests</h2>
      {alerts.length === 0 && <div className="empty">No requests yet.</div>}
      <div style={{ display: "grid", gap: 10 }}>
        {alerts.map((a) => (
          <div key={a.id} className="tl" style={{ display: "block" }}>
            <b>{a.contact}</b> <small style={{ color: "var(--mu)" }}>{new Date(a.created_at).toLocaleDateString()}{a.max_total ? " · max " + money(a.max_total) : ""}</small>
            <div style={{ color: "var(--mu)", fontWeight: 400 }}>{a.request}{a.max_price ? " · ≤ " + money(a.max_price) : ""}{a.max_total ? " · total ≤ " + money(a.max_total) : ""}{a.year_from ? " · " + a.year_from + "+" : ""}{a.auction && a.auction !== "any" ? " · " + a.auction : ""}{a.damage ? " · " + a.damage : ""}</div>
            <div className="mini">
              {a.contact.replace(/\D/g, "").length > 6 && <a className="chip" target="_blank" rel="noopener noreferrer" href={"https://wa.me/" + a.contact.replace(/\D/g, "")}>WhatsApp</a>}
              <button className="chip" onClick={async () => { await supabase.from("alerts").delete().eq("id", a.id); load(); }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <h2 style={{ marginTop: 50 }}>Reviews</h2>
      {reviews.length === 0 && <div className="empty">No reviews yet.</div>}
      <div style={{ display: "grid", gap: 10 }}>
        {reviews.map((r) => (
          <div key={r.id} className="tl" style={{ display: "block" }}>
            <b>{"★".repeat(r.rating)}</b> {r.name} <small style={{ color: r.approved ? "var(--ok)" : "var(--ac2)" }}>{r.approved ? "published" : "pending approval"}</small>
            <div style={{ color: "var(--mu)", fontWeight: 400 }}>{r.text}{r.car ? " · " + r.car : ""}</div>
            <div className="mini">
              {!r.approved ? <button className="chip on" onClick={() => upd(r, { approved: true })}>Approve</button> : <button className="chip" onClick={() => upd(r, { approved: false })}>Unpublish</button>}
              <button className="chip" onClick={() => upd(r, { verified_buyer: !r.verified_buyer })}>{r.verified_buyer ? "✓ Verified buyer" : "Mark as verified buyer"}</button>
              <button className="chip" onClick={() => delR(r)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
