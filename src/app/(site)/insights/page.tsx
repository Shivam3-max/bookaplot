import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/lib/data";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Insights — Tricity Market Updates & Guides",
  description: "Market updates, area guides, plotted investment insights and buying-process content for Tricity real estate.",
};

export default function InsightsPage() {
  const [lead, ...rest] = POSTS;
  return (
    <>
      <section className="grid-bg border-b border-line py-14">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">Insights</p>
            <h1 className="mt-3 max-w-2xl text-3xl font-black leading-tight sm:text-5xl">
              Tricity Market Intelligence, Written Plainly
            </h1>
            <p className="mt-4 max-w-xl text-graphite">
              Market updates, area guides, comparisons, and buying-process content — the thinking
              behind the platform, published.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-12">
        <Reveal>
          <Link href={`/insights/${lead.slug}`} className="card card-hover group grid overflow-hidden lg:grid-cols-2">
            <div className="flex min-h-48 items-center justify-center bg-slate p-8">
              <p className="font-display text-2xl font-black leading-snug text-white group-hover:underline sm:text-3xl">
                {lead.title}
              </p>
            </div>
            <div className="p-7">
              <span className="chip badge-gold">{lead.category}</span>
              <p className="mt-4 leading-relaxed text-graphite">{lead.excerpt}</p>
              <p className="mt-5 text-xs font-bold text-graphite">
                {new Date(lead.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · {lead.readMins} min read
              </p>
              <p className="mt-4 text-sm font-bold" style={{ color: "var(--gold)" }}>Read the analysis →</p>
            </div>
          </Link>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <Link href={`/insights/${p.slug}`} className="card card-hover group flex h-full flex-col p-6">
                <span className="chip badge-steel self-start">{p.category}</span>
                <h2 className="mt-3 font-display text-lg font-bold leading-snug group-hover:underline">{p.title}</h2>
                <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-graphite">{p.excerpt}</p>
                <p className="mt-4 border-t border-line pt-3 text-xs font-bold text-graphite">
                  {new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {p.readMins} min read
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
