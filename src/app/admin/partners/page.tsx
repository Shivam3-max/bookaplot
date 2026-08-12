import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import PartnersClient from "./PartnersClient";

export default async function AdminPartners() {
  await requireAdmin();
  const partners = await prisma.user.findMany({
    where: { role: { in: ["CP", "INVESTOR"] } },
    orderBy: { createdAt: "desc" },
  });

  return <PartnersClient partners={partners} />;
}
