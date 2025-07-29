import dbConnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { changeNotificationOn, getUserInfo } from "@/services/user/userService";
import { getUserIdOr401 } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const userId = await getUserIdOr401(req);
    const user = await changeNotificationOn(userId, body.notificationOn);
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
