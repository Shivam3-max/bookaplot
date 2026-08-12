import "server-only";
import crypto from "crypto";
import mysql, { Pool } from "mysql2/promise";
import { getDatabaseConfig } from "@/lib/database-config";
import type {
  AskStatus,
  AskWithRelations,
  AuthUser,
  PartnerStatus,
  PublicUser,
  Role,
} from "@/lib/db-types";

declare global {
  // eslint-disable-next-line no-var
  var __bookaplotPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __bookaplotInit: Promise<void> | undefined;
}

type SqlArg = string | number | null;
type QueryInput = { sql: string; args?: SqlArg[] };

const CONNECTION_LIMIT = Number(process.env.MYSQL_CONNECTION_LIMIT ?? 5);

function makePool() {
  const config = getDatabaseConfig();
  return mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: CONNECTION_LIMIT,
    connectTimeout: 10_000,
    dateStrings: false,
  });
}

function pool() {
  if (!global.__bookaplotPool) {
    global.__bookaplotPool = makePool();
  }
  return global.__bookaplotPool;
}

async function execute<T>(query: string | QueryInput): Promise<T[]> {
  const sql = typeof query === "string" ? query : query.sql;
  const args = typeof query === "string" ? [] : (query.args ?? []);
  const [rows] = await pool().query(sql, args);
  return rows as T[];
}

