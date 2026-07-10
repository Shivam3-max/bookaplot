import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About — Built for Smarter Real Estate Discovery in Tricity",
  description: "Why BookAPlot exists: a curated, premium alternative to noisy property portals, built exclusively for Tricity.",
};

const VALUES = [
  ["Clarity over clutter", "Every deal explained, every number benchmarked."],
  ["Quality over quantity", "A short list that means something beats an endless feed."],
  ["Local market depth", "Tricity only. Micro-market by micro-market."],
  ["Premium user experience", "Discovery should feel like a private platform, not a classifieds board."],
  ["Long-term trust", "We'd rather lose a transaction than misstate an opportunity."],
];

export default function AboutPage() {
  return (
    <>
      <section className="grid-bg border-b border-line py-16">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">About BookAPlot</p>
            <h1 className="mt-3 max-w-2xl text-3xl font-black leading-tight sm:text-5xl">
              Built for Smarter Real Estate Discovery in Tricity
            </h1>
          </Reveal>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <Reveal delay={100}>
              <div className="space-y-4 leading-relaxed text-slate">
                <p>
                  BookAPlot was created around a simple belief: in a market filled with noise, buyers
                  deserve a more curated way to discover property opportunities.
                </p>
                <p>
                  Instead of functioning like a generic listing board, BookAPlot focuses on presenting
                  selected opportunities across Tricity that may stand out for their price logic,
                  location value, growth context, or strategic fit.
                </p>
                <p>
                  We aim to make discovery cleaner, evaluation easier, and the journey from browsing
                  to site visit more structured.
                </p>
              </div>
            </Reveal>
            <Reveal delay={180}>
              <div className="space-y-4">
                <div className="card p-6">
                  <p className="eyebrow">Vision</p>
                  <p className="mt-2 font-display text-[15px] font-bold leading-snug">
                    To become Tricity&apos;s most trusted premium discovery platform for smart real estate opportunities.
                  </p>
                </div>
                <div className="card p-6">
                  <p className="eyebrow">Mission</p>
                  <p className="mt-2 font-display text-[15px] font-bold leading-snug">
                    To help buyers identify and evaluate stronger property opportunities through curation, clarity, local market focus, and a premium digital experience.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <Reveal><h2 className="text-center font-display text-3xl font-black">What We Stand For</h2></Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {VALUES.map(([t, d], i) => (
            <Reveal key={t} delay={i * 70}>
              <div className="card card-hover h-full p-5 text-center">
                <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-gold-soft font-display font-black" style={{ color: "var(--gold)" }}>{i + 1}</span>
                <h3 className="mt-3 font-display text-[14.5px] font-bold leading-snug">{t}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-graphite">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <div className="mt-12 text-center">
            <Link href="/why-bookaplot" className="btn-primary">See How We Evaluate Deals</Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
