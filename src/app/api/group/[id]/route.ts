import dbConnect from "@/lib/mongodb";
import { getUserIdOr401 } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getGroupDetailById, deleteGroupWithAllData } from "@/services/group";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const groupId = (await params).id;

    if (!groupId) {
      return NextResponse.json({ error: "No group id" }, { status: 400 });
    }

    const userId = await getUserIdOr401(req);

    const group = await getGroupDetailById(groupId, userId);
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const groupId = (await params).id;

    if (!groupId) {
      return NextResponse.json({ error: "No group id" }, { status: 400 });
    }
    await deleteGroupWithAllData(groupId);
    return NextResponse.json(
      { message: "그룹 삭제에 성공했습니다." },
      { status: 200 }
    );
  } catch (error) {
    console.log(String(error));
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
