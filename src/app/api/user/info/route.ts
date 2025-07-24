import dbConnect from "@/lib/mongodb";
import { NextRequest } from "next/server";
import { getUserBySession } from "@/services/user/userService";

export async function POST(req: NextRequest) {
  await dbConnect();

  const sessionId = req.cookies.get("sessionId")?.value;
  if (!sessionId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserBySession(sessionId);

  return Response.json({
    id: user._id,
    name: user.name,
    email: user.email,
  });
}
