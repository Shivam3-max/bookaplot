import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getPublicUserById } from "@/lib/db";
import { getSessionPayload } from "@/lib/session";

/** Redirects to /login if there's no valid session. Memoized per request. */
export const verifySession = cache(async () => {
  const payload = await getSessionPayload();
  if (!payload?.userId) redirect("/login");
  return { userId: payload.userId, role: payload.role };
});

/** Like verifySession, but returns null instead of redirecting — for optional/optimistic reads. */
export const getOptionalSession = cache(async () => {
  const payload = await getSessionPayload();
  if (!payload?.userId) return null;
  return { userId: payload.userId, role: payload.role };
});

export type CurrentUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

/** Full current-user row (never includes passwordHash), or null if signed out. */
export const getCurrentUser = cache(async () => {
  const session = await getOptionalSession();
  if (!session) return null;
  return getPublicUserById(session.userId);
});

/** Like getCurrentUser, but redirects to /login if signed out. */
export async function requireUser() {
  const session = await verifySession();
  const user = await getPublicUserById(session.userId);
  if (!user) redirect("/login");
  return user;
}

/** Requires an ADMIN session; redirects non-admins back to the site. */
export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/");
  return user;
}

/** Requires a CP or INVESTOR session; redirects admins/public to appropriate places. */
export async function requirePartner() {
  const user = await requireUser();
  if (user.role === "ADMIN") redirect("/admin");
  return user;
}
