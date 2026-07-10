import { TEAM } from "@/lib/admin-data";

const SEO_PAGES = [
  ["plots for sale in mohali", "/locations/mohali"],
  ["plots in new chandigarh", "/locations/new-chandigarh"],
  ["commercial property in zirakpur", "/locations/zirakpur"],
  ["buy plot in kharar", "/locations/kharar"],
  ["undervalued property deals in tricity", "/deals"],
  ["property investment in panchkula", "/locations/panchkula"],
];

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black">Team, Roles &amp; SEO</h1>
        <p className="text-sm text-graphite">Permission structure and search targets — enforced once auth is connected.</p>
      </div>

      <div className="card overflow-x-auto">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-lg font-black">Users &amp; Roles</h2>
          <button className="btn-gold !py-2 !text-xs">+ Invite Member</button>
        </div>
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-line bg-paper text-left text-[10px] font-bold uppercase tracking-wider text-graphite">
              <th className="px-6 py-3">Member</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Access</th>
            </tr>
          </thead>
          <tbody>
            {TEAM.map((t) => (
              <tr key={t.name} className="border-b border-line last:border-0">
                <td className="px-6 py-3.5">
                  <span className="mr-2.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink font-display text-xs font-black text-white">
                    {t.name[0]}
                  </span>
                  <span className="font-bold">{t.name}</span>
                </td>
                <td className="px-6 py-3.5">
                  <span className={`chip ${t.role === "Super Admin" ? "badge-gold" : "badge-steel"}`}>{t.role}</span>
                </td>
                <td className="px-6 py-3.5 text-xs font-medium text-graphite">{t.access}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-display text-lg font-black">Permission Rules</h2>
          <ul className="mt-4 space-y-2.5">
            {[
              "Only Admin can delete deals",
              "Sales team can update leads and visits",
              "Content Manager can update blogs and homepage blocks",
              "Analyst can add market notes but not publish",
              "Visit Coordinator sees visits module only",
            ].map((r) => (
              <li key={r} className="flex items-start gap-2.5 rounded-xl bg-paper px-4 py-3 text-[13px] font-medium">
                <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-lg font-black">Primary SEO Targets</h2>
          <div className="mt-4 space-y-2">
            {SEO_PAGES.map(([kw, path]) => (
              <div key={kw} className="flex items-center justify-between rounded-xl border border-line px-4 py-2.5">
                <span className="text-[13px] font-semibold">&ldquo;{kw}&rdquo;</span>
                <span className="text-xs font-bold text-graphite">{path}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-graphite">
            Every deal, location and post already ships per-page meta titles and descriptions via the Next.js Metadata API.
          </p>
        </div>
      </div>
    </div>
  );
}
