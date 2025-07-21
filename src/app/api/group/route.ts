import {
  getUserBySession,
  getUserIdBySession,
} from "@/service/user/userService";
import { NextRequest, NextResponse } from "next/server";
import { createGroup, getUserGroups } from "@/service/group/groupService";
import { CreateGroupRequestDTO } from "@/service/group/dto/createGroupRequest.dto";

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
    const sessionId = req.cookies.get("sessionId")?.value;
    if (!sessionId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = await getUserIdBySession(sessionId);
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const groups = await getUserGroups(userId);
    return NextResponse.json({ groups }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
