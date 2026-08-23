import Link from "next/link";
import { requireAdmin } from "@/lib/dal";
import { countAsks, countSellerSubmissions, countUsers } from "@/lib/db";
import { listDeals, listMandates, listVisits } from "@/lib/content-queries";
import { inr } from "@/lib/format";

export default async function AdminDashboard() {
  await requireAdmin();

  const [cps, investors, pendingPartners, openAsks, pendingSubs, DEALS, MANDATES, VISITS] = await Promise.all([
    countUsers({ role: "CP" }),
    countUsers({ role: "INVESTOR" }),
    countUsers({ roles: ["CP", "INVESTOR"], status: "PENDING" }),
    countAsks("OPEN"),
    countSellerSubmissions("PENDING_REVIEW"),
    listDeals(),
    listMandates(),
    listVisits(),
  ]);

  const liveDeals = DEALS.length;
  const mandateCount = DEALS.filter((d) => MANDATES[d.slug]).length;
  const upcomingVisits = VISITS.filter((v) => ["Requested", "Confirmed"].includes(v.status)).length;

  const widgets = [
    { label: "Mandates live", value: mandateCount, href: "/admin/deals", tone: "var(--green)" },
    { label: "Channel partners", value: cps, href: "/admin/partners", tone: "var(--gold)" },
    { label: "Investors on network", value: investors, href: "/admin/partners", tone: "var(--steel)" },
    { label: "Asks awaiting revert", value: openAsks, href: "/admin/asks", tone: "var(--red)" },
    { label: "Pending verifications", value: pendingPartners, href: "/admin/partners", tone: "var(--red)" },
    { label: "Site visits booked", value: upcomingVisits, href: "/admin/visits", tone: "var(--steel)" },
    { label: "Pending submissions", value: pendingSubs, href: "/admin/submissions", tone: "var(--green)" },
  ];

  const topDeals = [...DEALS].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black">Network Command Centre</h1>
        <p className="text-sm text-graphite">CPs, investors, mandates, asks — the whole network from one place. {liveDeals} deals on platform.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {widgets.map((w) => (
          <Link key={w.label} href={w.href} className="card card-hover p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-graphite">{w.label}</p>
            <p className="mt-1 font-display text-3xl font-black" style={{ color: w.tone }}>{w.value}</p>
          </Link>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-lg font-black">Top Performing Deals</h2>
          <Link href="/admin/deals" className="text-xs font-bold" style={{ color: "var(--gold)" }}>Manage →</Link>
        </div>
        {topDeals.length === 0 ? (
          <p className="p-6 text-center text-sm text-graphite">No deals yet — add your first one from Deals &amp; Mandates.</p>
        ) : (
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
        )}
      </div>
    </div>
  );
}
