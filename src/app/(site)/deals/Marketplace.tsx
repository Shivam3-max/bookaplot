"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DEALS, LOCATIONS } from "@/lib/data";
import DealCard from "@/components/DealCard";
import Reveal from "@/components/Reveal";
import { pctBelow } from "@/lib/format";

const TYPES = ["Residential Plot", "Commercial Plot", "SCO / Booth", "Township Plot", "Land Parcel", "Residential Unit"];
const BADGES = ["Undervalued", "Investor Pick", "Hot Zone", "Growth Corridor", "Premium Plot", "Commercial Opportunity", "Pre-Launch", "Early Entry"];
const STATUSES = ["Ready", "Pre-Launch", "Resale", "Fresh Inventory"];
const SORTS = [
  { id: "newest", label: "Newest" },
  { id: "value", label: "Best value" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "score", label: "Deal score" },
];

export default function Marketplace() {
  const params = useSearchParams();
  const [city, setCity] = useState(params.get("city") || "");
  const [type, setType] = useState(params.get("type") || "");
  const [badge, setBadge] = useState("");
  const [status, setStatus] = useState("");
  const [budget, setBudget] = useState(params.get("budget") || "");
  const [sort, setSort] = useState("value");

  const filtered = useMemo(() => {
    let list = [...DEALS];
    if (city) list = list.filter((d) => d.city === city);
    if (type) list = list.filter((d) => d.type === type);
    if (badge) list = list.filter((d) => d.badges.includes(badge as never));
    if (status) list = list.filter((d) => d.status === status);
    if (budget) {
      const [lo, hi] = budget.split("-").map(Number);
      list = list.filter((d) => d.price >= lo && d.price <= hi);
    }
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "score": list.sort((a, b) => b.score - a.score); break;
      case "value": list.sort((a, b) => pctBelow(b.pricePerUnit, b.benchmarkPerUnit) - pctBelow(a.pricePerUnit, a.benchmarkPerUnit)); break;
      default: list.sort((a, b) => Number(b.newListing || 0) - Number(a.newListing || 0));
    }
    return list;
  }, [city, type, badge, status, budget, sort]);

  const anyFilter = city || type || badge || status || budget;

  const sections = anyFilter
    ? [{ title: `${filtered.length} matching opportunit${filtered.length === 1 ? "y" : "ies"}`, deals: filtered }]
    : [
        { title: "Hot This Week", deals: filtered.filter((d) => d.hot) },
        { title: "New Listings", deals: filtered.filter((d) => d.newListing) },
        { title: "Investor Picks", deals: filtered.filter((d) => d.investorPick) },
        { title: "Commercial Opportunities", deals: filtered.filter((d) => d.purpose.includes("commercial")) },
        { title: "Residential & Township Plots", deals: filtered.filter((d) => ["Residential Plot", "Township Plot"].includes(d.type)) },
        { title: "New Chandigarh / Kharar Growth Opportunities", deals: filtered.filter((d) => ["new-chandigarh", "kharar"].includes(d.city)) },
        { title: "Premium Chandigarh / Panchkula Pockets", deals: filtered.filter((d) => ["chandigarh", "panchkula"].includes(d.city)) },
      ].filter((s) => s.deals.length > 0);

  return (
    <>
      <section className="grid-bg border-b border-line py-12">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">The marketplace</p>
            <h1 className="mt-3 max-w-2xl text-3xl font-black leading-tight sm:text-5xl">
              Curated Undervalued Deals Across Tricity
            </h1>
            <p className="mt-4 max-w-2xl text-graphite">
              Browse opportunities across plotted developments, residential projects, commercial
              assets, pre-launch entries, growth-corridor land and more.
            </p>
          </Reveal>
        </div>
      </section>

      {/* filter bar */}
      <div className="sticky top-16 z-40 border-b border-line bg-white/85 py-3 backdrop-blur-xl">
        <div className="container-x flex flex-wrap items-center gap-2">
          <select value={city} onChange={(e) => setCity(e.target.value)} className="input !w-auto !py-2 !text-[13px]">
            <option value="">All cities</option>
            {LOCATIONS.map((l) => <option key={l.slug} value={l.slug}>{l.name}</option>)}
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)} className="input !w-auto !py-2 !text-[13px]">
            <option value="">All types</option>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select value={budget} onChange={(e) => setBudget(e.target.value)} className="input !w-auto !py-2 !text-[13px]">
            <option value="">Any budget</option>
            <option value="0-5000000">Under ₹50 L</option>
            <option value="5000000-15000000">₹50 L – ₹1.5 Cr</option>
            <option value="15000000-999999999">Above ₹1.5 Cr</option>
          </select>
          <select value={badge} onChange={(e) => setBadge(e.target.value)} className="input !w-auto !py-2 !text-[13px]">
            <option value="">All badges</option>
            {BADGES.map((b) => <option key={b}>{b}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input !w-auto !py-2 !text-[13px]">
            <option value="">Any status</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <div className="ml-auto flex items-center gap-2">
            {anyFilter && (
              <button
                onClick={() => { setCity(""); setType(""); setBadge(""); setStatus(""); setBudget(""); }}
                className="text-xs font-bold text-graphite underline hover:text-ink"
              >
                Clear all
              </button>
            )}
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="input !w-auto !py-2 !text-[13px] font-semibold">
              {SORTS.map((s) => <option key={s.id} value={s.id}>Sort: {s.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="container-x pb-8 pt-10">
        {sections.length === 0 && (
          <div className="card p-12 text-center">
            <p className="font-display text-xl font-bold">No deals match those filters</p>
            <p className="mt-2 text-sm text-graphite">Try widening the budget or clearing a filter — or tell us what you&apos;re looking for and we&apos;ll source it.</p>
          </div>
        )}
        {sections.map((s) => (
          <section key={s.title} className="mb-12">
            <Reveal>
              <h2 className="font-display text-xl font-black sm:text-2xl">{s.title}</h2>
              <div className="mt-1 h-1 w-12 rounded-full" style={{ background: "var(--gold)" }} />
            </Reveal>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {s.deals.map((d, i) => (
                <Reveal key={d.slug} delay={i * 60}>
                  <DealCard deal={d} />
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
