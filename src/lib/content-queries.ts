import "server-only";
import { prisma } from "@/lib/prisma";
import type { Deal, LocationZone, Post, Testimonial } from "@/lib/types";
import type { MandateInfo, Creative } from "@/lib/network-data";
import type { Prisma } from "@prisma/client";
import { LOCATIONS as STATIC_LOCATIONS, TESTIMONIALS as STATIC_TESTIMONIALS } from "@/lib/data";

const AUDIT_INCLUDE = {
  createdBy: { select: { name: true } },
  updatedBy: { select: { name: true } },
  deletedBy: { select: { name: true } },
} as const;

type DealRow = Prisma.DealGetPayload<{ include: typeof AUDIT_INCLUDE }>;
type PostRow = Prisma.PostGetPayload<{ include: typeof AUDIT_INCLUDE }>;
type LeadRow = Prisma.LeadGetPayload<Record<string, never>>;

interface AuditFields {
  createdById: number | null;
  createdByName: string | null;
  updatedById: number | null;
  updatedByName: string | null;
  deletedById: number | null;
  deletedByName: string | null;
}

export type DealRecord = Deal & { id: number } & AuditFields;
export type LocationRecord = LocationZone & { id: number };
export type PostRecord = Post & { id: number; published: boolean } & AuditFields;
export type TestimonialRecord = Testimonial & { id: number; order: number };
export type MandateRecord = MandateInfo & { id: number; dealId: number };
export type CreativeRecord = Creative & { id: number; dealId: number | null };

function toDeal(row: DealRow): DealRecord {
  return {
    id: row.id,
    createdById: row.createdById,
    createdByName: row.createdBy?.name ?? null,
    updatedById: row.updatedById,
    updatedByName: row.updatedBy?.name ?? null,
    deletedById: row.deletedById,
    deletedByName: row.deletedBy?.name ?? null,
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
    images: (row.images as unknown as string[] | null) ?? [],
  };
}

function toPost(row: PostRow): PostRecord {
  return {
    id: row.id,
    createdById: row.createdById,
    createdByName: row.createdBy?.name ?? null,
    updatedById: row.updatedById,
    updatedByName: row.updatedBy?.name ?? null,
    deletedById: row.deletedById,
    deletedByName: row.deletedBy?.name ?? null,
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

export async function listDeals(): Promise<DealRecord[]> {
  const rows = await prisma.deal.findMany({ where: { deletedAt: null }, include: AUDIT_INCLUDE, orderBy: { createdAt: "desc" } });
  return rows.map(toDeal);
}

export async function getDeal(slug: string): Promise<DealRecord | undefined> {
  const row = await prisma.deal.findFirst({ where: { slug, deletedAt: null }, include: AUDIT_INCLUDE });
  return row ? toDeal(row) : undefined;
}

export async function getDealById(id: number): Promise<DealRecord | undefined> {
  const row = await prisma.deal.findFirst({ where: { id, deletedAt: null }, include: AUDIT_INCLUDE });
  return row ? toDeal(row) : undefined;
}

export async function dealsByCity(city: string): Promise<DealRecord[]> {
  const rows = await prisma.deal.findMany({ where: { city, deletedAt: null }, include: AUDIT_INCLUDE, orderBy: { createdAt: "desc" } });
  return rows.map(toDeal);
}

// Locations stay static (src/lib/data.ts) rather than DB-backed — there's no
// admin UI to manage them, so a fresh deploy with an empty database must
// still show the Tricity map fully populated.
const STATIC_LOCATION_RECORDS: LocationRecord[] = STATIC_LOCATIONS.map((l, i) => ({ id: i + 1, ...l }));

export async function listLocations(): Promise<LocationRecord[]> {
  return [...STATIC_LOCATION_RECORDS].sort((a, b) => a.name.localeCompare(b.name));
}

export async function getLocation(slug: string): Promise<LocationRecord | undefined> {
  return STATIC_LOCATION_RECORDS.find((l) => l.slug === slug);
}

export async function listPosts(opts?: { includeUnpublished?: boolean }): Promise<PostRecord[]> {
  const rows = await prisma.post.findMany({
    where: { deletedAt: null, ...(opts?.includeUnpublished ? {} : { published: true }) },
    include: AUDIT_INCLUDE,
    orderBy: { date: "desc" },
  });
  return rows.map(toPost);
}

export async function getPost(slug: string): Promise<PostRecord | undefined> {
  const row = await prisma.post.findFirst({ where: { slug, deletedAt: null }, include: AUDIT_INCLUDE });
  return row ? toPost(row) : undefined;
}

// Testimonials stay static (src/lib/data.ts) rather than DB-backed — there's
// no admin UI to manage them, same reasoning as listLocations() above.
const STATIC_TESTIMONIAL_RECORDS: TestimonialRecord[] = STATIC_TESTIMONIALS.map((t, i) => ({
  id: i + 1,
  order: i + 1,
  ...t,
}));

export async function listTestimonials(): Promise<TestimonialRecord[]> {
  return STATIC_TESTIMONIAL_RECORDS;
}

export async function listMandates(): Promise<Record<string, MandateRecord>> {
  const rows = await prisma.mandate.findMany({ where: { deal: { deletedAt: null } }, include: { deal: { select: { slug: true } } } });
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
  id: number;
  customer: string;
  phone: string;
  deals: string[];
  date: string;
  status: "Requested" | "Confirmed" | "Completed" | "Cancelled";
  coordinator: string;
  feedback?: string;
  updatedByName: string | null;
}

const VISIT_STATUS_LABEL = {
  REQUESTED: "Requested",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;

export async function listVisits(): Promise<VisitRecord[]> {
  const rows = await prisma.visit.findMany({
    where: { deletedAt: null },
    include: { coordinator: { select: { name: true } }, updatedBy: { select: { name: true } } },
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
    updatedByName: r.updatedBy?.name ?? null,
  }));
}

export async function listCreatives(): Promise<CreativeRecord[]> {
  const rows = await prisma.creative.findMany({
    where: { deletedAt: null },
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

// --- Leads (real capture from LeadForm's 3 usages: /contact, deal detail "Send Request", /nri) ---

export type LeadStageValue = "NEW" | "CONTACTED" | "FOLLOW_UP" | "VISIT_SCHEDULED" | "HOT" | "NEGOTIATION" | "CLOSED_WON" | "CLOSED_LOST";

export interface LeadRecord {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  source: string;
  note: string | null;
  stage: LeadStageValue;
  assigneeId: number | null;
  assigneeName: string | null;
  updatedByName: string | null;
  createdAt: string;
}

function toLead(row: LeadRow & { assignee: { name: string } | null; updatedBy: { name: string } | null }): LeadRecord {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    source: row.source,
    note: row.note,
    stage: row.stage,
    assigneeId: row.assigneeId,
    assigneeName: row.assignee?.name ?? null,
    updatedByName: row.updatedBy?.name ?? null,
    createdAt: row.createdAt.toISOString().slice(0, 10),
  };
}

export async function listLeads(): Promise<LeadRecord[]> {
  const rows = await prisma.lead.findMany({
    where: { deletedAt: null },
    include: { assignee: { select: { name: true } }, updatedBy: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toLead);
}
