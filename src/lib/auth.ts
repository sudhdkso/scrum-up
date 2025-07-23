import { NextRequest } from "next/server";
import {
  getUserIdBySession,
  getUserBySession,
} from "@/service/user/userService";

export async function getUserIdOr401(req: NextRequest) {
  const sessionId = req.cookies.get("sessionId")?.value;
  if (!sessionId) throw new Error("401");
  const userId = await getUserIdBySession(sessionId);
  if (!userId) throw new Error("401");
  return userId;
}

export async function getUserOr401(req: NextRequest) {
  const sessionId = req.cookies.get("sessionId")?.value;
  if (!sessionId) throw new Error("401");
  const user = await getUserBySession(sessionId);
  if (!user) throw new Error("401");
  return user;
}
