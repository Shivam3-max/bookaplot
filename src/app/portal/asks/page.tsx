"use client";

import { useState, FormEvent } from "react";
import { useNetwork } from "@/context/NetworkContext";
import { Ask } from "@/lib/network-data";

const statusTone = (s: Ask["status"]) =>
  s === "Matched" ? "badge-green" : s === "Platform Reverted" ? "badge-gold" : "badge-steel";

function AskCard({ ask, cpView, onPitch, pitched }: { ask: Ask; cpView?: boolean; onPitch?: () => void; pitched?: boolean }) {
  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-display font-black">{ask.type}</p>
          <p className="text-xs text-graphite">{ask.investor} · {ask.created} · {ask.id}</p>
        </div>
        <div className="flex items-center gap-2">
          {ask.urgency.startsWith("Urgent") && (
            <span className="chip !border-[#f0c9c0] !bg-[#faece9] !text-[10px] !text-[var(--red)]">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--red)]" /> Desperate deal
            </span>
          )}
          <span className={`chip !text-[10px] ${statusTone(ask.status)}`}>{ask.status}</span>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-paper p-3 text-xs">
        <div><p className="text-[9px] font-bold uppercase tracking-wider text-graphite">Budget</p><p className="mt-0.5 font-semibold">{ask.budget}</p></div>
        <div><p className="text-[9px] font-bold uppercase tracking-wider text-graphite">Locations</p><p className="mt-0.5 font-semibold">{ask.locations}</p></div>
        <div><p className="text-[9px] font-bold uppercase tracking-wider text-graphite">Urgency</p><p className="mt-0.5 font-semibold">{ask.urgency}</p></div>
      </div>
      {ask.note && <p className="mt-2.5 text-[13px] italic text-slate">&ldquo;{ask.note}&rdquo;</p>}

      {!cpView && ask.replies.length > 0 && (
        <div className="mt-3.5 space-y-2">
          {ask.replies.map((r, i) => (
            <div key={i} className="rounded-xl border border-[#c5dcd2] bg-green-soft p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-green">↳ Platform revert · {r.date}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-slate">{r.text}</p>
            </div>
          ))}
        </div>
      )}

      {cpView && (
        <div className="mt-3.5 flex items-center justify-between">
          <p className="text-[11px] text-graphite">Have matching inventory in your territory?</p>
          <button
            onClick={onPitch}
            className={`btn !px-4 !py-2 !text-xs text-white ${pitched ? "!bg-green" : "!bg-ink hover:!bg-green"}`}
          >
            {pitched ? "✓ Pitched to desk" : "Pitch My Inventory"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function AsksPage() {
  const { account, asks, addAsk } = useNetwork();
  const [posted, setPosted] = useState(false);
  const [pitched, setPitched] = useState<string[]>([]);
  if (!account) return null;
  const isCp = account.role === "cp";

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    addAsk({
      investor: `You · ${account.name}`,
      budget: String(f.get("budget")),
      type: String(f.get("type")),
      locations: String(f.get("locations")),
      urgency: f.get("urgency") as Ask["urgency"],
      note: String(f.get("note") || ""),
    });
    setPosted(true);
    e.currentTarget.reset();
    setTimeout(() => setPosted(false), 4000);
  };

  const mine = asks.filter((a) => a.investor.startsWith("You"));
  const network = asks.filter((a) => !a.investor.startsWith("You"));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black">
          {isCp ? "Investor Asks — Live Demand Feed" : "Give & Ask"}
        </h1>
        <p className="text-sm text-graphite">
          {isCp
            ? "Real requirements from verified investors. If your territory holds a fit, pitch it — the desk routes matched pitches."
            : "State the requirement once. The platform matches it against live mandates and reverts to you — no hunting."}
        </p>
      </div>

      {!isCp && (
        <div className="card overflow-hidden">
          <div className="bg-ink px-6 py-4">
            <p className="font-display font-black text-white">Post a requirement</p>
            <p className="text-xs text-white/60">Reverts typically land within 24 hours. Urgent asks route to the desperate-deals desk.</p>
          </div>
          <form onSubmit={submit} className="grid gap-4 p-6 sm:grid-cols-2">
            <div>
              <label className="label">What are you looking for? *</label>
              <input name="type" required className="input" placeholder="e.g. Tenanted SCO / residential plot" />
            </div>
            <div>
              <label className="label">Budget *</label>
              <select name="budget" required className="input" defaultValue="">
                <option value="" disabled>Select…</option>
                <option>Under ₹50 L</option><option>₹50 L – 1 Cr</option><option>₹1 – 2 Cr</option><option>₹2 – 5 Cr</option><option>₹5 Cr+</option>
              </select>
            </div>
            <div>
              <label className="label">Preferred locations *</label>
              <input name="locations" required className="input" placeholder="e.g. Zirakpur, Mohali airport road" />
            </div>
            <div>
              <label className="label">Urgency *</label>
              <select name="urgency" required className="input" defaultValue="">
                <option value="" disabled>Select…</option>
                <option>Exploring</option>
                <option>Ready in 30 days</option>
                <option>Urgent — desperate deal wanted</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Anything specific?</label>
              <textarea name="note" className="input min-h-16" placeholder="Yield target, title preferences, payment mode…" />
            </div>
            <button type="submit" className="btn-gold justify-center sm:col-span-2">
              {posted ? "✓ Posted — desk is matching now" : "Post to the Give & Ask Desk"}
            </button>
          </form>
        </div>
      )}

      {!isCp && mine.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-lg font-black">Your asks &amp; platform reverts</h2>
          {mine.map((a) => <AskCard key={a.id} ask={a} />)}
        </div>
      )}

      <div className="space-y-4">
        <h2 className="font-display text-lg font-black">
          {isCp ? `Live investor asks (${network.length})` : "What other investors are asking"}
        </h2>
        {(isCp ? network : network.slice(0, 3)).map((a) => (
          <AskCard
            key={a.id}
            ask={a}
            cpView={isCp}
            pitched={pitched.includes(a.id)}
            onPitch={() => setPitched((p) => [...p, a.id])}
          />
        ))}
      </div>
    </div>
  );
}
