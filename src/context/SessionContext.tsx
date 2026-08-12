"use client";

import { createContext, useContext, ReactNode } from "react";
import type { CurrentUser } from "@/lib/dal";

const Ctx = createContext<CurrentUser | null | undefined>(undefined);

export function SessionProvider({ user, children }: { user: CurrentUser | null; children: ReactNode }) {
  return <Ctx.Provider value={user}>{children}</Ctx.Provider>;
}

/** The signed-in user (CP, Investor or Admin), or null if signed out. */
export function useCurrentUser() {
  const ctx = useContext(Ctx);
  if (ctx === undefined) throw new Error("useCurrentUser outside SessionProvider");
  return ctx;
}
