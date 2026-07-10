"use client";

import { useState } from "react";
import Link from "next/link";
import { LOCATIONS, DEALS } from "@/lib/data";
import TricityMap from "@/components/TricityMap";
import Reveal from "@/components/Reveal";
import DealCard from "@/components/DealCard";

const LAYERS = [
  { id: "deals", label: "Featured deal pins" },
  { id: "corridors", label: "Growth corridors" },
  { id: "heat", label: "Opportunity heat" },
];

export default function MapExperience() {
  const [active, setActive] = useState<string | null>("mohali");
  const [layers, setLayers] = useState<string[]>(["deals", "corridors", "heat"]);
  const loc = LOCATIONS.find((l) => l.slug === active);
  const zoneDeals = DEALS.filter((d) => d.city === active);

  const toggleLayer = (id: string) =>
    setLayers((ls) => (ls.includes(id) ? ls.filter((x) => x !== id) : [...ls, id]));

  return (
    <>
      <section className="grid-bg border-b border-line py-12">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">The signature experience</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
              Explore Tricity Through a 3D Real Estate Opportunity Map
            </h1>
            <p className="mt-4 max-w-2xl text-graphite">
              Deal pins, growth corridors, price heat and zone intelligence — the geography behind
              every opportunity, in one view. Click a city to load its live picture.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-10">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <div className="card p-2">
              <TricityMap
                activeCity={active}
                onSelect={setActive}
                showDeals={layers.includes("deals")}
                corridors={layers.includes("corridors")}
                heat={layers.includes("heat")}
                className="aspect-square lg:aspect-[4/3.4]"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {LAYERS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => toggleLayer(l.id)}
                  className={`chip !py-1.5 transition-colors ${layers.includes(l.id) ? "badge-green" : ""}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${layers.includes(l.id) ? "bg-green" : "bg-line"}`} />
                  {l.label}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="space-y-4">
            <Reveal delay={80}>
              <div className="card p-5">
                <p className="eyebrow">Selected zone</p>
                {loc ? (
                  <>
                    <div className="mt-2 flex items-center justify-between">
                      <h2 className="font-display text-2xl font-black">{loc.name}</h2>
                      <span className={`chip ${loc.maturity === "Mature" ? "badge-steel" : loc.maturity === "Growing" ? "badge-gold" : "badge-green"}`}>{loc.maturity}</span>
                    </div>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-graphite">{loc.overview}</p>
                    <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4 text-center">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-graphite">Avg price</p>
                        <p className="font-display text-sm font-black">{loc.avgPerSqYd}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-graphite">Growth</p>
                        <p className="font-display text-sm font-black" style={{ color: "var(--green)" }}>{loc.growthScore}/100</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-graphite">Live deals</p>
                        <p className="font-display text-sm font-black" style={{ color: "var(--gold)" }}>{zoneDeals.length}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-graphite">Best for:</span>
                      {loc.idealBuyer.map((b) => <span key={b} className="chip !text-[11px]">{b}</span>)}
                    </div>
                    <Link href={`/locations/${loc.slug}`} className="btn-primary mt-5 w-full justify-center !py-2.5">
                      Full {loc.name} Guide →
                    </Link>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-graphite">Click a city marker on the map to see its intelligence card.</p>
                )}
              </div>
            </Reveal>

            {zoneDeals.slice(0, 2).map((d, i) => (
              <Reveal key={d.slug} delay={140 + i * 80}>
                <DealCard deal={d} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper py-14">
        <div className="container-x grid items-center gap-8 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-2xl font-black sm:text-3xl">Understand the Geography Behind the Opportunity</h2>
            <p className="mt-4 leading-relaxed text-graphite">
              A deal only makes sense when viewed in the context of connectivity, local demand,
              future infrastructure, and surrounding supply. The Tricity Map helps you understand
              how opportunities sit within the broader market — where growth is flowing from
              Chandigarh&apos;s core into the Mohali, New Chandigarh, Zirakpur and Kharar belts.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["7 zones", "mapped with live intelligence"],
                ["6 corridors", "animated growth flows"],
                [`${DEALS.length} deals`, "pinned in real position"],
                ["4 layers", "toggle what matters to you"],
              ].map(([a, b]) => (
                <div key={a} className="card p-4 text-center">
                  <p className="font-display text-xl font-black" style={{ color: "var(--green)" }}>{a}</p>
                  <p className="text-xs text-graphite">{b}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
