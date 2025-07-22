import { getUserIdOr401 } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { updateTodayScrum } from "@/service/scrum/scrumService";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const scrumId = (await params).id;
    if (!scrumId) {
      return NextResponse.json({ error: "No scrum id" }, { status: 400 });
    }
    const answers = (await req.json()).answers;
    await updateTodayScrum(scrumId, answers);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
