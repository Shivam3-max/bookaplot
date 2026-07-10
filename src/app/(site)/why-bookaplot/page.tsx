import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SectionHead from "@/components/SectionHead";

export const metadata: Metadata = {
  title: "Why BookAPlot — How We Think About Opportunities",
  description:
    "The six-factor research method behind every deal on BookAPlot: pricing gaps, growth corridors, connectivity, maturity, end-use demand, and inventory quality.",
};

const FACTORS = [
  { t: "Micro-market pricing gap", d: "How does the asking compare to nearby supply? We benchmark against recent transactions in the same pocket — not city-wide averages that hide everything useful." },
  { t: "Growth corridor exposure", d: "Is the area sitting near expanding roads, institutional development, or new residential demand? Corridors re-price land; static pockets don't." },
  { t: "Connectivity advantage", d: "How quickly does the asset connect to core city zones, highways, the airport, IT belts, or business districts — today, not on a promised timeline?" },
  { t: "Stage of area maturity", d: "Is it early enough for upside, but developed enough for confidence? We map every zone on a maturity curve before a deal goes live." },
  { t: "End-use demand potential", d: "Would real buyers actually want to live, build, or operate here? Land nobody would build on is not undervalued at any price." },
  { t: "Inventory quality", d: "Does the project, plot, or asset have stronger practical value than surrounding options — approvals, dimensions, road width, developer record?" },
];

export default function WhyPage() {
  return (
    <>
      <section className="grid-bg border-b border-line py-16">
        <div className="container-x text-center">
          <Reveal>
            <p className="eyebrow">Our research method</p>
            <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
              We Don&apos;t Just Show Properties. We Highlight Opportunities Worth Evaluating.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-graphite">
              BookAPlot is built around the idea that some properties deserve more attention than
              others because of how they are priced, positioned, connected, or timed within the
              market.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-16">
        <SectionHead eyebrow="Six lenses" title="What We Look At Before a Deal Goes Live" />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FACTORS.map((f, i) => (
            <Reveal key={f.t} delay={i * 80}>
              <div className="card card-hover h-full p-6">
                <span className="font-display text-3xl font-black" style={{ color: "var(--gold)", opacity: 0.55 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-lg font-bold">{f.t}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-graphite">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-paper py-14">
        <div className="container-x">
          <Reveal>
            <div className="card mx-auto max-w-3xl border-l-4 p-8" style={{ borderLeftColor: "var(--gold)" }}>
              <p className="eyebrow">Important disclaimer</p>
              <p className="mt-3 leading-relaxed text-slate">
                BookAPlot presents curated opportunities and market-oriented insights to help users
                evaluate deals. Real estate decisions should always be based on independent due
                diligence, financial suitability, and document verification before final commitment.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/deals" className="btn-primary">See the Deals This Method Produces</Link>
              <Link href="/contact" className="btn-ghost">Talk to the Research Desk</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
