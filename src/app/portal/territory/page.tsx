import { requirePartner } from "@/lib/dal";
import { listDeals, listLocations, listLeads } from "@/lib/content-queries";
import TerritoryClient from "./TerritoryClient";

export default async function TerritoryPage() {
  await requirePartner();
  const [deals, locations, leads] = await Promise.all([listDeals(), listLocations(), listLeads()]);
  const activeLeadsCount = leads.filter((l) => l.stage !== "CLOSED_WON" && l.stage !== "CLOSED_LOST").length;
  return <TerritoryClient deals={deals} locations={locations} activeLeadsCount={activeLeadsCount} />;
}
