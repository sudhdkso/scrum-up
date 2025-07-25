import dbConnect from "@/lib/mongodb";
import { getUserIdOr401 } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getYesterdayScrum } from "@/services/scrum/scrumService";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = await getUserIdOr401(req);
    const url = new URL(req.url);
    const groupId = url.searchParams.get("groupId");
    if (!groupId) {
      return NextResponse.json({ error: "No group id" }, { status: 400 });
    }
    const yesterdayScrum = await getYesterdayScrum(groupId, userId);
    return NextResponse.json({ yesterdayScrum }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
