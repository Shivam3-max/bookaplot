import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";
import { getDatabaseConfig } from "../src/lib/database-config.ts";

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

// Production seed: creates only the admin account from env vars. No demo
// CPs/investors/asks - real accounts come from real registrations.
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
