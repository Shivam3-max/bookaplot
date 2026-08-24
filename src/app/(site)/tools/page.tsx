import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Free Real Estate Tools — Agreements, Flyers, Carpet Area & More",
  description:
    "Free tools for buyers, sellers and channel partners: agreement drafting, property flyer maker, carpet area checker, area converter, document checklist and more. No sign-up.",
};

const TOOLS = [
  { href: "/tools/agreements", icon: "✎", name: "Agreement Drafting Assistant", blurb: "Draft a Rent Agreement, Agreement to Sell or Brokerage / Channel Partner Agreement in minutes.", tag: "Most used" },
  { href: "/tools/flyer", icon: "▣", name: "Property Flyer Maker", blurb: "Turn any property photo into a branded WhatsApp or Instagram flyer with your name and number.", tag: "New" },
  { href: "/tools/carpet-area", icon: "▦", name: "Carpet Area Checker", blurb: "See the real carpet area behind a super built-up quote — and what your rate works out to per usable sq ft." },
  { href: "/tools/area-converter", icon: "⇄", name: "Area Unit Converter", blurb: "Square feet, gaj, marla, kanal, acre, hectare, guntha, cent and ground — converted at once." },
  { href: "/tools/document-checklist", icon: "☑", name: "Document Checklist", blurb: "Every paper to verify before you buy, sell or rent — and why each one matters." },
  { href: "/tools/quiz", icon: "◔", name: "Real Estate IQ Quiz", blurb: "Ten questions on RERA, title documents and area terminology. Every answer explained." },
  { href: "/tools/red-flags", icon: "⚑", name: "Spot the Red Flag", blurb: "Six real scenarios — can you spot the warning sign before the money moves?" },
  { href: "/tools/quotes", icon: "❞", name: "Real Estate Quotes", blurb: "Public-domain wisdom on land and wealth, ready to copy or share with a client." },
  { href: "/calculators", icon: "◧", name: "Calculators Hub", blurb: "EMI, stamp duty, ROI, rental yield, buy vs rent and total plot investment — six calculators in one place." },
];

export default function ToolsPage() {
  return (
    <div className="container-x py-12 sm:py-16">
      <div className="max-w-2xl">
        <p className="eyebrow">Free Tools</p>
        <h1 className="mt-2 font-display text-3xl font-black sm:text-5xl">
          Practical tools for property people
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-graphite">
          A working set of tools for buyers, sellers and channel partners — free, no sign-up, and
          everything runs in your browser. Nothing you type or upload is stored on our servers.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t, i) => (
          <Reveal key={t.href} delay={i * 60}>
            <Link href={t.href} className="card card-hover relative block h-full p-6">
              {t.tag && (
                <span className="chip badge-gold absolute right-4 top-4 !px-2.5 !py-0.5 !text-[9px]">{t.tag}</span>
              )}
              <span className="font-display text-2xl" style={{ color: "var(--gold)" }}>{t.icon}</span>
              <h2 className="mt-3 font-display text-lg font-black leading-snug">{t.name}</h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-graphite">{t.blurb}</p>
              <p className="mt-4 text-xs font-bold" style={{ color: "var(--gold)" }}>Open tool →</p>
            </Link>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 card p-6 sm:p-8">
        <h2 className="font-display text-xl font-black">Want the deals behind the tools?</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-graphite">
          These tools are free for anyone. The verified mandates, territory rights and the Give &amp; Ask
          desk are for the Mondato network — channel partners and investors working Tricity.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/join" className="btn-gold !py-2.5 !text-sm">Join the network</Link>
          <Link href="/deals" className="btn-ghost !py-2.5 !text-sm">Browse deals</Link>
        </div>
      </div>
    </div>
  );
}
