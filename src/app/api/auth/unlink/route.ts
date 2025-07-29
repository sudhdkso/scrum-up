import dbConnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { unlink } from "@/services/auth/authService";
import { deleteSession } from "@/lib/session";
import { getUserIdOr401 } from "@/lib/auth";

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getUserIdOr401(req);
    const sessionId = req.cookies.get("sessionId")?.value;

    if (!sessionId) {
      console.log("sessionId 없음");
      throw new Error("401");
    }
    await deleteSession(sessionId);
    const id = await unlink(userId);
    const response = NextResponse.json({ ok: true });

    response.cookies.set("sessionId", "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
