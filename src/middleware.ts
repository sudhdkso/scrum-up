// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/public") ||
    pathname.startsWith("/style") ||
    pathname.startsWith("/_next") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".svg") ||
    pathname.startsWith("/invite") ||
    pathname.startsWith("/api/invite") ||
    pathname.startsWith("/login")
  ) {
    return NextResponse.next();
  }

  const sessionIdCookie = req.cookies.get("sessionId");
  const sessionId = sessionIdCookie ? sessionIdCookie.value : undefined;

  // 로그인 안한 사용자, 로그인 페이지가 아니면 로그인 페이지로 리다이렉트
  if (!sessionId && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 로그인한 사용자가 /login 또는 /로 오면 /dashboard로
  if (sessionId && (pathname === "/" || pathname === "/login")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}
