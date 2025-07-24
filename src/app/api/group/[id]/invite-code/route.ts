import { getUserIdOr401 } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { createInviteCode } from "@/services/inviteCode/inviteCodeService";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const groupId = (await params).id;
    if (!groupId) {
      return NextResponse.json({ error: "No group id" }, { status: 400 });
    }

    const userId = await getUserIdOr401(req);

    const inviteCode = await createInviteCode(groupId, userId);
    return NextResponse.json({ inviteCode }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
