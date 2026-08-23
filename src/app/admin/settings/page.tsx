import { requireAdmin } from "@/lib/dal";
import { listAdmins } from "@/lib/db";

const SEO_PAGES = [
  ["plots for sale in mohali", "/locations/mohali"],
  ["plots in new chandigarh", "/locations/new-chandigarh"],
  ["commercial property in zirakpur", "/locations/zirakpur"],
  ["buy plot in kharar", "/locations/kharar"],
  ["undervalued property deals in tricity", "/deals"],
  ["property investment in panchkula", "/locations/panchkula"],
];

export default async function AdminSettings() {
  await requireAdmin();
  const admins = await listAdmins();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black">Team &amp; SEO</h1>
        <p className="text-sm text-graphite">Admin accounts and search targets.</p>
      </div>

      <div className="card table-card overflow-x-auto">
        <div className="border-b border-line px-6 py-4">
          <h2 className="font-display text-lg font-black">Admin Accounts</h2>
          <p className="text-xs text-graphite">Every admin account has full access — there are no granular permission tiers yet.</p>
        </div>
        <table className="table-stack w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-line bg-paper text-left text-[10px] font-bold uppercase tracking-wider text-graphite">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Since</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a.id} className="border-b border-line last:border-0">
                <td className="px-6 py-3.5">
                  <span className="mr-2.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink font-display text-xs font-black text-white">
                    {a.name[0]}
                  </span>
                  <span className="font-bold">{a.name}</span>
                </td>
                <td className="px-6 py-3.5 text-xs font-medium text-graphite" data-label="Phone">{a.phone}</td>
                <td className="px-6 py-3.5 text-xs font-medium text-graphite" data-label="Since">
                  {new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
  );
}
