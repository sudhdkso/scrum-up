import { getUserIdBySession } from "@/service/user/userService";
import { NextRequest, NextResponse } from "next/server";
import { getGroupDetailById } from "@/service/group/groupService";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const sessionId = req.cookies.get("sessionId")?.value;
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "No group id" }, { status: 400 });
    }

    const userId = await getUserIdBySession(sessionId);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const group = await getGroupDetailById(id, userId);
    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json({ group }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
