import Link from "next/link";
import { DEALS, LOCATIONS, STATS, TESTIMONIALS } from "@/lib/data";
import DealCard from "@/components/DealCard";
import TricityMap from "@/components/TricityMap";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";
import CountUp from "@/components/CountUp";
import { CP_BENEFITS, INVESTOR_BENEFITS } from "@/lib/network-data";

const WHY_BLOCKS = [
  { t: "Curated Deal Discovery", d: "We shortlist opportunities with actual upside logic behind them — not everything that's merely available." },
  { t: "Tricity-Only Focus", d: "We go deep into one market instead of spreading thin across India. Local depth beats national breadth." },
  { t: "Premium Experience", d: "A cleaner, faster, smarter way to browse opportunities. No clutter, no noise, no spam calls." },
  { t: "Assisted Buying Journey", d: "From discovery to site visit to negotiation — the journey is built to actually move forward." },
];

const STEPS = [
  { t: "Explore Curated Opportunities", d: "Browse deals by location, budget, asset type, and investment intent." },
  { t: "Understand Why It's Interesting", d: "Every listing includes structured details, location cues, and the reason it may be worth evaluating." },
  { t: "Compare, Save & Shortlist", d: "Use compare tools, calculators, and saved lists to evaluate options side by side." },
  { t: "Book a Site Visit or Consultation", d: "Talk to the team, schedule a visit, and move forward with clarity." },
];

const DEAL_REASONS = [
  "Price below nearby comparable inventory",
  "Strong location-to-price ratio",
  "Growth corridor exposure",
  "Upcoming infra or connectivity push",
  "End-use + investment suitability",
  "Limited supply in a strategic belt",
  "Commercial frontage / visibility advantage",
  "Early-entry potential in townships",
];

const CALCS = [
  { href: "/calculators#emi", t: "EMI / Loan Calculator", d: "Monthly EMI, total interest, repayment." },
  { href: "/calculators#stamp", t: "Stamp Duty Estimator", d: "True acquisition cost beyond price." },
  { href: "/calculators#roi", t: "ROI / Appreciation", d: "Value growth over your holding period." },
  { href: "/calculators#yield", t: "Rental Yield", d: "Gross and net yield on built assets." },
  { href: "/calculators#buyrent", t: "Buy vs Rent", d: "The honest ownership comparison." },
  { href: "/calculators#plot", t: "Total Plot Investment", d: "All-in cost, development, and exit value." },
];

