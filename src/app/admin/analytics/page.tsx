import { DEALS } from "@/lib/data";

const SOURCES = [
  ["Organic search", 42], ["Direct", 21], ["WhatsApp shares", 15], ["Social", 12], ["Referral", 10],
] as const;

const BUDGETS = [
  ["Under ₹50 L", 38], ["₹50 L – 1 Cr", 27], ["₹1 – 1.5 Cr", 19], ["Above ₹1.5 Cr", 16],
] as const;

const CALC_USAGE = [
  ["Total Plot Investment", 31], ["EMI / Loan", 26], ["ROI / Appreciation", 18], ["Buy vs Rent", 11], ["Stamp Duty", 9], ["Rental Yield", 5],
] as const;

function Bars({ data, tone }: { data: readonly (readonly [string, number])[]; tone: string }) {
  return (
    <div className="mt-5 space-y-3">
      {data.map(([name, pct]) => (
        <div key={name} className="flex items-center gap-3">
          <span className="w-40 truncate text-xs font-bold text-graphite">{name}</span>
          <div className="h-2.5 flex-1 rounded-full bg-paper">
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: tone }} />
          </div>
          <span className="w-9 text-right text-xs font-black">{pct}%</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminAnalytics() {
  const top = [...DEALS].sort((a, b) => b.score - a.score).slice(0, 5);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black">Analytics Panel</h1>
        <p className="text-sm text-graphite">30-day rolling view. Live integrations (GA4 / Meta / server events) connect at backend stage.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Sessions", "18,420", "+12%"],
          ["Returning users", "31%", "+4 pts"],
          ["Visit conversion", "15%", "+2 pts"],
          ["Avg. session", "4m 12s", "+18s"],
        ].map(([k, v, d]) => (
          <div key={k} className="card p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-graphite">{k}</p>
            <p className="mt-1 font-display text-2xl font-black">{v}</p>
            <p className="text-xs font-bold text-green">{d} vs prev. 30d</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6">
          <h2 className="font-display text-lg font-black">Lead Sources</h2>
          <Bars data={SOURCES} tone="var(--green)" />
        </div>
        <div className="card p-6">
          <h2 className="font-display text-lg font-black">Budget Band Trends</h2>
          <Bars data={BUDGETS} tone="var(--gold)" />
        </div>
        <div className="card p-6">
          <h2 className="font-display text-lg font-black">Calculator Usage</h2>
          <Bars data={CALC_USAGE} tone="var(--steel)" />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-line px-6 py-4">
          <h2 className="font-display text-lg font-black">Most Viewed Deals</h2>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {top.map((d, i) => (
              <tr key={d.slug} className="border-b border-line last:border-0">
                <td className="w-12 px-6 py-3 font-display font-black text-graphite">{i + 1}</td>
                <td className="px-2 py-3">
                  <p className="font-bold leading-snug">{d.title}</p>
                  <p className="text-xs text-graphite">{d.cityLabel}</p>
                </td>
                <td className="px-6 py-3 text-right text-xs font-black">{(2400 - i * 380).toLocaleString("en-IN")} views</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
