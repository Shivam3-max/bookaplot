import { requirePartner } from "@/lib/dal";
import { countCreativeRequests } from "@/lib/db";
import CreativesClient from "./CreativesClient";

export default async function CreativesPage() {
  const account = await requirePartner();
  const requestCount = await countCreativeRequests(account.id);

  return <CreativesClient account={account} requestCount={requestCount} />;
}
