import dbConnect from "@/lib/mongodb";
import { getUserIdOr401 } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getGroupEditData, updateGroupData } from "@/services/group";

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
    const group = await getGroupEditData(groupId);
    return NextResponse.json({ group }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const groupId = (await params).id;
    if (!groupId) {
      return NextResponse.json({ error: "No group id" }, { status: 400 });
    }
    const body = await req.json();
    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json({ error: "그룹명(name) 누락" }, { status: 400 });
    }

    await updateGroupData(groupId, body);
    return NextResponse.json({ success: true });
  } catch (error) {
    const groupId = (await params).id;
    if (!groupId) {
      return NextResponse.json({ error: "No group id" }, { status: 400 });
    }
  }
}
