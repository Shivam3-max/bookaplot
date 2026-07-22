"use client";

import { useState } from "react";
import { useNetwork } from "@/context/NetworkContext";
import { CREATIVES } from "@/lib/network-data";

export default function CreativesPage() {
  const { account, creativeRequests, requestCreative } = useNetwork();
  const [requested, setRequested] = useState<string | null>(null);
  if (!account) return null;
  const isCp = account.role === "cp";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black">{isCp ? "Creatives & Videos" : "Investment Deal Videos"}</h1>
        <p className="text-sm text-graphite">
          {isCp
            ? "Reels, brochures and WhatsApp packs — customized with your name, number and branding before delivery."
            : "Investor-cut videos and analysis packs for network deals."}
        </p>
      </div>

      {isCp && (
        <div className="card flex flex-wrap items-center justify-between gap-3 border-l-4 p-5" style={{ borderLeftColor: "var(--gold)" }}>
          <div>
            <p className="font-display font-black">Every asset ships customized</p>
            <p className="text-xs text-graphite">Your name + number burned into videos, your logo on brochures. Request below — delivery in 48 hrs.</p>
          </div>
          <span className="chip badge-gold">{creativeRequests.length} customization{creativeRequests.length === 1 ? "" : "s"} in queue</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CREATIVES.map((c) => (
          <div key={c.id} className="card card-hover overflow-hidden">
            <div className="relative flex h-36 items-center justify-center" style={{ background: `linear-gradient(135deg, hsl(${c.hue} 30% 88%), hsl(${c.hue} 34% 72%))` }}>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/85 shadow-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--ink)"><path d="M8 5v14l11-7z" /></svg>
              </span>
              <span className={`chip absolute left-3 top-3 !text-[10px] ${c.status === "Ready" ? "badge-green" : "badge-gold"}`}>{c.status}</span>
            </div>
            <div className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--gold)" }}>{c.type}</p>
              <h2 className="mt-1 font-display text-[15px] font-bold leading-snug">{c.title}</h2>
              <p className="mt-0.5 text-xs text-graphite">{c.deal}</p>
              <div className="mt-3 flex gap-2">
                <button className="btn-ghost flex-1 justify-center !py-2 !text-xs" disabled={c.status !== "Ready"}>
                  {c.status === "Ready" ? "Download ↓" : "In production…"}
                </button>
                {isCp && c.status === "Ready" && (
                  <button
                    onClick={() => { requestCreative(c.title); setRequested(c.id); }}
                    className={`btn flex-1 justify-center !py-2 !text-xs text-white ${requested === c.id ? "!bg-green" : "!bg-ink hover:!bg-green"}`}
                  >
                    {requested === c.id ? "✓ Queued (48h)" : "Customize for Me"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