export default function Home() {
  const featured = DEALS.filter((d) => d.featured);

  return (
    <>
      {/* 1 — HERO */}
      <section className="grid-bg relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-gold-soft blur-3xl" />
        <div className="pointer-events-none absolute -left-40 top-64 h-[380px] w-[380px] rounded-full bg-green-soft blur-3xl" />
        <div className="container-x relative grid items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <Reveal>
              <span className="chip badge-gold">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-gold" />
                A private network — not another listing portal
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-5 text-4xl font-black leading-[1.05] sm:text-5xl lg:text-[3.3rem]">
                Tricity&apos;s CP &amp; Investor-First{" "}
                <span className="relative inline-block">
                  <span style={{ color: "var(--green)" }}>Deal Network</span>
                  <svg className="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 120 8" preserveAspectRatio="none">
                    <path d="M2 6 Q60 0 118 5" stroke="var(--gold)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-graphite">
                Exclusive verified mandates, territory rights, routed leads and customized creatives
                for channel partners. Verified pricing, the Give &amp; Ask desk and desperate-deal
                access for investors. The public sees glimpses — the network sees everything.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/join?as=cp" className="btn-gold">Join as Channel Partner</Link>
                <Link href="/join?as=investor" className="btn-primary">Join as Investor</Link>
                <Link href="/deals" className="btn-ghost">See Deal Glimpses</Link>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <div className="card mt-8 grid max-w-xl grid-cols-3 divide-x divide-line">
                {[
                  ["Sellers", "List a property", "/join?as=seller"],
                  ["Channel Partners", "Lock a territory", "/join?as=cp"],
                  ["Investors", "Post a requirement", "/join?as=investor"],
                ].map(([t, d, href]) => (
                  <Link key={t} href={href} className="group p-3.5 text-center transition-colors hover:bg-paper">
                    <p className="font-display text-[13px] font-black group-hover:underline">{t}</p>
                    <p className="text-[11px] text-graphite">{d}</p>
                  </Link>
                ))}
              </div>
            </Reveal>
            <Reveal delay={400}>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Exclusive Mandates", "Territory Rights", "Territory Leads", "Custom Creatives", "Give & Ask Desk"].map((c) => (
                  <span key={c} className="chip">{c}</span>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <div className="float-y card overflow-hidden p-1.5 sm:p-2">
              <TricityMap className="aspect-square" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2 — LIVE NUMBERS */}
      <section className="border-y border-line bg-paper py-14">
        <div className="container-x">
          <SectionHead eyebrow="Signal, not noise" title="Real Opportunities, Not Random Listings" />
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 70}>
                <div className="card h-full p-4 text-center">
                  <p className="font-display text-2xl font-black" style={{ color: "var(--green)" }}>
                    <CountUp value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-1 text-[11.5px] font-semibold leading-snug text-graphite">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-graphite">
              From plotted developments to high-potential growth pockets, BookAPlot helps serious
              buyers navigate Tricity&apos;s most promising opportunities with more clarity and less noise.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2b — NETWORK BENEFITS */}
      <section className="py-16">
        <div className="container-x">
          <SectionHead
            eyebrow="Why the network"
            title="Built CP-First. Built Investor-First."
            sub="We don't sell to the public first — we power the people who move deals. That's the whole model."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="card h-full overflow-hidden">
                <div className="bg-ink px-6 py-4">
                  <p className="font-display font-black text-white">For Channel Partners</p>
                  <p className="text-xs text-white/60">One CP per territory. Your zone, your mandates, your leads.</p>
                </div>
                <div className="grid gap-0 divide-y divide-line">
                  {CP_BENEFITS.map((b, i) => (
                    <div key={b.t} className="flex items-start gap-3.5 p-5">
                      <span className="font-display text-lg font-black" style={{ color: "var(--gold)" }}>{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <p className="font-display text-[14.5px] font-bold">{b.t}</p>
                        <p className="mt-0.5 text-[13px] leading-relaxed text-graphite">{b.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-5 pt-0">
                  <Link href="/join?as=cp" className="btn-gold w-full justify-center">Become a Channel Partner</Link>
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="card h-full overflow-hidden">
                <div className="px-6 py-4" style={{ background: "var(--green)" }}>
                  <p className="font-display font-black text-white">For Investors</p>
                  <p className="text-xs text-white/70">Stop hunting. Post what you want — the platform reverts.</p>
                </div>
                <div className="grid gap-0 divide-y divide-line">
                  {INVESTOR_BENEFITS.map((b, i) => (
                    <div key={b.t} className="flex items-start gap-3.5 p-5">
                      <span className="font-display text-lg font-black" style={{ color: "var(--green)" }}>{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <p className="font-display text-[14.5px] font-bold">{b.t}</p>
                        <p className="mt-0.5 text-[13px] leading-relaxed text-graphite">{b.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-5 pt-0">
                  <Link href="/join?as=investor" className="btn-primary w-full justify-center">Join as Investor</Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2c — GIVE & ASK HIGHLIGHT */}
      <section className="border-y border-line bg-ink py-16 text-white">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <Reveal>
            <span className="chip badge-gold">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-gold" />
              Signature feature — only on BookAPlot
            </span>
            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
              Give &amp; Ask: You State the Requirement. <span style={{ color: "var(--gold)" }}>We Revert with the Deal.</span>
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-white/70">
              Every portal makes investors hunt through listings. We flipped it. Post your exact
              requirement — budget, asset type, location, urgency — and the platform matches it
              against live mandates and off-market inventory, then reverts to you directly.
            </p>
            <p className="mt-3 max-w-xl text-sm font-bold" style={{ color: "var(--gold)" }}>
              Cash-ready for a desperate deal? Flag it &ldquo;urgent&rdquo; and the distress-desk
              routes seller-urgency pricing to you first.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/join?as=investor" className="btn-gold">Post Your Requirement</Link>
              <Link href="/why-bookaplot" className="btn border border-white/30 text-white hover:border-white">How Matching Works</Link>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="space-y-3">
              {[
                { n: "1", t: "You give the ask", d: "“₹1.5–2 Cr, tenanted commercial frontage, Zirakpur, ready in 30 days.”" },
                { n: "2", t: "Platform matches", d: "The desk screens live mandates, off-market stock and CP territories for fits." },
                { n: "3", t: "We revert to you", d: "Matched sheets, videos and visit slots land in your dashboard — usually within 24 hours." },
              ].map((s) => (
                <div key={s.n} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display font-black" style={{ background: "var(--gold)", color: "#fff" }}>{s.n}</span>
                  <div>
                    <p className="font-display font-bold">{s.t}</p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-white/65">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3 — FEATURED DEALS */}
      <section className="py-16">
        <div className="container-x">
          <SectionHead
            eyebrow="Glimpses only — full detail inside"
            title="This Week's Network Mandates"
            sub="The public sees the glimpse: zone, asset type and the size of the price gap. Members see pricing, papers, commission and kits."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((d, i) => (
              <Reveal key={d.slug} delay={i * 90}>
                <DealCard deal={d} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={200} className="mt-8 text-center">
            <Link href="/deals" className="btn-ghost">Browse the Full Marketplace →</Link>
          </Reveal>
        </div>
      </section>

      {/* 4 — WHY BOOKAPLOT EXISTS */}
      <section className="border-y border-line bg-slate py-16 text-white">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Why we exist</p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
              Built for Buyers Who Want Better Deals, Not More Noise
            </h2>
            <p className="mt-5 leading-relaxed text-white/70">
              Most property websites show everything. BookAPlot is built to show what&apos;s worth
              attention. We focus on opportunities that may be attractive because of:
            </p>
            <ul className="mt-5 space-y-2.5">
              {[
                "Price gaps versus nearby comparable inventory",
                "Infrastructure-led future demand",
                "Early-stage township or plotted growth",
                "Location inefficiencies in emerging pockets",
                "Distress, urgency, or unsold-inventory situations",
                "Strategic commercial visibility advantages",
              ].map((x) => (
                <li key={x} className="flex items-start gap-2.5 text-sm text-white/85">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--gold)" }} />
                  {x}
                </li>
              ))}
            </ul>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {WHY_BLOCKS.map((b, i) => (
              <Reveal key={b.t} delay={i * 90}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-colors hover:border-[var(--gold)]/40">
                  <span className="font-display text-2xl font-black" style={{ color: "var(--gold)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-display font-bold">{b.t}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-white/65">{b.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — HOW IT WORKS */}
      <section className="py-16">
        <div className="container-x">
          <SectionHead eyebrow="The journey" title="How BookAPlot Works" />
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.t} delay={i * 100}>
                <div className="relative h-full">
                  {i < 3 && (
                    <svg className="absolute -right-4 top-8 hidden w-8 md:block" height="12" viewBox="0 0 32 12">
                      <path d="M0 6 H26 M22 1 L28 6 L22 11" stroke="var(--gold)" strokeWidth="1.5" fill="none" />
                    </svg>
                  )}
                  <div className="card card-hover h-full p-5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-soft font-display font-black" style={{ color: "var(--gold)" }}>
                      {i + 1}
                    </span>
                    <h3 className="mt-3 font-display text-[15px] font-bold leading-snug">{s.t}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-graphite">{s.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6 — MAP PREVIEW */}
      <section className="border-y border-line bg-paper py-16">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="eyebrow">The signature view</p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
              Explore Tricity Through a Smarter Real Estate Lens
            </h2>
            <p className="mt-4 leading-relaxed text-graphite">
              Visualise growth pockets, high-demand corridors, infrastructure influence, and live
              opportunities across the whole region — with undervalued-opportunity density, price
              bands, and inventory mix by location.
            </p>
            <ul className="mt-5 space-y-2">
              {["Live deal pins across 7 zones", "Animated growth-corridor overlays", "Heat rings for opportunity density", "Zone-level price bands & growth scores"].map((x) => (
                <li key={x} className="flex items-center gap-2.5 text-sm font-medium text-slate">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  {x}
                </li>
              ))}
            </ul>
            <Link href="/map" className="btn-primary mt-7">Open Full Tricity Map</Link>
          </Reveal>
          <Reveal delay={150}>
            <div className="card overflow-hidden p-2">
              <TricityMap className="aspect-[4/3]" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7 — WHAT MAKES A DEAL */}
      <section className="py-16">
        <div className="container-x">
          <SectionHead
            eyebrow="Our filter"
            title="What Makes a Deal Worth Looking At?"
            sub="Every opportunity on the platform has to clear at least one of these hurdles — most clear several."
          />
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {DEAL_REASONS.map((r, i) => (
              <Reveal key={r} delay={i * 60}>
                <div className="card card-hover flex h-full items-start gap-3 p-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-soft">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                  </span>
                  <p className="text-[13.5px] font-semibold leading-snug">{r}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 8 — CALCULATORS PREVIEW */}
      <section className="border-y border-line bg-paper py-16">
        <div className="container-x">
          <SectionHead
            eyebrow="Decision tools"
            title="Real Estate Calculators for Smarter Decisions"
            sub="A good deal is not just about price — it's about cash flow, affordability, appreciation potential, holding cost, and exit logic."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CALCS.map((c, i) => (
              <Reveal key={c.t} delay={i * 70}>
                <Link href={c.href} className="card card-hover group flex h-full items-center gap-4 p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-soft font-display text-lg font-black transition-colors group-hover:bg-gold group-hover:text-white" style={{ color: "var(--gold)" }}>
                    ₹
                  </span>
                  <div>
                    <h3 className="font-display text-[15px] font-bold">{c.t}</h3>
                    <p className="text-[12.5px] text-graphite">{c.d}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200} className="mt-8 text-center">
            <Link href="/calculators" className="btn-primary">Open Calculators Hub</Link>
          </Reveal>
        </div>
      </section>

      {/* 9 — WHY TRICITY */}
      <section className="py-16">
        <div className="container-x">
          <SectionHead
            eyebrow="The market story"
            title="Why Tricity Continues to Attract Smart Buyers"
            sub="Planned urban infrastructure, expanding residential demand, institutional presence, strong connectivity, and new development corridors keep reshaping this market."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LOCATIONS.slice(0, 6).map((l, i) => (
              <Reveal key={l.slug} delay={i * 70}>
                <Link href={`/locations/${l.slug}`} className="card card-hover block h-full overflow-hidden">
                  <div className="h-1.5" style={{ background: `linear-gradient(90deg, hsl(${l.hue} 40% 55%), var(--gold))` }} />
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-bold">{l.name}</h3>
                      <span className={`chip ${l.maturity === "Mature" ? "badge-steel" : l.maturity === "Growing" ? "badge-gold" : "badge-green"}`}>
                        {l.maturity}
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] text-graphite">{l.tagline}</p>
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-graphite">Price band</p>
                        <p className="text-sm font-bold">{l.priceBand}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-graphite">Growth score</p>
                        <p className="font-display text-lg font-black" style={{ color: "var(--green)" }}>{l.growthScore}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 10 — TESTIMONIALS */}
      <section className="border-y border-line bg-paper py-16">
        <div className="container-x">
          <SectionHead eyebrow="Trust" title="For Buyers Who Prefer Clarity Before Commitment" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <figure className="card card-hover flex h-full flex-col p-6">
                  <svg width="26" height="20" viewBox="0 0 26 20" fill="var(--gold)" opacity="0.5">
                    <path d="M0 20V12C0 5 4 1 11 0v4c-3 1-5 3-5 6h5v10H0Zm15 0V12c0-7 4-11 11-12v4c-3 1-5 3-5 6h5v10H15Z" />
                  </svg>
                  <blockquote className="mt-4 flex-1 text-[14.5px] leading-relaxed text-slate">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-5 border-t border-line pt-4">
                    <p className="font-display text-sm font-bold">{t.name}</p>
                    <p className="text-xs text-graphite">{t.context}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 11 — CTA BAND */}
      <section className="py-16">
        <div className="container-x">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center text-white sm:px-12">
              <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gold opacity-20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-green opacity-25 blur-3xl" />
              <p className="eyebrow">Ready when you are</p>
              <h2 className="mx-auto mt-3 max-w-xl text-3xl font-black sm:text-4xl">
                The Network Is the Product
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-white/70">
                Channel partners lock territories. Investors post requirements. Sellers submit
                inventory. The platform connects all three — and everyone moves faster.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/join?as=cp" className="btn-gold">Join as Channel Partner</Link>
                <Link href="/join?as=investor" className="btn !bg-white !text-ink hover:!bg-paper">Join as Investor</Link>
                <Link href="/join?as=seller" className="btn border border-white/30 text-white hover:border-white">List a Property</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
