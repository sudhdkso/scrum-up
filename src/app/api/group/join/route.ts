import dbConnect from "@/lib/mongodb";
import { getUserBySession } from "@/services/user/userService";
import { NextRequest, NextResponse } from "next/server";
import { joinGroup } from "@/services/groupMember/joinGroup.service";
import { getUserOr401 } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    if (!code) {
      return NextResponse.json({ error: "Not found code" }, { status: 404 });
    }
    const user = await getUserOr401(req);
    const joinRes = await joinGroup(code, user);
    return NextResponse.json(
      {
        groupId: joinRes.groupId,
        alreadyMember: joinRes.alreadyMember,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
