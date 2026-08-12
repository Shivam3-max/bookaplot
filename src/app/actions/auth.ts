"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";
import {
  type FormState,
  loginFromFormData,
  registerCpFromFormData,
  registerInvestorFromFormData,
} from "@/lib/auth-service";

export type { FormState } from "@/lib/auth-service";

export async function registerCp(_prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  const result = await registerCpFromFormData(formData);
  if (!result.ok) return result.state;

  await createSession(result.user.id, result.user.role);
  redirect("/portal");
}

export async function registerInvestor(_prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  const result = await registerInvestorFromFormData(formData);
  if (!result.ok) return result.state;

  await createSession(result.user.id, result.user.role);
  redirect("/portal");
}

export async function login(_prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  const result = await loginFromFormData(formData);
  if (!result.ok) return result.state;

  await createSession(result.user.id, result.user.role);
  redirect(result.user.role === "ADMIN" ? "/admin" : "/portal");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
