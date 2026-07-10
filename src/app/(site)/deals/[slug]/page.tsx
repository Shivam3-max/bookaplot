import { notFound } from "next/navigation";
import Link from "next/link";
import { DEALS, getDeal, LOCATIONS } from "@/lib/data";
import { inr, inrFull, pctBelow } from "@/lib/format";
import DealVisual from "@/components/DealVisual";
import ScoreRing from "@/components/ScoreRing";
import Reveal from "@/components/Reveal";
import DealCard from "@/components/DealCard";
import LeadForm from "@/components/LeadForm";
import DealActions from "./DealActions";
import Faq from "./Faq";

export function generateStaticParams() {
  return DEALS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const deal = getDeal((await params).slug);
  if (!deal) return {};
  return {
    title: `${deal.title} — ${deal.cityLabel}`,
    description: deal.overview.slice(0, 155),
  };
}

export default async function DealDetail({ params }: { params: Promise<{ slug: string }> }) {
  const deal = getDeal((await params).slug);
  if (!deal) notFound();
  const below = pctBelow(deal.pricePerUnit, deal.benchmarkPerUnit);
  const location = LOCATIONS.find((l) => l.slug === deal.city);
  const related = DEALS.filter((d) => d.slug !== deal.slug && (d.city === deal.city || d.type === deal.type)).slice(0, 4);

  return (
    <>
      {/* above the fold */}
      <section className="grid-bg border-b border-line py-10">
        <div className="container-x">
          <Reveal>
            <nav className="text-xs font-semibold text-graphite">
              <Link href="/deals" className="hover:text-ink">Deals</Link> <span className="mx-1">/</span>
              <Link href={`/locations/${deal.city}`} className="hover:text-ink">{deal.cityLabel}</Link> <span className="mx-1">/</span>
              <span className="text-ink">{deal.title}</span>
            </nav>
          </Reveal>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <div className="card overflow-hidden">
                <DealVisual deal={deal} className="aspect-[16/9]" />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="card overflow-hidden opacity-80" style={{ filter: `hue-rotate(${i * 14}deg)` }}>
                    <DealVisual deal={deal} className="aspect-[4/3]" />
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="flex flex-wrap gap-2">
                {deal.badges.map((b) => (
                  <span key={b} className={`chip ${["Undervalued", "Investor Pick", "Early Entry"].includes(b) ? "badge-green" : ["Hot Zone", "Pre-Launch", "Limited Inventory"].includes(b) ? "badge-gold" : "badge-steel"}`}>{b}</span>
                ))}
              </div>
              <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">{deal.title}</h1>
              <p className="mt-1.5 text-graphite">{deal.subtitle}</p>
              <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-slate">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2"><path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
                {deal.microLocation}
              </p>

              <div className="card mt-5 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-graphite">Starting price</p>
                    <p className="font-display text-3xl font-black">{inr(deal.price)}</p>
                    {deal.priceMax && <p className="text-xs text-graphite">up to {inr(deal.priceMax)}</p>}
                  </div>
                  <div className="text-center">
                    <ScoreRing score={deal.score} size={56} />
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-graphite">Deal score</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
                  <div><p className="text-[10px] font-bold uppercase tracking-wider text-graphite">Rate</p><p className="font-bold">{inrFull(deal.pricePerUnit)}/{deal.unit}</p></div>
                  <div><p className="text-[10px] font-bold uppercase tracking-wider text-graphite">Benchmark</p><p className="font-bold">{inrFull(deal.benchmarkPerUnit)}/{deal.unit}</p></div>
                  <div><p className="text-[10px] font-bold uppercase tracking-wider text-graphite">Sizes</p><p className="font-bold">{deal.areaLabel}</p></div>
                  <div><p className="text-[10px] font-bold uppercase tracking-wider text-graphite">Status</p><p className="font-bold">{deal.status}</p></div>
                </div>
                {below > 0 && (
                  <p className="mt-4 rounded-xl bg-green-soft px-3 py-2 text-sm font-bold text-green">
                    ▼ {below}% below micro-market benchmark — {deal.upsideNote}
                  </p>
                )}
              </div>

              <DealActions deal={deal} />
            </Reveal>
          </div>
        </div>
      </section>

      <div className="container-x grid gap-10 py-12 lg:grid-cols-[1fr_360px]">
        <div className="space-y-12">
          {/* overview */}
          <Reveal>
            <h2 className="font-display text-2xl font-black">Overview</h2>
            <p className="mt-3 leading-relaxed text-slate">{deal.overview}</p>
          </Reveal>

          {/* why stands out */}
          <Reveal>
            <h2 className="font-display text-2xl font-black">Why This Deal Stands Out</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {deal.whyStandsOut.map((w, i) => (
                <div key={w} className="card flex items-start gap-3 p-4">
                  <span className="font-display text-lg font-black" style={{ color: "var(--gold)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-[13.5px] font-medium leading-snug">{w}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* price snapshot */}
          <Reveal>
            <h2 className="font-display text-2xl font-black">Price Snapshot</h2>
            <div className="card mt-4 overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ["Current asking", `${inr(deal.price)}${deal.priceMax ? ` – ${inr(deal.priceMax)}` : ""}`],
                    [`Rate per ${deal.unit}`, inrFull(deal.pricePerUnit)],
                    ["Indicative micro-market benchmark", `${inrFull(deal.benchmarkPerUnit)}/${deal.unit}`],
                    ["Position vs benchmark", below > 0 ? `${below}% below` : "At market"],
                    ...(deal.bookingAmount ? [["Booking amount", inr(deal.bookingAmount)]] : []),
                  ].map(([k, v]) => (
                    <tr key={k as string} className="border-b border-line last:border-0">
                      <td className="px-5 py-3 font-semibold text-graphite">{k}</td>
                      <td className="px-5 py-3 text-right font-bold">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* property details */}
          <Reveal>
            <h2 className="font-display text-2xl font-black">Property Details</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Type", deal.type],
                ["Sizes", deal.sizes.join(" · ")],
                ["Facing", deal.facing || "Multiple"],
                ["Road width", deal.roadWidth || "—"],
                ["Possession", deal.possession],
                ["Approval", deal.approval],
              ].map(([k, v]) => (
                <div key={k} className="card p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-graphite">{k}</p>
                  <p className="mt-1 text-sm font-bold leading-snug">{v}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* location advantages */}
          <Reveal>
            <h2 className="font-display text-2xl font-black">Location Advantages</h2>
            <div className="card mt-4 divide-y divide-line">
              {deal.locationAdvantages.map((a) => (
                <div key={a.label} className="flex items-center justify-between px-5 py-3">
                  <span className="flex items-center gap-2.5 text-sm font-semibold text-slate">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    {a.label}
                  </span>
                  <span className="text-sm font-bold">{a.value}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* investment angle */}
          <Reveal>
            <h2 className="font-display text-2xl font-black">Appreciation &amp; Investment Angle</h2>
            <p className="mt-2 text-sm text-graphite">Demand drivers we&apos;re watching — not guarantees, just the structural case:</p>
            <div className="mt-4 space-y-2.5">
              {deal.demandDrivers.map((d) => (
                <div key={d} className="flex items-start gap-2.5 rounded-xl bg-paper px-4 py-3">
                  <svg className="mt-0.5 shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5"><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></svg>
                  <p className="text-sm font-medium">{d}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* who suits */}
          <Reveal>
            <h2 className="font-display text-2xl font-black">Who This Deal May Suit</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {deal.suitsWho.map((s) => (
                <span key={s} className="chip badge-gold !px-4 !py-2 !text-[13px]">{s}</span>
              ))}
            </div>
          </Reveal>

          {/* faqs */}
          <Reveal>
            <h2 className="font-display text-2xl font-black">Frequently Asked Questions</h2>
            <Faq faqs={deal.faqs} />
          </Reveal>
        </div>

        {/* sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5">
            <h3 className="font-display text-lg font-black">Interested in this opportunity?</h3>
            <p className="mt-1 text-xs text-graphite">Book a site visit, request the price sheet, or talk to an advisor.</p>
            <div className="mt-4">
              <LeadForm
                compact
                fields={[
                  { name: "name", label: "Name", required: true, placeholder: "Your name" },
                  { name: "phone", label: "Phone", type: "tel", required: true, placeholder: "+91" },
                  { name: "intent", label: "I want to", type: "select", options: ["Book a site visit", "Request price sheet", "Talk to advisor", "Download brochure"], required: true },
                ]}
                cta="Send Request"
              />
            </div>
          </div>
          {location && (
            <Link href={`/locations/${location.slug}`} className="card card-hover block p-5">
              <p className="eyebrow">Zone context</p>
              <h3 className="mt-2 font-display text-lg font-black">{location.name}</h3>
              <p className="mt-1 text-[13px] text-graphite">{location.overview.slice(0, 110)}…</p>
              <p className="mt-3 text-xs font-bold" style={{ color: "var(--gold)" }}>Explore {location.name} →</p>
            </Link>
          )}
          <div className="card p-5">
            <p className="eyebrow">Documents</p>
            <div className="mt-3 space-y-2">
              {["Brochure (PDF)", "Layout / Site Plan", "Price Sheet"].map((d) => (
                <button key={d} className="flex w-full items-center justify-between rounded-xl border border-line px-4 py-2.5 text-sm font-semibold transition-colors hover:border-gold">
                  {d}
                  <span style={{ color: "var(--gold)" }}>↓</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-graphite">Documents shared after a quick verification call.</p>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-t border-line bg-paper py-14">
          <div className="container-x">
            <Reveal><h2 className="font-display text-2xl font-black">Similar Opportunities</h2></Reveal>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((d, i) => (
                <Reveal key={d.slug} delay={i * 70}><DealCard deal={d} /></Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
