import dbConnect from "@/lib/mongodb";
import { getUserIdOr401 } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getGroupManagementInfo } from "@/services/group";

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

    const group = await getGroupManagementInfo(groupId);
    return NextResponse.json({ group }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
