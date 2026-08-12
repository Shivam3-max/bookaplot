import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { getDatabaseConfig } from "@/lib/database-config";

export async function GET() {
  const envPresent = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    DB_HOST: !!process.env.DB_HOST,
    DB_PORT: !!process.env.DB_PORT,
    DB_USER: !!process.env.DB_USER,
    DB_PASSWORD: !!process.env.DB_PASSWORD,
    DB_NAME: !!process.env.DB_NAME,
  };

  try {
    const config = getDatabaseConfig();
    const conn = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      connectTimeout: 8000,
    });
    await conn.query("SELECT 1");
    await conn.end();

    return NextResponse.json({
      ok: true,
      envPresent,
      resolvedHost: config.host,
      resolvedPort: config.port,
      database: config.database,
    });
  } catch (error) {
    const err = error as {
      code?: string;
      errno?: number;
      sqlMessage?: string;
      message?: string;
    };

    return NextResponse.json(
      {
        ok: false,
        envPresent,
        error: {
          code: err.code,
          errno: err.errno,
          message: err.sqlMessage || err.message,
        },
      },
      { status: 500 }
    );
  }
}
