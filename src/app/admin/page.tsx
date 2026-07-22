"use client";

import Link from "next/link";
import { DEALS } from "@/lib/data";
import { LEADS, VISITS, SUBMISSIONS, NOTIFICATIONS } from "@/lib/admin-data";
import { MANDATES } from "@/lib/network-data";
import { useNetwork } from "@/context/NetworkContext";
import { inr } from "@/lib/format";

const FUNNEL = [
  { stage: "Inquiries", n: 3200 },
  { stage: "Qualified", n: 1410 },
  { stage: "Site visits", n: 640 },
  { stage: "Negotiation", n: 212 },
  { stage: "Closed won", n: 96 },
];

export default function AdminDashboard() {
  const { partners, asks } = useNetwork();
  const liveDeals = DEALS.length;
  const mandateCount = DEALS.filter((d) => MANDATES[d.slug]).length;
  const newLeads = LEADS.filter((l) => l.stage === "New").length;
  const pendingSubs = SUBMISSIONS.filter((s) => s.status === "Pending Review").length;
  const upcomingVisits = VISITS.filter((v) => ["Requested", "Confirmed"].includes(v.status)).length;
  const pendingPartners = partners.filter((p) => p.status === "Pending").length;
  const openAsks = asks.filter((a) => a.status === "Open").length;
  const cps = partners.filter((p) => p.role === "cp").length;
  const investors = partners.filter((p) => p.role === "investor").length;

  const widgets = [
    { label: "Mandates live", value: mandateCount, href: "/admin/deals", tone: "var(--green)" },
    { label: "Channel partners", value: cps, href: "/admin/partners", tone: "var(--gold)" },
    { label: "Investors on network", value: investors, href: "/admin/partners", tone: "var(--steel)" },
    { label: "Asks awaiting revert", value: openAsks, href: "/admin/asks", tone: "var(--red)" },
    { label: "Pending verifications", value: pendingPartners, href: "/admin/partners", tone: "var(--red)" },
    { label: "New leads today", value: newLeads, href: "/admin/leads", tone: "var(--gold)" },
    { label: "Site visits booked", value: upcomingVisits, href: "/admin/visits", tone: "var(--steel)" },
    { label: "Pending submissions", value: pendingSubs, href: "/admin/submissions", tone: "var(--green)" },
  ];

  const topDeals = [...DEALS].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black">Network Command Centre</h1>
        <p className="text-sm text-graphite">CPs, investors, mandates, asks, leads — the whole network from one place. {liveDeals} deals on platform.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {widgets.map((w) => (
          <Link key={w.label} href={w.href} className="card card-hover p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-graphite">{w.label}</p>
            <p className="mt-1 font-display text-3xl font-black" style={{ color: w.tone }}>{w.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* funnel */}
        <div className="card p-6">
          <h2 className="font-display text-lg font-black">Inquiry Conversion Funnel</h2>
          <div className="mt-5 space-y-3">
            {FUNNEL.map((f, i) => (
              <div key={f.stage} className="flex items-center gap-3">
                <span className="w-24 text-xs font-bold text-graphite">{f.stage}</span>
                <div className="h-7 flex-1 overflow-hidden rounded-lg bg-paper">
                  <div
                    className="flex h-full items-center rounded-lg px-2.5 text-[11px] font-black text-white"
                    style={{
                      width: `${Math.max((f.n / FUNNEL[0].n) * 100, 8)}%`,
                      background: `linear-gradient(90deg, var(--green), ${i >= 3 ? "var(--gold)" : "var(--green)"})`,
                    }}
                  >
                    {f.n.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-graphite">Visit → close ratio: 15% · Inquiry → visit: 20%</p>
        </div>

        {/* notifications */}
        <div className="card p-6">
          <h2 className="font-display text-lg font-black">Notifications</h2>
          <div className="mt-4 space-y-3">
            {NOTIFICATIONS.map((n) => (
              <div key={n.d} className="flex items-start gap-3 rounded-xl bg-paper p-3">
                <span
                  className="mt-1 h-2 w-2 shrink-0 rounded-full"
                  style={{ background: n.kind === "warning" ? "var(--red)" : n.kind === "lead" ? "var(--gold)" : "var(--green)" }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-bold leading-snug">{n.t}</p>
                  <p className="truncate text-xs text-graphite">{n.d}</p>
                </div>
                <span className="shrink-0 text-[10px] font-semibold text-graphite">{n.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* top deals */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 className="font-display text-lg font-black">Top Performing Deals</h2>
            <Link href="/admin/deals" className="text-xs font-bold" style={{ color: "var(--gold)" }}>Manage →</Link>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {topDeals.map((d) => (
                <tr key={d.slug} className="border-b border-line last:border-0">
                  <td className="px-6 py-3">
                    <p className="font-bold leading-snug">{d.title}</p>
                    <p className="text-xs text-graphite">{d.cityLabel} · from {inr(d.price)}</p>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <span className="chip badge-green">Score {d.score}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* location interest */}
        <div className="card p-6">
          <h2 className="font-display text-lg font-black">Location-Wise Interest (30d)</h2>
          <div className="mt-5 space-y-3">
            {[
              ["Mohali", 34], ["New Chandigarh", 24], ["Zirakpur", 18], ["Kharar", 12], ["Panchkula", 7], ["Chandigarh", 5],
            ].map(([name, pct]) => (
              <div key={name} className="flex items-center gap-3">
                <span className="w-32 text-xs font-bold text-graphite">{name}</span>
                <div className="h-2.5 flex-1 rounded-full bg-paper">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--gold)" }} />
                </div>
                <span className="w-9 text-right text-xs font-black">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
