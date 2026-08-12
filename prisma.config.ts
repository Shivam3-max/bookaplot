import "dotenv/config";
import { defineConfig } from "prisma/config";

const fallbackDatabaseUrl = "mysql://root@127.0.0.1:3306/mondato";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node --experimental-strip-types prisma/seed.ts",
  },
  datasource: {
    // `prisma generate` only needs a syntactically valid datasource URL.
    // Falling back here keeps install/build steps from failing before Vercel
    // injects runtime environment variables.
    url: process.env.DATABASE_URL ?? fallbackDatabaseUrl,
  },
});
