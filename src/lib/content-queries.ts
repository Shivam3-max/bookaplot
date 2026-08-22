import "server-only";
import { prisma } from "@/lib/prisma";
import type { Deal, LocationZone, Post, Testimonial } from "@/lib/types";
import type { MandateInfo, Creative } from "@/lib/network-data";
import type { Prisma } from "@prisma/client";

type DealRow = Prisma.DealGetPayload<Record<string, never>>;
type LocationRow = Prisma.LocationZoneGetPayload<Record<string, never>>;
type PostRow = Prisma.PostGetPayload<Record<string, never>>;
type TestimonialRow = Prisma.TestimonialGetPayload<Record<string, never>>;

export type DealRecord = Deal & { id: string };
export type LocationRecord = LocationZone & { id: string };
export type PostRecord = Post & { id: string; published: boolean };
export type TestimonialRecord = Testimonial & { id: string; order: number };
export type MandateRecord = MandateInfo & { id: string; dealId: string };
export type CreativeRecord = Creative & { id: string; dealId: string | null };

function toDeal(row: DealRow): DealRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    city: row.city as Deal["city"],
    cityLabel: row.cityLabel,
    microLocation: row.microLocation,
    type: row.type as Deal["type"],
    purpose: row.purpose as unknown as Deal["purpose"],
    status: row.status as Deal["status"],
    badges: row.badges as unknown as Deal["badges"],
    price: row.price,
    priceMax: row.priceMax ?? undefined,
    pricePerUnit: row.pricePerUnit,
    unit: row.unit as Deal["unit"],
    benchmarkPerUnit: row.benchmarkPerUnit,
    sizes: row.sizes as unknown as string[],
    areaLabel: row.areaLabel,
    facing: row.facing ?? undefined,
    roadWidth: row.roadWidth ?? undefined,
    possession: row.possession,
    approval: row.approval,
    score: row.score,
    upsideNote: row.upsideNote,
    highlights: row.highlights as unknown as string[],
    whyStandsOut: row.whyStandsOut as unknown as string[],
    locationAdvantages: row.locationAdvantages as unknown as { label: string; value: string }[],
    demandDrivers: row.demandDrivers as unknown as string[],
    suitsWho: row.suitsWho as unknown as string[],
    overview: row.overview,
    bookingAmount: row.bookingAmount ?? undefined,
    featured: row.featured,
    hot: row.hot,
    investorPick: row.investorPick,
    newListing: row.newListing,
    mapX: row.mapX,
    mapY: row.mapY,
    hue: row.hue,
    faqs: row.faqs as unknown as { q: string; a: string }[],
  };
}

function toLocation(row: LocationRow): LocationRecord {
  return {
    id: row.id,
    slug: row.slug as LocationZone["slug"],
    name: row.name,
    tagline: row.tagline,
    overview: row.overview,
    maturity: row.maturity as LocationZone["maturity"],
    growthScore: row.growthScore,
    priceBand: row.priceBand,
    avgPerSqYd: row.avgPerSqYd,
    idealBuyer: row.idealBuyer as unknown as string[],
    whyBuy: row.whyBuy as unknown as string[],
    connectivity: row.connectivity as unknown as { label: string; value: string }[],
    trend: row.trend as unknown as number[],
    mapX: row.mapX,
    mapY: row.mapY,
    hue: row.hue,
  };
}

function toPost(row: PostRow): PostRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    excerpt: row.excerpt,
    date: row.date.toISOString().slice(0, 10),
    readMins: row.readMins,
    body: row.body as unknown as string[],
    published: row.published,
  };
}

function toTestimonial(row: TestimonialRow): TestimonialRecord {
  return { id: row.id, order: row.order, quote: row.quote, name: row.name, context: row.context };
}

export async function listDeals(): Promise<DealRecord[]> {
  const rows = await prisma.deal.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toDeal);
}

export async function getDeal(slug: string): Promise<DealRecord | undefined> {
  const row = await prisma.deal.findUnique({ where: { slug } });
  return row ? toDeal(row) : undefined;
}

export async function getDealById(id: string): Promise<DealRecord | undefined> {
  const row = await prisma.deal.findUnique({ where: { id } });
  return row ? toDeal(row) : undefined;
}

export async function dealsByCity(city: string): Promise<DealRecord[]> {
  const rows = await prisma.deal.findMany({ where: { city }, orderBy: { createdAt: "desc" } });
  return rows.map(toDeal);
}

export async function listLocations(): Promise<LocationRecord[]> {
  const rows = await prisma.locationZone.findMany({ orderBy: { name: "asc" } });
  return rows.map(toLocation);
}

export async function getLocation(slug: string): Promise<LocationRecord | undefined> {
  const row = await prisma.locationZone.findUnique({ where: { slug } });
  return row ? toLocation(row) : undefined;
}

export async function listPosts(opts?: { includeUnpublished?: boolean }): Promise<PostRecord[]> {
  const rows = await prisma.post.findMany({
    where: opts?.includeUnpublished ? undefined : { published: true },
    orderBy: { date: "desc" },
  });
  return rows.map(toPost);
}

export async function getPost(slug: string): Promise<PostRecord | undefined> {
  const row = await prisma.post.findUnique({ where: { slug } });
  return row ? toPost(row) : undefined;
}

export async function listTestimonials(): Promise<TestimonialRecord[]> {
  const rows = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  return rows.map(toTestimonial);
}

export async function listMandates(): Promise<Record<string, MandateRecord>> {
  const rows = await prisma.mandate.findMany({ include: { deal: { select: { slug: true } } } });
  const map: Record<string, MandateRecord> = {};
  for (const r of rows) {
    map[r.deal.slug] = {
      id: r.id,
      dealId: r.dealId,
      commission: r.commission,
      mandateType: r.mandateType as MandateInfo["mandateType"],
      validity: r.validity,
      investorNote: r.investorNote,
      urgent: r.urgent,
      kit: r.kit as unknown as string[],
    };
  }
  return map;
}

export interface VisitRecord {
  id: string;
  customer: string;
  phone: string;
  deals: string[];
  date: string;
  status: "Requested" | "Confirmed" | "Completed" | "Cancelled";
  coordinator: string;
  feedback?: string;
}

const VISIT_STATUS_LABEL = {
  REQUESTED: "Requested",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;

export async function listVisits(): Promise<VisitRecord[]> {
  const rows = await prisma.visit.findMany({
    include: { coordinator: { select: { name: true } } },
    orderBy: { preferredDate: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    customer: r.customerName,
    phone: r.customerPhone,
    deals: r.dealSlugs as unknown as string[],
    date: r.preferredDate.toISOString().slice(0, 10),
    status: VISIT_STATUS_LABEL[r.status],
    coordinator: r.coordinator?.name ?? "—",
    feedback: r.feedback ?? undefined,
  }));
}

export async function listCreatives(): Promise<CreativeRecord[]> {
  const rows = await prisma.creative.findMany({
    include: { deal: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    dealId: r.dealId,
    title: r.title,
    type: r.type as Creative["type"],
    deal: r.deal?.title ?? "",
    status: r.status as Creative["status"],
    hue: r.hue,
  }));
}
