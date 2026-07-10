"use client";

import Link from "next/link";
import { useSaved } from "@/context/SavedContext";
import { DEALS, getDeal } from "@/lib/data";
import DealCard from "@/components/DealCard";
import Reveal from "@/components/Reveal";
import ScoreRing from "@/components/ScoreRing";
import { inr, inrFull, pctBelow } from "@/lib/format";

export default function SavedDashboard() {
  const { saved, compare, viewed, toggleCompare, clearCompare } = useSaved();
  const savedDeals = DEALS.filter((d) => saved.includes(d.slug));
  const compareDeals = compare.map(getDeal).filter(Boolean) as typeof DEALS;
  const viewedDeals = viewed.map(getDeal).filter(Boolean).slice(0, 4) as typeof DEALS;

  return (
    <>
      <section className="grid-bg border-b border-line py-12">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Your dashboard</p>
            <h1 className="mt-3 text-3xl font-black sm:text-4xl">Saved Deals &amp; Compare</h1>
            <p className="mt-3 max-w-xl text-graphite">
              Behave like a serious buyer: shortlist, compare up to four opportunities side by side,
              and book visits from one place. Everything is stored on this device.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-10">
        <Reveal>
          <h2 className="font-display text-xl font-black">Saved deals ({savedDeals.length})</h2>
        </Reveal>
        {savedDeals.length > 0 ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {savedDeals.map((d, i) => (
              <Reveal key={d.slug} delay={i * 60}><DealCard deal={d} /></Reveal>
            ))}
          </div>
        ) : (
          <div className="card mt-5 p-10 text-center">
            <p className="font-display font-bold">Nothing saved yet</p>
            <p className="mt-1 text-sm text-graphite">Tap the bookmark on any deal card to build your shortlist.</p>
            <Link href="/deals" className="btn-primary mt-5">Explore Deals</Link>
          </div>
        )}
      </section>

      {/* compare table */}
      <section id="compare" className="container-x scroll-mt-24 py-10">
        <Reveal>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-black">Compare ({compareDeals.length}/4)</h2>
            {compareDeals.length > 0 && (
              <button onClick={clearCompare} className="text-xs font-bold text-graphite underline hover:text-ink">Clear compare</button>
            )}
          </div>
        </Reveal>
        {compareDeals.length >= 2 ? (
          <Reveal delay={80}>
            <div className="card mt-5 overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-line bg-paper">
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-graphite">Attribute</th>
                    {compareDeals.map((d) => (
                      <th key={d.slug} className="px-4 py-3 text-left">
                        <Link href={`/deals/${d.slug}`} className="font-display text-[13px] font-black leading-snug hover:underline">{d.title}</Link>
                        <p className="text-[11px] font-medium text-graphite">{d.cityLabel}</p>
                        <button onClick={() => toggleCompare(d.slug)} className="mt-1 text-[10px] font-bold text-graphite underline">remove</button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {([
                    ["Deal score", (d) => <ScoreRing score={d.score} size={40} />],
                    ["Starting price", (d) => <b>{inr(d.price)}</b>],
                    ["Rate", (d) => `${inrFull(d.pricePerUnit)}/${d.unit}`],
                    ["Benchmark", (d) => `${inrFull(d.benchmarkPerUnit)}/${d.unit}`],
                    ["Vs benchmark", (d) => {
                      const b = pctBelow(d.pricePerUnit, d.benchmarkPerUnit);
                      return <span className={b > 0 ? "font-bold text-green" : ""}>{b > 0 ? `▼ ${b}% below` : "At market"}</span>;
                    }],
                    ["Type", (d) => d.type],
                    ["Sizes", (d) => d.areaLabel],
                    ["Status", (d) => d.status],
                    ["Possession", (d) => d.possession],
                    ["Approval", (d) => d.approval],
                    ["Top upside", (d) => d.upsideNote],
                  ] as [string, (d: (typeof DEALS)[number]) => React.ReactNode][]).map(([label, fn]) => (
                    <tr key={label} className="border-b border-line last:border-0">
                      <td className="whitespace-nowrap px-4 py-3 font-bold text-graphite">{label}</td>
                      {compareDeals.map((d) => (
                        <td key={d.slug} className="px-4 py-3 align-top">{fn(d)}</td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-paper">
                    <td className="px-4 py-3" />
                    {compareDeals.map((d) => (
                      <td key={d.slug} className="px-4 py-3">
                        <Link href={`/book-visit?deal=${d.slug}`} className="btn-gold !px-4 !py-2 !text-xs">Book Visit</Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Reveal>
        ) : (
          <div className="card mt-5 p-8 text-center">
            <p className="text-sm text-graphite">Add at least 2 deals to compare (use the compare icon on any deal card).</p>
          </div>
        )}
      </section>

      {viewedDeals.length > 0 && (
        <section className="container-x py-10">
          <Reveal><h2 className="font-display text-xl font-black">Recently viewed</h2></Reveal>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {viewedDeals.map((d, i) => (
              <Reveal key={d.slug} delay={i * 60}><DealCard deal={d} /></Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
