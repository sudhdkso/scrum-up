// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  if (
    url.pathname.startsWith("/api/user/auth") ||
    url.pathname.startsWith("/public") ||
    url.pathname.startsWith("/style") ||
    url.pathname.startsWith("/_next") || // Next.js 정적 리소스
    url.pathname === "/" // 로그인 페이지가 / 이면 여기에 포함
  ) {
    return NextResponse.next();
  }

  const sessionIdCookie = req.cookies.get("sessionId");
  const sessionId = sessionIdCookie ? sessionIdCookie.value : undefined;
  console.log(
    "미들웨어",
    req.method,
    req.nextUrl.pathname,
    "sessionId:",
    sessionId
  );
  if (!sessionId) {
    console.log("설마 여기 타니?", req.method, req.nextUrl.pathname, sessionId);
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
