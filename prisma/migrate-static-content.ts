import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { getDatabaseConfig } from "../src/lib/database-config.ts";
import { DEALS, LOCATIONS, POSTS, TESTIMONIALS } from "../src/lib/data.ts";

// One-time cutover: moves what used to be hardcoded arrays in src/lib/data.ts
// and src/lib/network-data.ts into real, admin-editable database rows. This
// preserves today's placeholder content exactly as-is - it does not invent
// new business content, it just makes the existing content persistent and
// editable instead of baked into the JS bundle. Safe to re-run (upserts by
// the natural unique key - slug, or dealId for mandates).

const config = getDatabaseConfig();
const adapter = new PrismaMariaDb({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database,
  connectionLimit: 5,
  acquireTimeout: 10000,
  connectTimeout: 5000,
});
const prisma = new PrismaClient({ adapter });

// Captured from the pre-cutover src/lib/network-data.ts (MANDATES/CREATIVES
// consts have since been removed from that file now that this is the source
// of truth for seeding the real tables).
const MANDATES: Record<
  string,
  { commission: string; mandateType: string; validity: string; investorNote: string; urgent?: boolean; kit: string[] }
> = {
  "premium-residential-plot-new-chandigarh": {
    commission: "2.5% + ₹50K milestone bonus",
    mandateType: "Exclusive Mandate",
    validity: "Till 30 Sep 2026",
    investorNote: "Direct developer allocation — no broker chain, registry-ready.",
    kit: ["Brochure PDF", "Price sheet", "Walkthrough video", "WhatsApp creatives ×6"],
  },
  "growth-corridor-plot-cluster-kharar": {
    commission: "3% flat",
    mandateType: "Verified Mandate",
    validity: "Till 31 Aug 2026",
    investorNote: "Developer carrying unsold stock — negotiation headroom for bulk buys.",
    urgent: true,
    kit: ["Brochure PDF", "Layout plan", "Reel pack ×4", "Hindi + Punjabi creatives"],
  },
  "commercial-pocket-deal-zirakpur": {
    commission: "2% + leasing referral",
    mandateType: "Sole Selling",
    validity: "Till 15 Oct 2026",
    investorNote: "Tenanted-yield option available; rent sheet on request.",
    kit: ["Frontage video", "Footfall report", "Price sheet", "Banner set"],
  },
  "early-stage-township-entry-mohali": {
    commission: "3.5% pre-launch slab",
    mandateType: "Exclusive Mandate",
    validity: "Launch window — 45 days",
    investorNote: "Pre-launch allocation reserved for network investors before public release.",
    kit: ["Master plan", "EOI form", "Launch teaser video", "Creatives ×8"],
  },
  "premium-sector-plot-panchkula": {
    commission: "1.5% (resale)",
    mandateType: "Verified Mandate",
    validity: "Open",
    investorNote: "Motivated seller — decision window short, docs pre-verified.",
    urgent: true,
    kit: ["Title summary", "Site photos", "Price note"],
  },
  "it-city-adjacent-commercial-plot-mohali": {
    commission: "2%",
    mandateType: "Verified Mandate",
    validity: "Till 30 Nov 2026",
    investorNote: "Thin-supply commercial belt; suits build-to-lease strategy.",
    kit: ["Zoning note", "FAR summary", "Price sheet"],
  },
  "airport-belt-land-parcel-derabassi": {
    commission: "2% + aggregation bonus",
    mandateType: "Exclusive Mandate",
    validity: "Till 31 Dec 2026",
    investorNote: "Contiguous acreage for land-banking syndicates; 1-acre minimum.",
    kit: ["Parcel map", "Corridor report", "Drone footage"],
  },
  "high-street-retail-booth-zirakpur": {
    commission: "2.5%",
    mandateType: "Verified Mandate",
    validity: "Open",
    investorNote: "Tenanted day-one yield; lowest-ticket commercial on the network.",
    urgent: true,
    kit: ["Rent sheet", "Tenancy summary", "Photos"],
  },
  "boutique-floor-plots-chandigarh-periphery": {
    commission: "2%",
    mandateType: "Verified Mandate",
    validity: "Till 30 Sep 2026",
    investorNote: "OC-received ready stock — leasing or self-use immediately.",
    kit: ["Brochure", "Floor plan", "Creatives ×4"],
  },
};

