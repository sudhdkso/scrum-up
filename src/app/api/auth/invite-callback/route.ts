import { NextRequest, NextResponse } from "next/server";
import { login } from "@/service/auth/authService";
import { saveSession } from "@/lib/session";
import { joinGroup } from "@/service/group/groupService";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    if (!code || !state)
      return NextResponse.json({ error: "Not found code" }, { status: 400 });

    const { user, sessionId, error } = await login(code, true);
    if (!user || error)
      return NextResponse.json({ error: error }, { status: 400 });

    await joinGroup(state, user);

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
