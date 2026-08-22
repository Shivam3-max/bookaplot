import { requireAdmin } from "@/lib/dal";
import { listVisits } from "@/lib/content-queries";
import AdminVisitsClient from "./AdminVisitsClient";

export default async function AdminVisitsPage() {
  await requireAdmin();
  const visits = await listVisits();
  return <AdminVisitsClient visits={visits} />;
}
