import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

const COOKIE_NAME = "mondato_session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await decrypt(request.cookies.get(COOKIE_NAME)?.value);

  const isPortal = pathname.startsWith("/portal");
  const isAdmin = pathname.startsWith("/admin");
  const isLogin = pathname === "/login";

  if ((isPortal || isAdmin) && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAdmin && session && session.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isLogin && session) {
    return NextResponse.redirect(new URL(session.role === "ADMIN" ? "/admin" : "/portal", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*", "/login"],
};
