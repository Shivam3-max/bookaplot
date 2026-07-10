import { Deal } from "@/lib/types";

/** Stylized aerial-plot placeholder art, tinted per deal, until real photography arrives. */
export default function DealVisual({ deal, className = "" }: { deal: Deal; className?: string }) {
  const h = deal.hue;
  return (
    <div className={`relative overflow-hidden ${className}`} aria-hidden>
      <svg viewBox="0 0 400 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`sky-${deal.slug}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`hsl(${h} 32% 94%)`} />
            <stop offset="100%" stopColor={`hsl(${h} 26% 86%)`} />
          </linearGradient>
          <linearGradient id={`plot-${deal.slug}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={`hsl(${h} 30% 74%)`} />
            <stop offset="100%" stopColor={`hsl(${h} 34% 62%)`} />
          </linearGradient>
        </defs>
        <rect width="400" height="240" fill={`url(#sky-${deal.slug})`} />
        {/* road grid */}
        {[60, 140, 220, 300].map((x) => (
          <rect key={x} x={x} y="0" width="10" height="240" fill="white" opacity="0.55" />
        ))}
        {[70, 150].map((y) => (
          <rect key={y} x="0" y={y} width="400" height="10" fill="white" opacity="0.55" />
        ))}
        {/* plot parcels */}
        {[
          [76, 84, 58, 60], [76, 166, 58, 52], [156, 84, 58, 60], [236, 12, 58, 52],
          [316, 84, 70, 60], [156, 166, 58, 52], [316, 166, 70, 52], [0, 84, 54, 60],
        ].map(([x, y, w, hh], i) => (
          <rect
            key={i}
            x={x} y={y} width={w} height={hh} rx="4"
            fill={i === 2 ? `url(#plot-${deal.slug})` : `hsl(${h} 24% ${82 - (i % 3) * 4}%)`}
            stroke={`hsl(${h} 20% 70%)`}
            strokeWidth="1"
          />
        ))}
        {/* highlighted plot marker */}
        <g transform="translate(185 96)">
          <circle cx="0" cy="0" r="16" fill="var(--gold)" opacity="0.25" />
          <circle cx="0" cy="0" r="7" fill="var(--gold)" />
          <path d="M0 -22 L5 -12 L-5 -12 Z" fill="var(--gold)" />
        </g>
        {/* greens */}
        <circle cx="352" cy="40" r="18" fill={`hsl(${h + 60} 30% 72%)`} opacity="0.8" />
        <circle cx="30" cy="200" r="22" fill={`hsl(${h + 60} 30% 72%)`} opacity="0.8" />
      </svg>
      <span className="absolute bottom-2 right-2 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-graphite">
        Representative visual
      </span>
    </div>
  );
}
