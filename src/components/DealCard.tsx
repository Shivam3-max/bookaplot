"use client";

import Link from "next/link";
import { Deal } from "@/lib/types";
import { inr, inrFull, pctBelow } from "@/lib/format";
import { useSaved } from "@/context/SavedContext";
import ScoreRing from "./ScoreRing";
import DealVisual from "./DealVisual";

const badgeClass = (b: string) =>
  b === "Undervalued" || b === "Investor Pick" || b === "Early Entry"
    ? "chip badge-green"
    : b === "Hot Zone" || b === "Limited Inventory" || b === "Pre-Launch"
    ? "chip badge-gold"
    : "chip badge-steel";

export default function DealCard({ deal }: { deal: Deal }) {
  const { saved, compare, toggleSaved, toggleCompare } = useSaved();
  const isSaved = saved.includes(deal.slug);
  const inCompare = compare.includes(deal.slug);
  const below = pctBelow(deal.pricePerUnit, deal.benchmarkPerUnit);

  return (
    <article className="card card-hover group relative flex flex-col overflow-hidden">
      <Link href={`/deals/${deal.slug}`} className="relative block h-44 overflow-hidden">
        <DealVisual deal={deal} className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {deal.badges.slice(0, 2).map((b) => (
            <span key={b} className={badgeClass(b)}>
              {(b === "Hot Zone" || deal.hot) && b === deal.badges[0] && (
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--red)]" />
              )}
              {b}
            </span>
          ))}
        </div>
        {/* hover overlay: why this deal matters */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-slate/95 via-slate/70 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--gold)" }}>
            Why it matters
          </p>
          <p className="mt-1 text-[13px] font-medium leading-snug text-white">{deal.upsideNote}</p>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/deals/${deal.slug}`}>
              <h3 className="font-display text-[15.5px] font-bold leading-tight hover:underline">{deal.title}</h3>
            </Link>
            <p className="mt-0.5 truncate text-xs text-graphite">
              {deal.cityLabel} · {deal.type}
            </p>
          </div>
          <ScoreRing score={deal.score} size={42} />
        </div>

        <div className="mt-3 flex items-end justify-between rounded-xl bg-paper px-3 py-2.5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-graphite">Starting</p>
            <p className="font-display text-lg font-black">{inr(deal.price)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-graphite">
              {inrFull(deal.pricePerUnit)}/{deal.unit}
            </p>
            {below > 0 && (
              <p className="text-xs font-bold text-green">{below}% below benchmark</p>
            )}
          </div>
        </div>

        <ul className="mt-3 space-y-1">
          {deal.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex items-start gap-1.5 text-xs text-slate">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center gap-2 border-t border-line pt-3">
          <Link href={`/deals/${deal.slug}`} className="btn-primary flex-1 justify-center !py-2 !text-[13px]">
            View Deal
          </Link>
          <button
            onClick={() => toggleSaved(deal.slug)}
            title={isSaved ? "Remove from saved" : "Save deal"}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
              isSaved ? "border-gold bg-gold-soft text-[#8a6b30]" : "border-line text-graphite hover:border-gold"
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          <button
            onClick={() => toggleCompare(deal.slug)}
            title={inCompare ? "Remove from compare" : "Add to compare"}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
              inCompare ? "border-green bg-green-soft text-green" : "border-line text-graphite hover:border-green"
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="18" rx="1" /><rect x="14" y="8" width="7" height="13" rx="1" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
