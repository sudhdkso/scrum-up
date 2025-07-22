import { getUserIdOr401 } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getGroupDetailById } from "@/service/group/groupService";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    if (!id) {
      return NextResponse.json({ error: "No group id" }, { status: 400 });
    }

    const userId = await getUserIdOr401(req);

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
