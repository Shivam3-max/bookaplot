"use client";

import Link from "next/link";
import { useNetwork } from "@/context/NetworkContext";
import { DEALS } from "@/lib/data";
import { MANDATES } from "@/lib/network-data";
import { LEADS } from "@/lib/admin-data";
import { inr } from "@/lib/format";

export default function PortalOverview() {
  const { account, asks } = useNetwork();
  if (!account) return null;
  const isCp = account.role === "cp";
  const mandates = DEALS.filter((d) => MANDATES[d.slug]);
  const urgent = mandates.filter((d) => MANDATES[d.slug].urgent);
  const myAsks = asks.filter((a) => a.investor.startsWith("You"));
  const openAsks = asks.filter((a) => a.status === "Open").length;

  const kpis = isCp
    ? [
        { label: "Live mandates", value: String(mandates.length), href: "/portal/deals", tone: "var(--green)" },
        { label: "Your territory", value: account.territory ? "Locked" : "Pending", href: "/portal/territory", tone: "var(--gold)" },
        { label: "Territory leads", value: String(LEADS.filter((l) => !["Closed Won", "Closed Lost"].includes(l.stage)).length), href: "/portal/leads", tone: "var(--steel)" },
        { label: "Investor asks", value: String(asks.length), href: "/portal/asks", tone: "var(--red)" },
      ]
    : [
        { label: "Verified deals", value: String(mandates.length), href: "/portal/deals", tone: "var(--green)" },
        { label: "Desperate deals live", value: String(urgent.length), href: "/portal/deals", tone: "var(--red)" },
        { label: "Your asks", value: String(myAsks.length), href: "/portal/asks", tone: "var(--gold)" },
        { label: "Budget band", value: account.budget || "—", href: "/portal/asks", tone: "var(--steel)" },
      ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black">
          {isCp ? "Partner Overview" : "Investor Overview"}
        </h1>
        <p className="text-sm text-graphite">
          {isCp
            ? "Your mandates, territory and leads — everything the public never sees."
            : "Verified mandates, your asks, and the desperate-deal feed."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Link key={k.label} href={k.href} className="card card-hover p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-graphite">{k.label}</p>
            <p className="mt-1 truncate font-display text-2xl font-black" style={{ color: k.tone }}>{k.value}</p>
          </Link>
        ))}
      </div>

      {isCp && !account.territory ? null : isCp && (
        <div className="card flex flex-wrap items-center justify-between gap-4 border-l-4 p-5" style={{ borderLeftColor: "var(--gold)" }}>
          <div>
            <p className="eyebrow">Exclusive territory</p>
            <p className="mt-1 font-display text-lg font-black">{account.territory}</p>
            <p className="text-xs text-graphite">One CP per territory — mandates and leads in this zone route to you alone.</p>
          </div>
          <Link href="/portal/territory" className="btn-primary !py-2.5">View Territory →</Link>
        </div>
      )}

      {!isCp && (
        <div className="card flex flex-wrap items-center justify-between gap-4 border-l-4 p-5" style={{ borderLeftColor: "var(--green)" }}>
          <div>
            <p className="eyebrow">Give &amp; Ask desk</p>
            <p className="mt-1 font-display text-lg font-black">Don&apos;t hunt. Post the requirement.</p>
            <p className="text-xs text-graphite">The platform matches your ask against live mandates and reverts — usually within 24 hours.</p>
          </div>
          <Link href="/portal/asks" className="btn-gold !py-2.5">Post a Requirement →</Link>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 className="font-display text-lg font-black">{isCp ? "Top Mandates" : "Fresh Verified Deals"}</h2>
            <Link href="/portal/deals" className="text-xs font-bold" style={{ color: "var(--gold)" }}>All deals →</Link>
          </div>
          <div className="divide-y divide-line">
            {mandates.slice(0, 4).map((d) => (
              <Link key={d.slug} href="/portal/deals" className="flex items-center justify-between px-6 py-3.5 hover:bg-paper/60">
                <div className="min-w-0">
                  <p className="truncate font-bold leading-snug">{d.title}</p>
                  <p className="text-xs text-graphite">{d.cityLabel} · from {inr(d.price)}</p>
                </div>
                <span className="chip badge-gold shrink-0 !text-[10px]">
                  {isCp ? MANDATES[d.slug].commission.split(" ")[0] + " comm." : MANDATES[d.slug].mandateType}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 className="font-display text-lg font-black">{isCp ? "Latest Investor Asks" : "Desperate-Deal Feed"}</h2>
            <Link href={isCp ? "/portal/asks" : "/portal/deals"} className="text-xs font-bold" style={{ color: "var(--gold)" }}>Open →</Link>
          </div>
          <div className="divide-y divide-line">
            {isCp
              ? asks.slice(0, 3).map((a) => (
                  <div key={a.id} className="px-6 py-3.5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold">{a.type}</p>
                      <span className="chip !text-[10px]">{a.budget}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-graphite">{a.investor} · {a.locations}</p>
                  </div>
                ))
              : urgent.map((d) => (
                  <div key={d.slug} className="flex items-center justify-between px-6 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate font-bold leading-snug">{d.title}</p>
                      <p className="text-xs text-graphite">{d.cityLabel} · {d.upsideNote}</p>
                    </div>
                    <span className="chip shrink-0 !border-[#f0c9c0] !bg-[#faece9] !text-[10px] !text-[var(--red)]">
                      <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--red)]" /> Urgent
                    </span>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
