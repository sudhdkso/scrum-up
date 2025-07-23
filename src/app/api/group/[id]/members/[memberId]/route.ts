import { getUserIdOr401 } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { kickGroupMember } from "@/service/groupMember/groupMemberService";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const { id, memberId } = await params;
    if (!id || !memberId) {
      return NextResponse.json(
        { error: "No group id or member id" },
        { status: 400 }
      );
    }
    const userId = await getUserIdOr401(req);
    await kickGroupMember(id, userId, memberId);
    return NextResponse.json(
      { message: "해당 멤버를 탈퇴시겼습니다" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
