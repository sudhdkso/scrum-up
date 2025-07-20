// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  if (
    url.pathname.startsWith("/api/user/auth") ||
    url.pathname.startsWith("/public") ||
    url.pathname.startsWith("/style") ||
    url.pathname.startsWith("/_next") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".svg") ||
    url.pathname === "/" // 로그인 페이지가 / 이면 여기에 포함
  ) {
    return NextResponse.next();
  }

  const sessionIdCookie = req.cookies.get("sessionId");
  const sessionId = sessionIdCookie ? sessionIdCookie.value : undefined;
  if (!sessionId) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
