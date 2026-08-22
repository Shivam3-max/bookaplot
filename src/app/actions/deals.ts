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

export async function createDeal(formData: FormData) {
  await requireAdmin();
  const data = dealDataFromForm(formData);
  if (!data.slug || !data.title) return { error: "Slug and title are required." };
  await prisma.deal.create({ data });
  revalidateDealPaths(data.slug);
  return { ok: true };
}

export async function updateDeal(id: string, formData: FormData) {
  await requireAdmin();
  const data = dealDataFromForm(formData);
  if (!data.slug || !data.title) return { error: "Slug and title are required." };
  await prisma.deal.update({ where: { id }, data });
  revalidateDealPaths(data.slug);
  return { ok: true };
}

export async function updateDealQuickFields(id: string, patch: { status?: string; featured?: boolean }) {
  await requireAdmin();
  const deal = await prisma.deal.update({ where: { id }, data: patch });
  revalidateDealPaths(deal.slug);
}

export async function deleteDeal(id: string) {
  await requireAdmin();
  const deal = await prisma.deal.delete({ where: { id } });
  revalidateDealPaths(deal.slug);
}

export async function upsertMandate(dealId: string, formData: FormData) {
  await requireAdmin();
  const commission = String(formData.get("commission") ?? "").trim();
  const mandateType = String(formData.get("mandateType") ?? "").trim();
  const validity = String(formData.get("validity") ?? "").trim();
  const investorNote = String(formData.get("investorNote") ?? "").trim();
  const urgent = formData.get("urgent") === "on";
  const kit = splitCommas(formData.get("kit"));

  await prisma.mandate.upsert({
    where: { dealId },
    create: { dealId, commission, mandateType, validity, investorNote, urgent, kit },
    update: { commission, mandateType, validity, investorNote, urgent, kit },
  });
  const deal = await prisma.deal.findUnique({ where: { id: dealId }, select: { slug: true } });
  revalidateDealPaths(deal?.slug);
}

export async function deleteMandate(dealId: string) {
  await requireAdmin();
  await prisma.mandate.delete({ where: { dealId } }).catch(() => null);
  const deal = await prisma.deal.findUnique({ where: { id: dealId }, select: { slug: true } });
  revalidateDealPaths(deal?.slug);
}
