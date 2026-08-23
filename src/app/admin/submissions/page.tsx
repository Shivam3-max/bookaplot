import { requireAdmin } from "@/lib/dal";
import { listSellerSubmissions } from "@/lib/db";
import SubmissionsClient from "./SubmissionsClient";

export default async function AdminSubmissionsPage() {
  await requireAdmin();
  const submissions = await listSellerSubmissions();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-black">Property Submissions</h1>
        <p className="text-sm text-graphite">Owner submissions from the public "List a Property" form — review and approve or reject.</p>
      </div>
      <SubmissionsClient submissions={submissions} />
    </div>
  );
}
