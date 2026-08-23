import { requirePartner } from "@/lib/dal";
import { listLeads } from "@/lib/content-queries";
import PortalLeadsClient from "./PortalLeadsClient";

export default async function PortalLeadsPage() {
  const account = await requirePartner();
  if (account.role !== "CP") {
    return (
      <div className="card p-10 text-center">
        <p className="font-display font-bold">Territory Leads is a Channel Partner feature.</p>
      </div>
    );
  }
  const leads = await listLeads();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black">Territory Leads</h1>
        <p className="text-sm text-graphite">Real inquiries captured from forms across the site. Update stages as you work them.</p>
      </div>
      <PortalLeadsClient leads={leads} />
    </div>
  );
}
