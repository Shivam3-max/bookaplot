import { requirePartner } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import CreativesClient from "./CreativesClient";

export default async function CreativesPage() {
  const account = await requirePartner();
  const requestCount = await prisma.creativeRequest.count({ where: { userId: account.id } });

  return <CreativesClient account={account} requestCount={requestCount} />;
}
