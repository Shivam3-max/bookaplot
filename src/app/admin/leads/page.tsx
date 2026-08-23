import { requireAdmin } from "@/lib/dal";
import { listLeads } from "@/lib/content-queries";
import AdminLeadsClient from "./AdminLeadsClient";

export default async function AdminLeads() {
  await requireAdmin();
  const leads = await listLeads();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black">Leads / CRM</h1>
        <p className="text-sm text-graphite">Real inquiries captured from forms across the site, with stage tracking.</p>
      </div>
      <AdminLeadsClient leads={leads} />
    </div>
  );
}