const CREATIVES = [
  { title: "Pre-Launch Teaser — Mohali Township", type: "Reel / Video", dealSlug: "early-stage-township-entry-mohali", status: "Ready", hue: 96 },
  { title: "New Chandigarh Plots — Investor Cut", type: "Walkthrough", dealSlug: "premium-residential-plot-new-chandigarh", status: "Ready", hue: 152 },
  { title: "Kharar Cluster — WhatsApp Pack (6)", type: "WhatsApp Creative", dealSlug: "growth-corridor-plot-cluster-kharar", status: "Ready", hue: 38 },
  { title: "Zirakpur SCO — Footfall Reel", type: "Reel / Video", dealSlug: "commercial-pocket-deal-zirakpur", status: "Ready", hue: 210 },
  { title: "Airport Belt Acreage — Drone Film", type: "Walkthrough", dealSlug: "airport-belt-land-parcel-derabassi", status: "In Production", hue: 200 },
  { title: "Panchkula Park-Facing — Brochure", type: "Brochure", dealSlug: "premium-sector-plot-panchkula", status: "Ready", hue: 268 },
];

async function main() {
  console.log(`Cutting over static content into the database (${config.host}/${config.database})...`);

  for (const d of DEALS) {
    await prisma.deal.upsert({
      where: { slug: d.slug },
      create: {
        slug: d.slug,
        title: d.title,
        subtitle: d.subtitle,
        city: d.city,
        cityLabel: d.cityLabel,
        microLocation: d.microLocation,
        type: d.type,
        purpose: d.purpose,
        status: d.status,
        badges: d.badges,
        price: d.price,
        priceMax: d.priceMax ?? null,
        pricePerUnit: d.pricePerUnit,
        unit: d.unit,
        benchmarkPerUnit: d.benchmarkPerUnit,
        sizes: d.sizes,
        areaLabel: d.areaLabel,
        facing: d.facing ?? null,
        roadWidth: d.roadWidth ?? null,
        possession: d.possession,
        approval: d.approval,
        score: d.score,
        upsideNote: d.upsideNote,
        highlights: d.highlights,
        whyStandsOut: d.whyStandsOut,
        locationAdvantages: d.locationAdvantages,
        demandDrivers: d.demandDrivers,
        suitsWho: d.suitsWho,
        overview: d.overview,
        bookingAmount: d.bookingAmount ?? null,
        featured: !!d.featured,
        hot: !!d.hot,
        investorPick: !!d.investorPick,
        newListing: !!d.newListing,
        mapX: d.mapX,
        mapY: d.mapY,
        hue: d.hue,
        faqs: d.faqs,
      },
      update: {},
    });
  }
  console.log(`  deals: ${DEALS.length}`);

  for (const [slug, m] of Object.entries(MANDATES)) {
    const deal = await prisma.deal.findUnique({ where: { slug } });
    if (!deal) continue;
    await prisma.mandate.upsert({
      where: { dealId: deal.id },
      create: {
        dealId: deal.id,
        commission: m.commission,
        mandateType: m.mandateType,
        validity: m.validity,
        investorNote: m.investorNote,
        urgent: !!m.urgent,
        kit: m.kit,
      },
      update: {},
    });
  }
  console.log(`  mandates: ${Object.keys(MANDATES).length}`);

  for (const l of LOCATIONS) {
    await prisma.locationZone.upsert({
      where: { slug: l.slug },
      create: {
        slug: l.slug,
        name: l.name,
        tagline: l.tagline,
        overview: l.overview,
        maturity: l.maturity,
        growthScore: l.growthScore,
        priceBand: l.priceBand,
        avgPerSqYd: l.avgPerSqYd,
        idealBuyer: l.idealBuyer,
        whyBuy: l.whyBuy,
        connectivity: l.connectivity,
        trend: l.trend,
        mapX: l.mapX,
        mapY: l.mapY,
        hue: l.hue,
      },
      update: {},
    });
  }
  console.log(`  locations: ${LOCATIONS.length}`);

  for (const p of POSTS) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        title: p.title,
        category: p.category,
        excerpt: p.excerpt,
        date: new Date(p.date),
        readMins: p.readMins,
        body: p.body,
        published: true,
      },
      update: {},
    });
  }
  console.log(`  posts: ${POSTS.length}`);

  const existingTestimonials = await prisma.testimonial.count();
  if (existingTestimonials === 0) {
    for (const [i, t] of TESTIMONIALS.entries()) {
      await prisma.testimonial.create({
        data: { quote: t.quote, name: t.name, context: t.context, order: i },
      });
    }
  }
  console.log(`  testimonials: ${TESTIMONIALS.length}`);

  for (const c of CREATIVES) {
    const deal = await prisma.deal.findUnique({ where: { slug: c.dealSlug } });
    const exists = await prisma.creative.findFirst({ where: { title: c.title } });
    if (exists) continue;
    await prisma.creative.create({
      data: { title: c.title, type: c.type, status: c.status, hue: c.hue, dealId: deal?.id ?? null },
    });
  }
  console.log(`  creatives: ${CREATIVES.length}`);

  console.log("Content cutover complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
