import bcrypt from "bcryptjs";
import * as z from "zod";
import { createUser, findAuthUserByPhone } from "@/lib/db";
import type { Role } from "@/lib/db-types";

export interface FormState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export function getFormValue(formData: FormData, key: string) {
  const direct = formData.get(key);
  if (direct !== null) return direct;

  for (const [entryKey, value] of formData.entries()) {
    if (entryKey === key || entryKey.endsWith(`_${key}`)) {
      return value;
    }
  }

  return null;
}

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[a-zA-Z]/, "Password must contain a letter.")
  .regex(/[0-9]/, "Password must contain a number.");

const phoneSchema = z.string().trim().min(6, "Enter a valid phone number.");

const cpSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  phone: phoneSchema,
  firm: z.string().trim().optional(),
  territory: z.string().trim().min(1, "Select a territory."),
  password: passwordSchema,
});

const investorSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  phone: phoneSchema,
  budget: z.string().trim().min(1, "Select a budget band."),
  interest: z.string().trim().optional().nullable(),
  password: passwordSchema,
});

const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, "Enter your password."),
});

async function createAccount(
  data: { name: string; phone: string; password: string; firm?: string; territory?: string; budget?: string; interest?: string | null },
  role: "CP" | "INVESTOR"
): Promise<{ ok: true; user: { id: string; role: Role } } | { ok: false; state: FormState }> {
  const passwordHash = await bcrypt.hash(data.password, 10);
  try {
    const user = await createUser({
      role,
      name: data.name,
      phone: data.phone,
      passwordHash,
      firm: data.firm || null,
      territory: data.territory || null,
      budget: data.budget || null,
      interest: data.interest || null,
    });

    return { ok: true, user: { id: user.id, role: user.role } };
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && err.code === "ER_DUP_ENTRY") {
      return { ok: false, state: { error: "An account with that phone number already exists. Try signing in instead." } };
    }

    throw err;
  }
}

export async function registerCpFromFormData(
  formData: FormData
): Promise<{ ok: true; user: { id: string; role: Role } } | { ok: false; state: FormState }> {
  const parsed = cpSchema.safeParse({
    name: getFormValue(formData, "name"),
    phone: getFormValue(formData, "phone"),
    firm: getFormValue(formData, "firm"),
    territory: getFormValue(formData, "territory"),
    password: getFormValue(formData, "password"),
  });

  if (!parsed.success) {
    return { ok: false, state: { fieldErrors: parsed.error.flatten().fieldErrors } };
  }

  return createAccount({ ...parsed.data }, "CP");
}

export async function registerInvestorFromFormData(
  formData: FormData
): Promise<{ ok: true; user: { id: string; role: Role } } | { ok: false; state: FormState }> {
  const parsed = investorSchema.safeParse({
    name: getFormValue(formData, "name"),
    phone: getFormValue(formData, "phone"),
    budget: getFormValue(formData, "budget"),
    interest: getFormValue(formData, "interest"),
    password: getFormValue(formData, "password"),
  });

  if (!parsed.success) {
    return { ok: false, state: { fieldErrors: parsed.error.flatten().fieldErrors } };
  }

  return createAccount({ ...parsed.data }, "INVESTOR");
}

export async function loginFromFormData(
  formData: FormData
): Promise<{ ok: true; user: { id: string; role: Role } } | { ok: false; state: FormState }> {
  const parsed = loginSchema.safeParse({
    phone: getFormValue(formData, "phone"),
    password: getFormValue(formData, "password"),
  });

  if (!parsed.success) {
    return { ok: false, state: { fieldErrors: parsed.error.flatten().fieldErrors } };
  }

  const user = await findAuthUserByPhone(parsed.data.phone);

  if (!user) {
    return { ok: false, state: { error: "No account found with that phone number." } };
  }

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) {
    return { ok: false, state: { error: "Incorrect password." } };
  }

  return { ok: true, user: { id: user.id, role: user.role } };
}
