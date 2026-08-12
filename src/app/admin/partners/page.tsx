import { requireAdmin } from "@/lib/dal";
import { listPartners } from "@/lib/db";
import PartnersClient from "./PartnersClient";

export default async function AdminPartners() {
  await requireAdmin();
  const partners = await listPartners();

  return <PartnersClient partners={partners} />;
}
