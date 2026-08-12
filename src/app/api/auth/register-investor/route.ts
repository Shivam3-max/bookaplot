import { NextResponse } from "next/server";
import { registerInvestorFromFormData } from "@/lib/auth-service";
import { COOKIE_NAME, SESSION_DURATION_MS, encrypt, getSessionCookieOptions } from "@/lib/session";

export async function POST(request: Request) {
  const formData = await request.formData();
  const result = await registerInvestorFromFormData(formData);

  if (!result.ok) {
    return NextResponse.json(result.state, { status: 400 });
  }

  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const token = await encrypt({ userId: result.user.id, role: result.user.role, expiresAt });
  const response = NextResponse.json({ redirectTo: "/portal" });
  response.cookies.set(COOKIE_NAME, token, getSessionCookieOptions(expiresAt));
  return response;
}
