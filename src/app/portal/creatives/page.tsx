import { requirePartner } from "@/lib/dal";
import { countCreativeRequests } from "@/lib/db";
import { listCreatives } from "@/lib/content-queries";
import CreativesClient from "./CreativesClient";

export default async function CreativesPage() {
  const account = await requirePartner();
  const [requestCount, creatives] = await Promise.all([countCreativeRequests(account.id), listCreatives()]);

  return <CreativesClient account={account} requestCount={requestCount} creatives={creatives} />;
}
