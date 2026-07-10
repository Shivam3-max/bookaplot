import { notFound } from "next/navigation";
import Link from "next/link";
import { LOCATIONS, getLocation, dealsByCity } from "@/lib/data";
import Reveal from "@/components/Reveal";
import DealCard from "@/components/DealCard";
import Sparkline from "@/components/Sparkline";
import TricityMap from "@/components/TricityMap";

export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const loc = getLocation((await params).slug as never);
  if (!loc) return {};
  return {
    title: `${loc.name} Real Estate — Plots & Property Deals`,
    description: loc.overview.slice(0, 155),
  };
}

export default async function LocationDetail({ params }: { params: Promise<{ slug: string }> }) {
  const loc = getLocation((await params).slug as never);
  if (!loc) notFound();
  const deals = dealsByCity(loc.slug);

  return (
    <>
      <section className="border-b border-line py-14" style={{ background: `linear-gradient(135deg, hsl(${loc.hue} 30% 96%), white 60%)` }}>
        <div className="container-x grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <nav className="text-xs font-semibold text-graphite">
              <Link href="/locations" className="hover:text-ink">Locations</Link> <span className="mx-1">/</span>
              <span className="text-ink">{loc.name}</span>
            </nav>
            <div className="mt-4 flex items-center gap-3">
              <h1 className="text-3xl font-black leading-tight sm:text-5xl">{loc.name}</h1>
              <span className={`chip ${loc.maturity === "Mature" ? "badge-steel" : loc.maturity === "Growing" ? "badge-gold" : "badge-green"}`}>{loc.maturity} market</span>
            </div>
            <p className="mt-2 font-display text-lg font-bold" style={{ color: "var(--gold)" }}>{loc.tagline}</p>
            <p className="mt-4 max-w-xl leading-relaxed text-graphite">{loc.overview}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/deals?city=${loc.slug}`} className="btn-primary">View {loc.name} Deals</Link>
              <Link href="/book-visit" className="btn-ghost">Book a Site Visit</Link>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="card p-2">
              <TricityMap activeCity={loc.slug} showDeals className="aspect-square" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* market snapshot */}
      <section className="container-x py-12">
        <Reveal><h2 className="font-display text-2xl font-black">Market Snapshot</h2></Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal delay={60}>
            <div className="card h-full p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-graphite">Price band</p>
              <p className="mt-1 font-display text-xl font-black">{loc.priceBand}</p>
              <p className="text-xs text-graphite">Avg {loc.avgPerSqYd}/sq yd</p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="card h-full p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-graphite">Growth score</p>
              <p className="mt-1 font-display text-xl font-black" style={{ color: "var(--green)" }}>{loc.growthScore}/100</p>
              <p className="text-xs text-graphite">{loc.maturity} stage</p>
            </div>
          </Reveal>
          <Reveal delay={180} className="sm:col-span-2">
            <div className="card h-full p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-graphite">Indexed price trend (6 yrs)</p>
              <Sparkline data={loc.trend} className="mt-2 h-16 w-full" />
              <p className="text-xs font-bold text-green">
                +{loc.trend[loc.trend.length - 1] - 100}% indexed appreciation since base year
              </p>
            </div>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <Reveal>
            <h3 className="font-display text-xl font-black">Why People Buy Here</h3>
            <div className="mt-4 space-y-2.5">
              {loc.whyBuy.map((w) => (
                <div key={w} className="flex items-start gap-2.5 rounded-xl bg-paper px-4 py-3">
                  <svg className="mt-0.5 shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  <p className="text-sm font-medium">{w}</p>
                </div>
              ))}
            </div>
            <h3 className="mt-8 font-display text-xl font-black">Ideal Buyer Profile</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {loc.idealBuyer.map((b) => (
                <span key={b} className="chip badge-gold !px-4 !py-2 !text-[13px]">{b}</span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h3 className="font-display text-xl font-black">Connectivity</h3>
            <div className="card mt-4 divide-y divide-line">
              {loc.connectivity.map((c) => (
                <div key={c.label} className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-sm font-semibold text-slate">{c.label}</span>
                  <span className="text-sm font-bold">{c.value}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* featured deals */}
      <section className="border-t border-line bg-paper py-14">
        <div className="container-x">
          <Reveal>
            <h2 className="font-display text-2xl font-black">Live Opportunities in {loc.name}</h2>
          </Reveal>
          {deals.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {deals.map((d, i) => (
                <Reveal key={d.slug} delay={i * 70}><DealCard deal={d} /></Reveal>
              ))}
            </div>
          ) : (
            <div className="card mt-6 p-10 text-center">
              <p className="font-display font-bold">New {loc.name} inventory is under review.</p>
              <p className="mt-1 text-sm text-graphite">Join the early-access list and get notified first.</p>
              <Link href="/contact" className="btn-gold mt-5">Get Priority Access</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
