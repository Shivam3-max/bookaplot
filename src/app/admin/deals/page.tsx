import { requireAdmin } from "@/lib/dal";
import { listDeals } from "@/lib/content-queries";
import AdminDealsClient from "./AdminDealsClient";

export default async function AdminDealsPage() {
  await requireAdmin();
  const deals = await listDeals();
  return <AdminDealsClient deals={deals} />;
}
