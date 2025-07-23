import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import { getUserIdBySessionId } from "@/lib/session";

export async function getUserBySession(sessionId: string) {
  await dbConnect();
  const userId = await getUserIdBySessionId(sessionId);
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(userId);
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  return user;
}

export async function getUserIdBySession(sessionId: string) {
  return getUserIdBySessionId(sessionId);
}
