import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import AdminAsksClient from "./AsksClient";

export default async function AdminAsks() {
  await requireAdmin();
  const asks = await prisma.ask.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      investor: { select: { name: true } },
      replies: { orderBy: { createdAt: "asc" } },
    },
  });

  return <AdminAsksClient asks={asks} />;
}
