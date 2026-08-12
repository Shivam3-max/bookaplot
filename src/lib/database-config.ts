export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

function normalizeHost(host: string) {
  return host === "127.0.0.1" ? "localhost" : host;
}

export function getDatabaseConfig(): DatabaseConfig {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;
  const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

  if (host && user && password !== undefined && database) {
    return {
      host: normalizeHost(host),
      port,
      user,
      password,
      database,
    };
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL or DB_HOST/DB_USER/DB_PASSWORD/DB_NAME is required.");
  }

  const url = new URL(databaseUrl);

  return {
    host: normalizeHost(url.hostname),
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
  };
}
