"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requirePartner } from "@/lib/dal";
import type { LeadStageValue } from "@/lib/content-queries";

function revalidateLeadPaths() {
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  revalidatePath("/portal/leads");
  revalidatePath("/portal/territory");
}

// Public: called from LeadForm on /contact, deal detail pages, and /nri.
// `source` identifies which form it came from; everything besides
// name/phone/email is folded into `note` since each usage collects a
// different set of fields.
export async function createLead(formData: FormData, source: string) {
  // Most usages name the identity field "name"; the property-listing form
  // calls it "owner" instead - fall back across the ones actually in use.
  const nameKey = ["name", "owner"].find((k) => String(formData.get(k) ?? "").trim());
  const name = nameKey ? String(formData.get(nameKey)).trim() : "";
  if (!name) return { error: "Please share your name." };

  const phone = String(formData.get("phone") ?? "").trim() || null;
  const email = String(formData.get("email") ?? "").trim() || null;

  const noteParts: string[] = [];
  for (const [key, value] of formData.entries()) {
    if (["name", "owner", "phone", "email"].includes(key)) continue;
    const v = String(value).trim();
    if (v) noteParts.push(`${key}: ${v}`);
  }

  await prisma.lead.create({
    data: {
      name,
      phone,
      email,
      source,
      note: noteParts.length ? noteParts.join("\n") : null,
    },
  });

  revalidateLeadPaths();
  return { ok: true };
}

export async function updateLeadStageAdmin(id: number, stage: LeadStageValue) {
  const admin = await requireAdmin();
  await prisma.lead.update({ where: { id }, data: { stage, updatedById: admin.id } });
  revalidateLeadPaths();
}

// CPs can also work the pipeline - there's no real territory-matching yet
// (leads aren't geographically routed), so any signed-in CP can update any
// lead's stage for now.
export async function updateLeadStagePartner(id: number, stage: LeadStageValue) {
  const user = await requirePartner();
  if (user.role !== "CP") return;
  await prisma.lead.update({ where: { id }, data: { stage, updatedById: user.id } });
  revalidateLeadPaths();
}
