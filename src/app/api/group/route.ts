import { getUserBySession } from "@/service/user/userService";
import { NextRequest, NextResponse } from "next/server";
import { createGroup, getUserGroups } from "@/service/group/groupService";
import { CreateGroupRequestDTO } from "@/service/group/dto/createGroupRequest.dto";
import { getUserIdOr401 } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("sessionId")?.value;
    if (!sessionId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await getUserBySession(sessionId);

    const body = (await req.json()) as CreateGroupRequestDTO;
    const group = await createGroup(body, user);
    return Response.json({ group }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdOr401(req);

    const groups = await getUserGroups(userId);
    return NextResponse.json({ groups }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
