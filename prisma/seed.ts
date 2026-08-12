import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const DEMO_PASSWORD = "Demo1234"; // shared password for seeded demo CP/Investor accounts — dev only

async function main() {
  const adminPhone = process.env.ADMIN_SEED_PHONE || "+91 90000 00000";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || "ChangeMe123!";
  const adminName = process.env.ADMIN_SEED_NAME || "Mondato Admin";

  const admin = await prisma.user.upsert({
    where: { phone: adminPhone },
    update: {},
    create: {
      role: "ADMIN",
      name: adminName,
      phone: adminPhone,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      status: "VERIFIED",
    },
  });
  console.log(`Admin ready: ${admin.phone} (password from ADMIN_SEED_PASSWORD env — change after first login)`);

  const demoHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const cps = await Promise.all(
    [
      { name: "Harjit Dhillon", firm: "Dhillon Realty", phone: "+91 98761 00310", territory: "Kharar–Kurali Corridor", status: "TERRITORY_LOCKED" as const },
      { name: "Neeraj Khanna", firm: "Khanna Estates", phone: "+91 98140 00554", territory: "Zirakpur — VIP Road", status: "TERRITORY_LOCKED" as const },
      { name: "Simran Walia", firm: "Walia Associates", phone: "+91 99150 00208", territory: "New Chandigarh", status: "VERIFIED" as const },
      { name: "Rohit Bansal", firm: "RB Propmart", phone: "+91 98550 00871", territory: null, status: "PENDING" as const },
    ].map((c) =>
      prisma.user.upsert({
        where: { phone: c.phone },
        update: {},
        create: { role: "CP", name: c.name, firm: c.firm, phone: c.phone, territory: c.territory ?? undefined, status: c.status, passwordHash: demoHash },
      })
    )
  );

  const investors = await Promise.all(
    [
      { name: "Gurdeep Bajwa", phone: "+1 604 000 0118", budget: "₹1 – 1.5 Cr", status: "VERIFIED" as const },
      { name: "Ludhiana Syndicate", phone: "+91 98720 00990", budget: "₹3 – 5 Cr", status: "VERIFIED" as const },
    ].map((i) =>
      prisma.user.upsert({
        where: { phone: i.phone },
        update: {},
        create: { role: "INVESTOR", name: i.name, phone: i.phone, budget: i.budget, status: i.status, passwordHash: demoHash },
      })
    )
  );

  console.log(`Seeded ${cps.length} channel partners and ${investors.length} investors (shared demo password: ${DEMO_PASSWORD})`);

  const existingAsks = await prisma.ask.count();
  if (existingAsks === 0) {
    await prisma.ask.create({
      data: {
        investorId: investors[0].id,
        budget: "₹1.5 – 2 Cr",
        type: "Commercial frontage / SCO",
        locations: "Zirakpur, Mohali airport road",
        urgency: "Ready in 30 days",
        note: "Want tenanted or lease-ready frontage. Yield above 5% net preferred.",
        status: "PLATFORM_REVERTED",
        replies: {
          create: {
            authorId: admin.id,
            text: "Two sole-selling frontage assets match — Patiala Road SCO (tenant-ready) and a VIP Road booth with running tenancy at ~5.6% net. Sharing sheets on WhatsApp; site visit slots open this weekend.",
          },
        },
      },
    });
    await prisma.ask.create({
      data: {
        investorId: investors[1].id,
        budget: "₹3 – 5 Cr",
        type: "Land parcel / distress buy",
        locations: "Anywhere in Tricity influence zone",
        urgency: "Urgent — desperate deal wanted",
        note: "Cash-ready syndicate. Looking for distress or urgent-exit pricing, any asset class.",
        status: "PLATFORM_REVERTED",
        replies: {
          create: {
            authorId: admin.id,
            text: "Flagged to the desperate-deals desk. Current fits: Derabassi 4-acre contiguous at ~20% under zone benchmark (seller consolidating), and a Panchkula park-facing resale with a short decision window. Both sheets shared.",
          },
        },
      },
    });
    console.log("Seeded 2 demo Give & Ask threads.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
