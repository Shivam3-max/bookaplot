import { requirePartner } from "@/lib/dal";
import { listAsks } from "@/lib/db";
import AsksClient from "./AsksClient";

export default async function AsksPage() {
  const account = await requirePartner();
  const asks = await listAsks();

  return <AsksClient account={account} asks={asks} />;
}
