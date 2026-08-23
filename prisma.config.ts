import "dotenv/config";
import { defineConfig } from "prisma/config";
import { getDatabaseConfig } from "./src/lib/database-config.ts";

const fallbackDatabaseUrl = "mysql://root@127.0.0.1:3306/mondato";

function resolveDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  // Build the real URL from DB_HOST/DB_USER/DB_PASSWORD/DB_NAME - the same
  // source of truth the app's Prisma client and mysql2 pool use at runtime
  // (src/lib/prisma.ts, src/lib/db.ts). Without this, `prisma migrate deploy`
  // silently targets the placeholder fallback below instead of the real
  // database, since it never went through getDatabaseConfig().
  try {
    const c = getDatabaseConfig();
    return `mysql://${encodeURIComponent(c.user)}:${encodeURIComponent(c.password)}@${c.host}:${c.port}/${c.database}`;
  } catch {
    // `prisma generate` only needs a syntactically valid datasource URL.
    // Falling back here keeps install/build steps from failing before
    // runtime environment variables are injected.
    return fallbackDatabaseUrl;
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node --experimental-strip-types prisma/seed.ts",
  },
  datasource: {
    url: resolveDatabaseUrl(),
  },
});
