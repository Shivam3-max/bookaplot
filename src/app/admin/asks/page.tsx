import { requireAdmin } from "@/lib/dal";
import { listAsks } from "@/lib/db";
import AdminAsksClient from "./AsksClient";

export default async function AdminAsks() {
  await requireAdmin();
  const asks = await listAsks();

  return <AdminAsksClient asks={asks} />;
}
