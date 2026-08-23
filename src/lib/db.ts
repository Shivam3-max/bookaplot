import "server-only";
import mysql, { Pool, ResultSetHeader } from "mysql2/promise";
import { getDatabaseConfig } from "@/lib/database-config";
import type {
  AskStatus,
  AskWithRelations,
  AuthUser,
  PartnerStatus,
  PublicUser,
  Role,
  SellerSubmissionRecord,
  SubmissionStatus,
} from "@/lib/db-types";

declare global {
  // eslint-disable-next-line no-var
  var __bookaplotPool: Pool | undefined;
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

// For INSERT/UPDATE/DELETE statements - returns the affected-rows/insertId header.
async function run(query: QueryInput): Promise<ResultSetHeader> {
  const [result] = await pool().query<ResultSetHeader>(query.sql, query.args ?? []);
  return result;
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

function mapPublicUser(row: Record<string, unknown>): PublicUser {
  return {
    id: Number(row.id),
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
    updatedByName: (row.updatedByName as string | null) ?? null,
  };
}

export async function getPublicUserById(id: number) {
  const rows = await execute<Record<string, unknown>>({
    sql: `SELECT id, role, name, phone, email, firm, territory, budget, interest, status, createdAt
          FROM users WHERE id = ? AND deletedAt IS NULL LIMIT 1`,
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
  const result = await run({
    sql: `INSERT INTO users (role, name, phone, email, passwordHash, firm, territory, budget, interest, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
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
  return (await getPublicUserById(result.insertId))!;
}

export async function findAuthUserByPhone(phone: string) {
  const rows = await execute<Record<string, unknown>>({
    sql: `SELECT id, role, phone, passwordHash FROM users WHERE phone = ? AND deletedAt IS NULL LIMIT 1`,
    args: [phone],
  });
  if (!rows[0]) return null;
  return {
    id: Number(rows[0].id),
    role: rows[0].role as Role,
    phone: String(rows[0].phone),
    passwordHash: String(rows[0].passwordHash),
  } satisfies AuthUser;
}

export async function listPartners() {
  const rows = await execute<Record<string, unknown>>(
    `SELECT u.id, u.role, u.name, u.phone, u.email, u.firm, u.territory, u.budget, u.interest, u.status, u.createdAt,
            ub.name AS updatedByName
     FROM users u
     LEFT JOIN users ub ON ub.id = u.updatedById
     WHERE u.role IN ('CP', 'INVESTOR') AND u.deletedAt IS NULL ORDER BY u.createdAt DESC`
  );
  return rows.map(mapPublicUser);
}

export async function listAdmins() {
  const rows = await execute<Record<string, unknown>>(
    `SELECT id, name, phone, createdAt FROM users WHERE role = 'ADMIN' AND deletedAt IS NULL ORDER BY createdAt ASC`
  );
  return rows.map((row) => ({
    id: Number(row.id),
    name: String(row.name),
    phone: String(row.phone),
    createdAt: row.createdAt as Date,
  }));
}

export async function countUsers(filters?: { role?: Role; roles?: Role[]; status?: PartnerStatus }) {
  const clauses: string[] = ["deletedAt IS NULL"];
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
  const rows = await execute<{ count: number }>({
    sql: `SELECT COUNT(*) as count FROM users WHERE ${clauses.join(" AND ")}`,
    args,
  });
  return Number(rows[0]?.count ?? 0);
}

export async function countAsks(status?: AskStatus) {
  const clauses = ["deletedAt IS NULL"];
  const args: SqlArg[] = [];
  if (status) {
    clauses.push("status = ?");
    args.push(status);
  }
  const rows = await execute<{ count: number }>({
    sql: `SELECT COUNT(*) as count FROM asks WHERE ${clauses.join(" AND ")}`,
    args,
  });
  return Number(rows[0]?.count ?? 0);
}

export async function listAsks() {
  const askRows = await execute<Record<string, unknown>>(
    `SELECT a.id, a.investorId, a.budget, a.type, a.locations, a.urgency, a.note, a.status, a.createdAt, u.name AS investorName
     FROM asks a
     INNER JOIN users u ON u.id = a.investorId
     WHERE a.deletedAt IS NULL
     ORDER BY a.createdAt DESC`
  );
  const replyRows = await execute<Record<string, unknown>>(
    `SELECT id, askId, authorId, text, createdAt FROM ask_replies ORDER BY createdAt ASC`
  );
  const repliesByAsk = new Map<number, AskWithRelations["replies"]>();
  for (const row of replyRows) {
    const askId = Number(row.askId);
    const list = repliesByAsk.get(askId) ?? [];
    list.push({
      id: Number(row.id),
      askId,
      authorId: row.authorId === null ? null : Number(row.authorId),
      text: String(row.text),
      createdAt: row.createdAt as Date,
    });
    repliesByAsk.set(askId, list);
  }
  return askRows.map(
    (row) =>
      ({
        id: Number(row.id),
        investorId: Number(row.investorId),
        budget: String(row.budget),
        type: String(row.type),
        locations: String(row.locations),
        urgency: String(row.urgency),
        note: String(row.note),
        status: row.status as AskStatus,
        createdAt: row.createdAt as Date,
        investor: { name: String(row.investorName) },
        replies: repliesByAsk.get(Number(row.id)) ?? [],
      }) satisfies AskWithRelations
  );
}

export async function createAsk(input: {
  investorId: number;
  budget: string;
  type: string;
  locations: string;
  urgency: string;
  note: string;
  initialReplyText: string;
}) {
  const conn = await pool().getConnection();
  try {
    await conn.beginTransaction();
    const [askResult] = await conn.query<ResultSetHeader>(
      `INSERT INTO asks (investorId, budget, type, locations, urgency, note, status)
       VALUES (?, ?, ?, ?, ?, ?, 'OPEN')`,
      [input.investorId, input.budget, input.type, input.locations, input.urgency, input.note]
    );
    await conn.query(
      `INSERT INTO ask_replies (askId, authorId, text) VALUES (?, ?, ?)`,
      [askResult.insertId, null, input.initialReplyText]
    );
    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

export async function replyToAskRecord(input: {
  askId: number;
  authorId: number;
  text: string;
  matched: boolean;
}) {
  await transaction([
    {
      sql: `INSERT INTO ask_replies (askId, authorId, text) VALUES (?, ?, ?)`,
      args: [input.askId, input.authorId, input.text],
    },
    {
      sql: `UPDATE asks SET status = ? WHERE id = ?`,
      args: [input.matched ? "MATCHED" : "PLATFORM_REVERTED", input.askId],
    },
  ]);
}

export async function updatePartnerStatus(userId: number, status: PartnerStatus, territory: string | undefined, updatedById: number) {
  if (territory !== undefined) {
    await run({
      sql: `UPDATE users SET status = ?, territory = ?, updatedById = ? WHERE id = ?`,
      args: [status, territory || null, updatedById, userId],
    });
    return;
  }
  await run({
    sql: `UPDATE users SET status = ?, updatedById = ? WHERE id = ?`,
    args: [status, updatedById, userId],
  });
}

export async function countCreativeRequests(userId: number) {
  const rows = await execute<{ count: number }>({
    sql: `SELECT COUNT(*) as count FROM creative_requests WHERE userId = ?`,
    args: [userId],
  });
  return Number(rows[0]?.count ?? 0);
}

export async function createCreativeRequest(userId: number, title: string) {
  await run({
    sql: `INSERT INTO creative_requests (userId, title) VALUES (?, ?)`,
    args: [userId, title],
  });
}

export async function createSellerSubmission(input: {
  name: string;
  phone: string;
  propertyDetail: string;
  expectedPrice?: string | null;
}) {
  await run({
    sql: `INSERT INTO seller_submissions (name, phone, propertyDetail, expectedPrice)
          VALUES (?, ?, ?, ?)`,
    args: [input.name, input.phone, input.propertyDetail, input.expectedPrice ?? null],
  });
}

export async function listSellerSubmissions(): Promise<SellerSubmissionRecord[]> {
  const rows = await execute<Record<string, unknown>>(
    `SELECT s.id, s.name, s.phone, s.propertyDetail, s.expectedPrice, s.status, s.createdAt, u.name AS updatedByName
     FROM seller_submissions s
     LEFT JOIN users u ON u.id = s.updatedById
     WHERE s.deletedAt IS NULL ORDER BY s.createdAt DESC`
  );
  return rows.map((row) => ({
    id: Number(row.id),
    name: String(row.name),
    phone: String(row.phone),
    propertyDetail: String(row.propertyDetail),
    expectedPrice: (row.expectedPrice as string | null) ?? null,
    status: row.status as SubmissionStatus,
    createdAt: row.createdAt as Date,
    updatedByName: (row.updatedByName as string | null) ?? null,
  }));
}

export async function countSellerSubmissions(status?: SubmissionStatus) {
  const clauses = ["deletedAt IS NULL"];
  const args: SqlArg[] = [];
  if (status) {
    clauses.push("status = ?");
    args.push(status);
  }
  const rows = await execute<{ count: number }>({
    sql: `SELECT COUNT(*) as count FROM seller_submissions WHERE ${clauses.join(" AND ")}`,
    args,
  });
  return Number(rows[0]?.count ?? 0);
}

export async function updateSellerSubmissionStatus(id: number, status: SubmissionStatus, updatedById: number) {
  await run({
    sql: `UPDATE seller_submissions SET status = ?, updatedById = ? WHERE id = ?`,
    args: [status, updatedById, id],
  });
}
