"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requirePartner } from "@/lib/dal";
import type { PartnerStatus } from "@prisma/client";

export async function postAsk(formData: FormData) {
  const user = await requirePartner();
  if (user.role !== "INVESTOR") return;

  await prisma.ask.create({
    data: {
      investorId: user.id,
      budget: String(formData.get("budget") || ""),
      type: String(formData.get("type") || ""),
      locations: String(formData.get("locations") || ""),
      urgency: String(formData.get("urgency") || ""),
      note: String(formData.get("note") || ""),
      replies: {
        create: {
          text: "Received by the Give & Ask desk. The team is matching your requirement against live mandates and off-market inventory — expect a revert within 24 hours.",
        },
      },
    },
  });

  revalidatePath("/portal/asks");
}

export async function replyToAsk(askId: string, text: string, matched: boolean) {
  const admin = await requireAdmin();
  if (!text.trim()) return;

  await prisma.$transaction([
    prisma.askReply.create({ data: { askId, authorId: admin.id, text: text.trim() } }),
    prisma.ask.update({
      where: { id: askId },
      data: { status: matched ? "MATCHED" : "PLATFORM_REVERTED" },
    }),
  ]);

  revalidatePath("/admin/asks");
  revalidatePath("/portal/asks");
}

export async function setPartnerStatus(userId: string, status: PartnerStatus, territory?: string) {
  await requireAdmin();

  await prisma.user.update({
    where: { id: userId },
    data: { status, ...(territory !== undefined ? { territory } : {}) },
  });

  revalidatePath("/admin/partners");
}

export async function requestCreative(title: string) {
  const user = await requirePartner();
  if (user.role !== "CP") return;

  await prisma.creativeRequest.create({ data: { userId: user.id, title } });
  revalidatePath("/portal/creatives");
}

export async function submitSellerListing(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const propertyDetail = String(formData.get("propertyDetail") || "").trim();
  const expectedPrice = String(formData.get("expectedPrice") || "").trim();
  if (!name || !phone || !propertyDetail) return { error: "Please fill in all required fields." };

  await prisma.sellerSubmission.create({
    data: { name, phone, propertyDetail, expectedPrice: expectedPrice || undefined },
  });

  return { ok: true };
}
