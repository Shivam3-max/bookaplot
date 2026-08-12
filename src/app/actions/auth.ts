"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";

export interface FormState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
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
): Promise<FormState | never> {
  const passwordHash = await bcrypt.hash(data.password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        role,
        name: data.name,
        phone: data.phone,
        passwordHash,
        firm: data.firm || undefined,
        territory: data.territory || undefined,
        budget: data.budget || undefined,
        interest: data.interest || undefined,
      },
    });
    await createSession(user.id, user.role);
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
      return { error: "An account with that phone number already exists. Try signing in instead." };
    }
    throw err;
  }
  redirect("/portal");
}

export async function registerCp(_prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  const parsed = cpSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    firm: formData.get("firm"),
    territory: formData.get("territory"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  return createAccount({ ...parsed.data }, "CP");
}

export async function registerInvestor(_prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  const parsed = investorSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    budget: formData.get("budget"),
    interest: formData.get("interest"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  return createAccount({ ...parsed.data }, "INVESTOR");
}

export async function login(_prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    phone: formData.get("phone"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const user = await prisma.user.findUnique({ where: { phone: parsed.data.phone } });
  if (!user) return { error: "No account found with that phone number." };

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) return { error: "Incorrect password." };

  await createSession(user.id, user.role);
  redirect(user.role === "ADMIN" ? "/admin" : "/portal");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
