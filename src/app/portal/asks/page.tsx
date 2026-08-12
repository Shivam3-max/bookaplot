import { requirePartner } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import AsksClient from "./AsksClient";

export default async function AsksPage() {
  const account = await requirePartner();
  const asks = await prisma.ask.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      investor: { select: { name: true } },
      replies: { orderBy: { createdAt: "asc" } },
    },
  });

  return <AsksClient account={account} asks={asks} />;
}
