import dbConnect from "@/lib/mongodb";
import { getUserIdOr401 } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getScrumFormPage } from "@/services/group";

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

    const form = await getScrumFormPage(groupId, userId);
    if (!form) {
      return NextResponse.json({ error: "form not found" }, { status: 404 });
    }

    return NextResponse.json({ form }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
