"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";

export async function createVisit(formData: FormData) {
  const customerName = String(formData.get("name") ?? "").trim();
  const customerPhone = String(formData.get("phone") ?? "").trim();
  const dealSlugs = String(formData.get("dealSlugs") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const preferredDateStr = String(formData.get("preferredDate") ?? "").trim();

  if (!customerName || !customerPhone) {
    return { error: "Please share your name and phone number." };
  }

  await prisma.visit.create({
    data: {
      customerName,
      customerPhone,
      dealSlugs,
      preferredDate: preferredDateStr ? new Date(preferredDateStr) : new Date(),
    },
  });

  revalidatePath("/admin/visits");
  revalidatePath("/admin");
  return { ok: true };
}

export async function updateVisitStatus(id: number, status: "REQUESTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED") {
  await requireAdmin();
  await prisma.visit.update({ where: { id }, data: { status } });
  revalidatePath("/admin/visits");
  revalidatePath("/admin");
}

export async function setVisitFeedback(id: number, feedback: string) {
  await requireAdmin();
  await prisma.visit.update({ where: { id }, data: { feedback: feedback.trim() || null } });
  revalidatePath("/admin/visits");
}
