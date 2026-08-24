"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dal";

const LIST_PATHS = ["/", "/deals", "/locations", "/map", "/portal", "/portal/deals", "/portal/territory", "/admin/deals", "/admin", "/admin/analytics", "/nri", "/insights"];

function revalidateDealPaths(slug?: string) {
  for (const p of LIST_PATHS) revalidatePath(p);
  if (slug) revalidatePath(`/deals/${slug}`);
}

function splitLines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitCommas(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseLabelValueLines(value: FormDataEntryValue | null) {
  return splitLines(value)
    .map((line) => {
      const idx = line.indexOf(":");
      if (idx === -1) return null;
      return { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
    })
    .filter((x): x is { label: string; value: string } => x !== null);
}

function parseFaqLines(value: FormDataEntryValue | null) {
  return splitLines(value)
    .map((line) => {
      const idx = line.indexOf("|");
      if (idx === -1) return null;
      return { q: line.slice(0, idx).trim(), a: line.slice(idx + 1).trim() };
    })
    .filter((x): x is { q: string; a: string } => x !== null);
}

function dealDataFromForm(formData: FormData) {
  const num = (name: string) => {
    const v = formData.get(name);
    if (v === null || v === "") return undefined;
    return Number(v);
  };
  const str = (name: string) => String(formData.get(name) ?? "").trim();

  return {
    slug: str("slug"),
    title: str("title"),
    subtitle: str("subtitle"),
    city: str("city"),
    cityLabel: str("cityLabel"),
    microLocation: str("microLocation"),
    type: str("type"),
    status: str("status"),
    unit: str("unit"),
    facing: str("facing") || null,
    roadWidth: str("roadWidth") || null,
    possession: str("possession"),
    approval: str("approval"),
    areaLabel: str("areaLabel"),
    upsideNote: str("upsideNote"),
    overview: str("overview"),
    price: num("price") ?? 0,
    priceMax: num("priceMax") ?? null,
    pricePerUnit: num("pricePerUnit") ?? 0,
    benchmarkPerUnit: num("benchmarkPerUnit") ?? 0,
    score: num("score") ?? 0,
    bookingAmount: num("bookingAmount") ?? null,
    mapX: num("mapX") ?? 50,
    mapY: num("mapY") ?? 50,
    hue: num("hue") ?? 200,
    featured: formData.get("featured") === "on",
    hot: formData.get("hot") === "on",
    investorPick: formData.get("investorPick") === "on",
    newListing: formData.get("newListing") === "on",
    purpose: splitCommas(formData.get("purpose")),
    badges: splitCommas(formData.get("badges")),
    sizes: splitCommas(formData.get("sizes")),
    highlights: splitLines(formData.get("highlights")),
    whyStandsOut: splitLines(formData.get("whyStandsOut")),
    demandDrivers: splitLines(formData.get("demandDrivers")),
    suitsWho: splitCommas(formData.get("suitsWho")),
    locationAdvantages: parseLabelValueLines(formData.get("locationAdvantages")),
    faqs: parseFaqLines(formData.get("faqs")),
  };
}

const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // stored as base64 in the DB — keeps rows well under MySQL's default max_allowed_packet
const MAX_IMAGES = 12;

// Images are stored as data: URLs directly on the deal row (no filesystem
// dependency). "existingImages" carries forward images kept from a previous
// save; "newImages" are freshly uploaded files to append.
async function imagesFromForm(formData: FormData): Promise<{ images: string[] } | { error: string }> {
  const kept = formData.getAll("existingImages").map(String).filter(Boolean);
  const files = formData.getAll("newImages").filter((f): f is File => f instanceof File && f.size > 0);

  const uploaded: string[] = [];
  for (const file of files) {
    if (!file.type.startsWith("image/")) return { error: `"${file.name}" isn't an image.` };
    if (file.size > MAX_IMAGE_BYTES) return { error: `"${file.name}" is over the 4MB limit.` };
    const buffer = Buffer.from(await file.arrayBuffer());
    uploaded.push(`data:${file.type};base64,${buffer.toString("base64")}`);
  }

  const images = [...kept, ...uploaded];
  if (images.length > MAX_IMAGES) return { error: `Max ${MAX_IMAGES} images per deal.` };
  return { images };
}

export async function createDeal(formData: FormData): Promise<{ ok: true } | { error: string }> {
  const admin = await requireAdmin();
  const data = dealDataFromForm(formData);
  if (!data.slug || !data.title) return { error: "Slug and title are required." };
  const imgResult = await imagesFromForm(formData);
  if ("error" in imgResult) return { error: imgResult.error };
  await prisma.deal.create({ data: { ...data, images: imgResult.images, createdById: admin.id } });
  revalidateDealPaths(data.slug);
  return { ok: true };
}

export async function updateDeal(id: number, formData: FormData): Promise<{ ok: true } | { error: string }> {
  const admin = await requireAdmin();
  const data = dealDataFromForm(formData);
  if (!data.slug || !data.title) return { error: "Slug and title are required." };
  const imgResult = await imagesFromForm(formData);
  if ("error" in imgResult) return { error: imgResult.error };
  await prisma.deal.update({ where: { id }, data: { ...data, images: imgResult.images, updatedById: admin.id } });
  revalidateDealPaths(data.slug);
  return { ok: true };
}

export async function updateDealQuickFields(id: number, patch: { status?: string; featured?: boolean }) {
  const admin = await requireAdmin();
  const deal = await prisma.deal.update({ where: { id }, data: { ...patch, updatedById: admin.id } });
  revalidateDealPaths(deal.slug);
}

// Soft delete: the row stays in the database (marked deletedAt) instead of
// being removed, so it disappears from every list/query but nothing is lost.
export async function deleteDeal(id: number) {
  const admin = await requireAdmin();
  const deal = await prisma.deal.update({ where: { id }, data: { deletedAt: new Date(), deletedById: admin.id } });
  revalidateDealPaths(deal.slug);
}

export async function upsertMandate(dealId: number, formData: FormData) {
  const admin = await requireAdmin();
  const commission = String(formData.get("commission") ?? "").trim();
  const mandateType = String(formData.get("mandateType") ?? "").trim();
  const validity = String(formData.get("validity") ?? "").trim();
  const investorNote = String(formData.get("investorNote") ?? "").trim();
  const urgent = formData.get("urgent") === "on";
  const kit = splitCommas(formData.get("kit"));

  await prisma.mandate.upsert({
    where: { dealId },
    create: { dealId, commission, mandateType, validity, investorNote, urgent, kit, createdById: admin.id },
    update: { commission, mandateType, validity, investorNote, urgent, kit, updatedById: admin.id },
  });
  const deal = await prisma.deal.findUnique({ where: { id: dealId }, select: { slug: true } });
  revalidateDealPaths(deal?.slug);
}

export async function deleteMandate(dealId: number) {
  await requireAdmin();
  await prisma.mandate.delete({ where: { dealId } }).catch(() => null);
  const deal = await prisma.deal.findUnique({ where: { id: dealId }, select: { slug: true } });
  revalidateDealPaths(deal?.slug);
}
