import { getUserIdBySession } from "@/service/user/userService";
import { NextRequest, NextResponse } from "next/server";
import { getGroupDetailById } from "@/service/group/groupService";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;

    const sessionId = req.cookies.get("sessionId")?.value;
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const groupId = params.id;
    if (!groupId) {
      return NextResponse.json({ error: "No group id" }, { status: 400 });
    }

    const userId = await getUserIdBySession(sessionId);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const group = await getGroupDetailById(groupId, userId);
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json({ group }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error", detail: e?.message || String(e) },
      { status: 500 }
    );
  }
}
