import dbConnect from "@/lib/mongodb";
import User from "@/models/user";
import { NextRequest } from "next/server";
import { getUserIdBySessionId } from "@/lib/session";

export async function POST(req: NextRequest) {
  await dbConnect();
  console.log("start");

  const sessionId = req.cookies.get("sessionId")?.value;
  if (!sessionId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.log("sessionId", sessionId);

  const userId = await getUserIdBySessionId(sessionId);
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("userId", userId);
  const user = await User.findById(userId);
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  console.log("user" + user);
  return Response.json({
    id: user._id,
    name: user.name,
    email: user.email,
  });
}
