"use server";

import { revalidatePath } from "next/cache";
import {
  createAsk,
  createCreativeRequest,
  createSellerSubmission,
  replyToAskRecord,
  updatePartnerStatus as updatePartnerStatusRecord,
  updateSellerSubmissionStatus,
} from "@/lib/db";
import { requireAdmin, requirePartner } from "@/lib/dal";
import type { PartnerStatus, SubmissionStatus } from "@/lib/db-types";

export async function postAsk(formData: FormData) {
  const user = await requirePartner();
  if (user.role !== "INVESTOR") return;

  await createAsk({
    investorId: user.id,
    budget: String(formData.get("budget") || ""),
    type: String(formData.get("type") || ""),
    locations: String(formData.get("locations") || ""),
    urgency: String(formData.get("urgency") || ""),
    note: String(formData.get("note") || ""),
    initialReplyText:
      "Received by the Give & Ask desk. The team is matching your requirement against live mandates and off-market inventory - expect a revert within 24 hours.",
  });

  revalidatePath("/portal/asks");
}

export async function replyToAsk(askId: number, text: string, matched: boolean) {
  const admin = await requireAdmin();
  if (!text.trim()) return;

  await replyToAskRecord({
    askId,
    authorId: admin.id,
    text: text.trim(),
    matched,
  });

  revalidatePath("/admin/asks");
  revalidatePath("/portal/asks");
}

export async function setPartnerStatus(userId: number, status: PartnerStatus, territory?: string) {
  const admin = await requireAdmin();
  await updatePartnerStatusRecord(userId, status, territory, admin.id);
  revalidatePath("/admin/partners");
}

export async function requestCreative(title: string) {
  const user = await requirePartner();
  if (user.role !== "CP") return;

  await createCreativeRequest(user.id, title);
  revalidatePath("/portal/creatives");
}

export async function submitSellerListing(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const propertyDetail = String(formData.get("propertyDetail") || "").trim();
  const expectedPrice = String(formData.get("expectedPrice") || "").trim();
  if (!name || !phone || !propertyDetail) {
    return { error: "Please fill in all required fields." };
  }

  await createSellerSubmission({
    name,
    phone,
    propertyDetail,
    expectedPrice: expectedPrice || null,
  });

  return { ok: true };
}

export async function updateSubmissionStatus(id: number, status: SubmissionStatus) {
  const admin = await requireAdmin();
  await updateSellerSubmissionStatus(id, status, admin.id);
  revalidatePath("/admin/submissions");
  revalidatePath("/admin");
}
