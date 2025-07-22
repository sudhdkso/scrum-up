import { NextRequest, NextResponse } from "next/server";
import { getUserIdBySession } from "@/service/user/userService";

export async function getUserIdOr401(req: NextRequest) {
  const sessionId = req.cookies.get("sessionId")?.value;
  if (!sessionId) throw new Error("401");
  const userId = await getUserIdBySession(sessionId);
  if (!userId) throw new Error("401");
  return userId;
}
