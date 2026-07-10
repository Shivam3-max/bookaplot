import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import LeadForm from "@/components/LeadForm";
import { DEALS } from "@/lib/data";
import DealCard from "@/components/DealCard";

export const metadata: Metadata = {
  title: "NRI Investment — Tricity Real Estate from Abroad",
  description:
    "Curated Tricity real estate for NRIs: structured deal presentation, remote consultation, documentation guidance, and assisted site visits.",
};

const NRI_POINTS = [
  { t: "Why Tricity", d: "Planned infrastructure, institutional presence, an international airport, and a deep NRI community make Tricity one of North India's most NRI-trusted markets." },
  { t: "What NRIs usually look for", d: "Clear-title plotted assets in planned zones, premium residential for family use, and commercial frontage for passive yield — all three run through our curation desk." },
  { t: "Process support", d: "Video walkthroughs, structured deal notes, benchmark data, and a single point of contact — so distance stops being the deciding factor." },
  { t: "Documentation guidance", d: "PoA structuring, NRE/NRO payment routing, TDS notes, and registry coordination — guidance at every step, with independent legal verification encouraged." },
];

export default function NriPage() {
  const picks = DEALS.filter((d) => d.badges.includes("NRI Friendly")).slice(0, 3);
  return (
    <>
      <section className="grid-bg border-b border-line py-16">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <p className="eyebrow">For global buyers</p>
            <h1 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
              Explore Tricity Real Estate with More Confidence, Even from Abroad
            </h1>
            <p className="mt-5 max-w-xl leading-relaxed text-graphite">
              For NRIs, distance often makes property buying harder than it should be. BookAPlot
              simplifies early discovery with curated opportunities, cleaner comparison, structured
              deal presentation, and consultation support across time zones.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/deals" className="btn-primary">Browse NRI-Friendly Deals</Link>
              <a href="#consult" className="btn-gold">Book a Remote Consultation</a>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Video site walkthroughs", "PoA & documentation guidance", "NRE/NRO payment routing", "Single point of contact"].map((c) => (
                <span key={c} className="chip">{c}</span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="card p-6" id="consult">
              <h2 className="font-display text-lg font-black">Remote Consultation</h2>
              <p className="mt-1 text-xs text-graphite">Tell us your time zone — we&apos;ll schedule around it.</p>
              <div className="mt-4">
                <LeadForm
                  compact
                  fields={[
                    { name: "name", label: "Name", required: true },
                    { name: "email", label: "Email", type: "email", required: true },
                    { name: "country", label: "Country of residence", required: true, placeholder: "e.g. Canada" },
                    { name: "interest", label: "Interest", type: "select", options: ["Residential plot", "Premium residential", "Commercial / yield asset", "Not sure yet"], required: true },
                  ]}
                  cta="Request Consultation"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-16">
        <SectionHead eyebrow="Built for distance" title="How BookAPlot Works for NRIs" />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {NRI_POINTS.map((p, i) => (
            <Reveal key={p.t} delay={i * 80}>
              <div className="card card-hover h-full p-6">
                <span className="font-display text-2xl font-black" style={{ color: "var(--gold)", opacity: 0.6 }}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-display text-lg font-bold">{p.t}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-graphite">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {picks.length > 0 && (
        <section className="border-t border-line bg-paper py-14">
          <div className="container-x">
            <SectionHead eyebrow="Curated for you" title="NRI-Friendly Opportunities" />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {picks.map((d, i) => (
                <Reveal key={d.slug} delay={i * 80}><DealCard deal={d} /></Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