async function transaction(stmts: QueryInput[]) {
  const conn = await pool().getConnection();
  try {
    await conn.beginTransaction();
    for (const stmt of stmts) {
      await conn.query(stmt.sql, stmt.args ?? []);
    }
    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

async function initSchema() {
  await transaction([
    {
      sql: `CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(191) NOT NULL,
        role ENUM('CP', 'INVESTOR', 'ADMIN') NOT NULL,
        name VARCHAR(191) NOT NULL,
        phone VARCHAR(191) NOT NULL,
        email VARCHAR(191) NULL,
        passwordHash VARCHAR(191) NOT NULL,
        firm VARCHAR(191) NULL,
        territory VARCHAR(191) NULL,
        budget VARCHAR(191) NULL,
        interest VARCHAR(191) NULL,
        status ENUM('PENDING', 'VERIFIED', 'TERRITORY_LOCKED') NOT NULL DEFAULT 'PENDING',
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        UNIQUE KEY users_phone_key (phone),
        UNIQUE KEY users_email_key (email),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS asks (
        id VARCHAR(191) NOT NULL,
        investorId VARCHAR(191) NOT NULL,
        budget VARCHAR(191) NOT NULL,
        type VARCHAR(191) NOT NULL,
        locations VARCHAR(191) NOT NULL,
        urgency VARCHAR(191) NOT NULL,
        note TEXT NOT NULL,
        status ENUM('OPEN', 'PLATFORM_REVERTED', 'MATCHED') NOT NULL DEFAULT 'OPEN',
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        INDEX asks_investorId_idx (investorId),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS ask_replies (
        id VARCHAR(191) NOT NULL,
        askId VARCHAR(191) NOT NULL,
        authorId VARCHAR(191) NULL,
        text TEXT NOT NULL,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        INDEX ask_replies_askId_idx (askId),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS creative_requests (
        id VARCHAR(191) NOT NULL,
        userId VARCHAR(191) NOT NULL,
        title VARCHAR(191) NOT NULL,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        INDEX creative_requests_userId_idx (userId),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    },
    {
      sql: `CREATE TABLE IF NOT EXISTS seller_submissions (
        id VARCHAR(191) NOT NULL,
        name VARCHAR(191) NOT NULL,
        phone VARCHAR(191) NOT NULL,
        propertyDetail VARCHAR(191) NOT NULL,
        expectedPrice VARCHAR(191) NULL,
        status ENUM('PENDING_REVIEW', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING_REVIEW',
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    },
  ]);
}

async function ready() {
  if (!global.__bookaplotInit) {
    global.__bookaplotInit = initSchema();
  }
  await global.__bookaplotInit;
}

function makeId() {
  return crypto.randomUUID().replace(/-/g, "");
}

function mapPublicUser(row: Record<string, unknown>): PublicUser {
  return {
    id: String(row.id),
    role: row.role as Role,
    name: String(row.name),
    phone: String(row.phone),
    email: (row.email as string | null) ?? null,
    firm: (row.firm as string | null) ?? null,
    territory: (row.territory as string | null) ?? null,
    budget: (row.budget as string | null) ?? null,
    interest: (row.interest as string | null) ?? null,
    status: row.status as PartnerStatus,
    createdAt: row.createdAt as Date,
  };
}

export async function getPublicUserById(id: string) {
  await ready();
  const rows = await execute<Record<string, unknown>>({
    sql: `SELECT id, role, name, phone, email, firm, territory, budget, interest, status, createdAt
          FROM users WHERE id = ? LIMIT 1`,
    args: [id],
  });
  return rows[0] ? mapPublicUser(rows[0]) : null;
}

export async function createUser(input: {
  role: Exclude<Role, "ADMIN"> | "ADMIN";
  name: string;
  phone: string;
  passwordHash: string;
  firm?: string | null;
  territory?: string | null;
  budget?: string | null;
  interest?: string | null;
  email?: string | null;
  status?: PartnerStatus;
}) {
  await ready();
  const id = makeId();
  await execute({
    sql: `INSERT INTO users (id, role, name, phone, email, passwordHash, firm, territory, budget, interest, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      input.role,
      input.name,
      input.phone,
      input.email ?? null,
      input.passwordHash,
      input.firm ?? null,
      input.territory ?? null,
      input.budget ?? null,
      input.interest ?? null,
      input.status ?? "PENDING",
    ],
  });
  return (await getPublicUserById(id))!;
}

export async function findAuthUserByPhone(phone: string) {
  await ready();
  const rows = await execute<Record<string, unknown>>({
    sql: `SELECT id, role, phone, passwordHash FROM users WHERE phone = ? LIMIT 1`,
    args: [phone],
  });
  if (!rows[0]) return null;
  return {
    id: String(rows[0].id),
    role: rows[0].role as Role,
    phone: String(rows[0].phone),
    passwordHash: String(rows[0].passwordHash),
  } satisfies AuthUser;
}

export async function listPartners() {
  await ready();
  const rows = await execute<Record<string, unknown>>(
    `SELECT id, role, name, phone, email, firm, territory, budget, interest, status, createdAt
     FROM users WHERE role IN ('CP', 'INVESTOR') ORDER BY createdAt DESC`
  );
  return rows.map(mapPublicUser);
}

export async function countUsers(filters?: { role?: Role; roles?: Role[]; status?: PartnerStatus }) {
  await ready();
  const clauses: string[] = [];
  const args: SqlArg[] = [];
  if (filters?.role) {
    clauses.push("role = ?");
    args.push(filters.role);
  }
  if (filters?.roles?.length) {
    clauses.push(`role IN (${filters.roles.map(() => "?").join(", ")})`);
    args.push(...filters.roles);
  }
  if (filters?.status) {
    clauses.push("status = ?");
    args.push(filters.status);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const rows = await execute<{ count: number }>({
    sql: `SELECT COUNT(*) as count FROM users ${where}`,
    args,
  });
  return Number(rows[0]?.count ?? 0);
}

export async function countAsks(status?: AskStatus) {
  await ready();
  const rows = await execute<{ count: number }>(
    status
      ? { sql: "SELECT COUNT(*) as count FROM asks WHERE status = ?", args: [status] }
      : "SELECT COUNT(*) as count FROM asks"
  );
  return Number(rows[0]?.count ?? 0);
}

export async function listAsks() {
  await ready();
  const askRows = await execute<Record<string, unknown>>(
    `SELECT a.id, a.investorId, a.budget, a.type, a.locations, a.urgency, a.note, a.status, a.createdAt, u.name AS investorName
     FROM asks a
     INNER JOIN users u ON u.id = a.investorId
     ORDER BY a.createdAt DESC`
  );
  const replyRows = await execute<Record<string, unknown>>(
    `SELECT id, askId, authorId, text, createdAt FROM ask_replies ORDER BY createdAt ASC`
  );
  const repliesByAsk = new Map<string, AskWithRelations["replies"]>();
  for (const row of replyRows) {
    const askId = String(row.askId);
    const list = repliesByAsk.get(askId) ?? [];
    list.push({
      id: String(row.id),
      askId,
      authorId: (row.authorId as string | null) ?? null,
      text: String(row.text),
      createdAt: row.createdAt as Date,
    });
    repliesByAsk.set(askId, list);
  }
  return askRows.map(
    (row) =>
      ({
        id: String(row.id),
        investorId: String(row.investorId),
        budget: String(row.budget),
        type: String(row.type),
        locations: String(row.locations),
        urgency: String(row.urgency),
        note: String(row.note),
        status: row.status as AskStatus,
        createdAt: row.createdAt as Date,
        investor: { name: String(row.investorName) },
        replies: repliesByAsk.get(String(row.id)) ?? [],
      }) satisfies AskWithRelations
  );
}

export async function createAsk(input: {
  investorId: string;
  budget: string;
  type: string;
  locations: string;
  urgency: string;
  note: string;
  initialReplyText: string;
}) {
  await ready();
  const askId = makeId();
  const replyId = makeId();
  await transaction([
    {
      sql: `INSERT INTO asks (id, investorId, budget, type, locations, urgency, note, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'OPEN')`,
      args: [askId, input.investorId, input.budget, input.type, input.locations, input.urgency, input.note],
    },
    {
      sql: `INSERT INTO ask_replies (id, askId, authorId, text) VALUES (?, ?, ?, ?)`,
      args: [replyId, askId, null, input.initialReplyText],
    },
  ]);
}

export async function replyToAskRecord(input: {
  askId: string;
  authorId: string;
  text: string;
  matched: boolean;
}) {
  await ready();
  await transaction([
    {
      sql: `INSERT INTO ask_replies (id, askId, authorId, text) VALUES (?, ?, ?, ?)`,
      args: [makeId(), input.askId, input.authorId, input.text],
    },
    {
      sql: `UPDATE asks SET status = ? WHERE id = ?`,
      args: [input.matched ? "MATCHED" : "PLATFORM_REVERTED", input.askId],
    },
  ]);
}

export async function updatePartnerStatus(userId: string, status: PartnerStatus, territory?: string) {
  await ready();
  if (territory !== undefined) {
    await execute({
      sql: `UPDATE users SET status = ?, territory = ? WHERE id = ?`,
      args: [status, territory || null, userId],
    });
    return;
  }
  await execute({
    sql: `UPDATE users SET status = ? WHERE id = ?`,
    args: [status, userId],
  });
}

export async function countCreativeRequests(userId: string) {
  await ready();
  const rows = await execute<{ count: number }>({
    sql: `SELECT COUNT(*) as count FROM creative_requests WHERE userId = ?`,
    args: [userId],
  });
  return Number(rows[0]?.count ?? 0);
}

export async function createCreativeRequest(userId: string, title: string) {
  await ready();
  await execute({
    sql: `INSERT INTO creative_requests (id, userId, title) VALUES (?, ?, ?)`,
    args: [makeId(), userId, title],
  });
}

export async function createSellerSubmission(input: {
  name: string;
  phone: string;
  propertyDetail: string;
  expectedPrice?: string | null;
}) {
  await ready();
  await execute({
    sql: `INSERT INTO seller_submissions (id, name, phone, propertyDetail, expectedPrice)
          VALUES (?, ?, ?, ?, ?)`,
    args: [makeId(), input.name, input.phone, input.propertyDetail, input.expectedPrice ?? null],
  });
}
