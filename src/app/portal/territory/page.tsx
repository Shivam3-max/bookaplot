import { requirePartner } from "@/lib/dal";
import { listDeals, listLocations } from "@/lib/content-queries";
import TerritoryClient from "./TerritoryClient";

export default async function TerritoryPage() {
  await requirePartner();
  const [deals, locations] = await Promise.all([listDeals(), listLocations()]);
  return <TerritoryClient deals={deals} locations={locations} />;
}
