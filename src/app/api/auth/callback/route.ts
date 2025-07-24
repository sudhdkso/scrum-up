import { NextRequest, NextResponse } from "next/server";
import { login } from "@/services/auth/authService";
import { saveSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "No code or state parameter" },
        { status: 400 }
      );
    }

    const { user, sessionId, error } = await login(code);

    if (!user || error) {
      return NextResponse.json({ error: error }, { status: 400 });
    }

    console.log("사용자 로그인 성공! id=", sessionId);
    await saveSession(sessionId, user._id.toString());

    const response = NextResponse.redirect(new URL("/dashboard", req.url));

    response.cookies.set("sessionId", sessionId, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return response;
  } catch (error) {
    console.error("Kakao Auth Error:", error);
    return NextResponse.json({ error: "Kakao 인증 실패" }, { status: 500 });
  }
}
