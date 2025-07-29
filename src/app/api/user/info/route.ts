import dbConnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getUserBySession, getUserInfo } from "@/services/user/userService";
import { getUserIdOr401 } from "@/lib/auth";

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

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdOr401(req);
    const user = await getUserInfo(userId);
    console.log("user", user);
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
