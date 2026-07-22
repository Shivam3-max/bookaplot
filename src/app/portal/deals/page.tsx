"use client";

import Link from "next/link";
import { useState } from "react";
import { useNetwork } from "@/context/NetworkContext";
import { DEALS } from "@/lib/data";
import { MANDATES } from "@/lib/network-data";
import { inr, inrFull, pctBelow } from "@/lib/format";
import DealVisual from "@/components/DealVisual";
import ScoreRing from "@/components/ScoreRing";

export default function PortalDeals() {
  const { account } = useNetwork();
  const [filter, setFilter] = useState<"all" | "urgent" | "exclusive">("all");
  if (!account) return null;
  const isCp = account.role === "cp";

  let list = DEALS.filter((d) => MANDATES[d.slug]);
  if (filter === "urgent") list = list.filter((d) => MANDATES[d.slug].urgent);
  if (filter === "exclusive") list = list.filter((d) => MANDATES[d.slug].mandateType !== "Verified Mandate");

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black">{isCp ? "Exclusive Mandate Deals" : "Verified Network Deals"}</h1>
          <p className="text-sm text-graphite">
            Full pricing, benchmarks{isCp ? ", commission slabs and marketing kits" : " and papers"} — never shown to the public.
          </p>
        </div>
        <div className="flex gap-2">
          {([["all", "All"], ["urgent", "🔥 Urgent / Desperate"], ["exclusive", "Exclusive & Sole"]] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${filter === id ? "bg-ink text-white" : "border border-line bg-white text-graphite"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {list.map((d) => {
          const m = MANDATES[d.slug];
          const below = pctBelow(d.pricePerUnit, d.benchmarkPerUnit);
          return (
            <div key={d.slug} className="card overflow-hidden">
              <div className="grid md:grid-cols-[240px_1fr]">
                <DealVisual deal={d} className="h-44 md:h-full" />
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="chip badge-gold">{m.mandateType}</span>
                        {m.urgent && (
                          <span className="chip !border-[#f0c9c0] !bg-[#faece9] !text-[var(--red)]">
                            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--red)]" /> Urgent exit
                          </span>
                        )}
                        <span className="chip">{m.validity}</span>
                      </div>
                      <h2 className="mt-2 font-display text-lg font-black">{d.title}</h2>
                      <p className="text-xs text-graphite">{d.microLocation}</p>
                    </div>
                    <ScoreRing score={d.score} size={46} />
                  </div>

                  <div className="mt-4 grid gap-3 rounded-xl bg-paper p-4 sm:grid-cols-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-graphite">Network price</p>
                      <p className="font-display text-lg font-black">{inr(d.price)}{d.priceMax ? `–${inr(d.priceMax)}` : ""}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-graphite">Rate / benchmark</p>
                      <p className="text-sm font-bold">{inrFull(d.pricePerUnit)} <span className="text-graphite">vs {inrFull(d.benchmarkPerUnit)}</span></p>
                      {below > 0 && <p className="text-xs font-bold text-green">▼ {below}% under market</p>}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-graphite">{isCp ? "Your commission" : "Investor angle"}</p>
                      <p className="text-sm font-bold leading-snug" style={isCp ? { color: "var(--gold)" } : undefined}>
                        {isCp ? m.commission : m.investorNote}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-graphite">Sizes / status</p>
                      <p className="text-sm font-bold leading-snug">{d.areaLabel} · {d.status}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-graphite">{isCp ? "Marketing kit:" : "Pack:"}</span>
                    {m.kit.map((k) => (
                      <button key={k} className="chip !py-1.5 transition-colors hover:border-gold">{k} ↓</button>
                    ))}
                    <div className="ml-auto flex gap-2">
                      <Link href={`/deals/${d.slug}`} className="btn-ghost !px-4 !py-2 !text-xs">Full Page</Link>
                      <Link href={`/book-visit?deal=${d.slug}`} className="btn-gold !px-4 !py-2 !text-xs">
                        {isCp ? "Book Client Visit" : "Book Site Visit"}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
