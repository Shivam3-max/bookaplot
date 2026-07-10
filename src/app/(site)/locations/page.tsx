import type { Metadata } from "next";
import Link from "next/link";
import { LOCATIONS, DEALS } from "@/lib/data";
import Reveal from "@/components/Reveal";
import Sparkline from "@/components/Sparkline";

export const metadata: Metadata = {
  title: "Locations — Explore Opportunities by Tricity Zone",
  description:
    "Explore real estate opportunities by city across Chandigarh, Mohali, Panchkula, Zirakpur, New Chandigarh, Kharar and the Derabassi airport belt.",
};

export default function LocationsPage() {
  return (
    <>
      <section className="grid-bg border-b border-line py-14">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Geography first</p>
            <h1 className="mt-3 max-w-2xl text-3xl font-black leading-tight sm:text-5xl">
              Explore Opportunities by Location
            </h1>
            <p className="mt-4 max-w-2xl text-graphite">
              BookAPlot is built around Tricity and its growth corridors. Explore opportunities by
              city, demand pattern, affordability band, and development stage.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LOCATIONS.map((l, i) => {
            const count = DEALS.filter((d) => d.city === l.slug).length;
            return (
              <Reveal key={l.slug} delay={i * 70}>
                <Link href={`/locations/${l.slug}`} className="card card-hover group block h-full overflow-hidden">
                  <div className="relative h-24 overflow-hidden" style={{ background: `linear-gradient(120deg, hsl(${l.hue} 30% 92%), hsl(${l.hue} 34% 82%))` }}>
                    <Sparkline data={l.trend} className="absolute inset-x-0 bottom-0 h-16 w-full opacity-70" />
                    <span className={`chip absolute left-4 top-4 ${l.maturity === "Mature" ? "badge-steel" : l.maturity === "Growing" ? "badge-gold" : "badge-green"}`}>
                      {l.maturity}
                    </span>
                    <span className="chip absolute right-4 top-4">{count} live deal{count !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="p-5">
                    <h2 className="font-display text-xl font-black group-hover:underline">{l.name}</h2>
                    <p className="mt-0.5 text-[13px] font-semibold" style={{ color: "var(--gold)" }}>{l.tagline}</p>
                    <p className="mt-2.5 text-[13.5px] leading-relaxed text-graphite">{l.overview}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-line pt-3.5 text-sm">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-graphite">Price band</p>
                        <p className="font-bold">{l.priceBand}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-graphite">Growth score</p>
                        <p className="font-display font-black" style={{ color: "var(--green)" }}>{l.growthScore}/100</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
