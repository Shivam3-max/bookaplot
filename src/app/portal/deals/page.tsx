import { requirePartner } from "@/lib/dal";
import { listDeals, listMandates } from "@/lib/content-queries";
import PortalDealsClient from "./PortalDealsClient";

export default async function PortalDealsPage() {
  await requirePartner();
  const [deals, mandates] = await Promise.all([listDeals(), listMandates()]);
  return <PortalDealsClient deals={deals} mandates={mandates} />;
}
