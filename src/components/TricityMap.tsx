"use client";

import { useState } from "react";
import Link from "next/link";
import { LOCATIONS, DEALS } from "@/lib/data";
import { inr } from "@/lib/format";

interface Props {
  showDeals?: boolean;
  heat?: boolean;
  corridors?: boolean;
  activeCity?: string | null;
  onSelect?: (slug: string) => void;
  className?: string;
}

/** Stylized 3D-feel Tricity opportunity map (SVG). */
export default function TricityMap({
  showDeals = true,
  heat = true,
  corridors = true,
  activeCity = null,
  onSelect,
  className = "",
}: Props) {
  const [hover, setHover] = useState<string | null>(null);
  const focus = hover || activeCity;

  const corridorPaths = [
    "M55,35 Q45,44 40,55", // Chd → Mohali
    "M55,35 Q42,27 30,20", // Chd → New Chd
    "M55,35 Q57,52 58,70", // Chd → Zirakpur
    "M40,55 Q29,50 20,45", // Mohali → Kharar
    "M58,70 Q66,77 74,84", // Zirakpur → Derabassi
    "M55,35 Q64,31 72,28", // Chd → Panchkula
  ];

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 100 100" className="h-full w-full select-none">
        <defs>
          <radialGradient id="heatring" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.28" />
            <stop offset="70%" stopColor="var(--gold)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
          </radialGradient>
          <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="1.2" stdDeviation="1.4" floodColor="#1c1f24" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* region plate */}
        <path
          d="M14,38 Q10,24 24,14 Q40,6 58,10 Q80,12 86,26 Q94,42 88,60 Q86,78 72,90 Q56,98 42,90 Q24,84 18,66 Q12,52 14,38 Z"
          fill="white"
          stroke="var(--line)"
          strokeWidth="0.5"
          filter="url(#soft)"
        />
        <path
          d="M14,38 Q10,24 24,14 Q40,6 58,10 Q80,12 86,26 Q94,42 88,60 Q86,78 72,90 Q56,98 42,90 Q24,84 18,66 Q12,52 14,38 Z"
          fill="none"
          stroke="var(--warm)"
          strokeWidth="0.3"
          transform="translate(0 1.6)"
          opacity="0.9"
        />

        {/* subtle inner grid */}
        {[25, 40, 55, 70].map((y) => (
          <line key={y} x1="16" y1={y} x2="86" y2={y} stroke="var(--warm)" strokeWidth="0.25" />
        ))}
        {[30, 45, 60, 75].map((x) => (
          <line key={x} x1={x} y1="14" x2={x} y2="90" stroke="var(--warm)" strokeWidth="0.25" />
        ))}

        {/* growth corridors */}
        {corridors &&
          corridorPaths.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="var(--green)" strokeWidth="0.55" opacity="0.5" className="corridor-line" />
          ))}

        {/* heat rings */}
        {heat &&
          LOCATIONS.map((l) => (
            <circle
              key={`h-${l.slug}`}
              cx={l.mapX}
              cy={l.mapY}
              r={4 + l.growthScore / 12}
              fill="url(#heatring)"
            />
          ))}

        {/* deal pins */}
        {showDeals &&
          DEALS.map((d) => (
            <g key={d.slug} transform={`translate(${d.mapX} ${d.mapY})`} opacity="0.9">
              <circle r="1.1" fill="var(--gold)">
                <animate attributeName="r" values="1.1;1.5;1.1" dur="2.4s" repeatCount="indefinite" />
              </circle>
            </g>
          ))}

        {/* city markers */}
        {LOCATIONS.map((l) => {
          const active = focus === l.slug;
          return (
            <g
              key={l.slug}
              transform={`translate(${l.mapX} ${l.mapY})`}
              className="cursor-pointer"
              onMouseEnter={() => setHover(l.slug)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onSelect?.(l.slug)}
            >
              <circle r={active ? 3.4 : 2.6} fill={active ? "var(--ink)" : "var(--slate)"} className="transition-all" />
              <circle r="1" fill="var(--gold)" />
              <text
                y="-4.6"
                textAnchor="middle"
                className="font-display"
                style={{ fontSize: active ? 3.2 : 2.7, fontWeight: 700, fill: "var(--ink)", transition: "all .2s" }}
              >
                {l.name.replace(" & Airport Belt", "")}
              </text>
            </g>
          );
        })}
      </svg>

      {/* hover info card */}
      {focus && (
        <div className="pointer-events-none absolute bottom-3 left-3 max-w-[240px] rounded-xl border border-line bg-white/95 p-3 shadow-lg backdrop-blur">
          {(() => {
            const l = LOCATIONS.find((x) => x.slug === focus)!;
            const count = DEALS.filter((d) => d.city === focus).length;
            const min = Math.min(...DEALS.filter((d) => d.city === focus).map((d) => d.price));
            return (
              <>
                <p className="font-display text-sm font-bold">{l.name}</p>
                <p className="text-[11px] text-graphite">{l.tagline}</p>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-green">{count} live deal{count !== 1 ? "s" : ""}</span>
                  {count > 0 && <span className="text-graphite">from {inr(min)}</span>}
                </div>
                <p className="mt-1 text-[11px] text-graphite">Avg {l.avgPerSqYd}/sq yd · Growth score {l.growthScore}</p>
              </>
            );
          })()}
        </div>
      )}

      <Link
        href="/map"
        className="absolute right-3 top-3 rounded-full border border-line bg-white/90 px-3 py-1.5 text-xs font-bold text-slate shadow-sm backdrop-blur transition-colors hover:border-gold"
      >
        Open Full Map ↗
      </Link>
    </div>
  );
}
