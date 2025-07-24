import { getUserIdOr401 } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { createScrum } from "@/services/scrum/scrumService";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const groupId = (await params).id;
    const body = await req.json();

    if (!groupId) {
      return NextResponse.json({ error: "No group id" }, { status: 400 });
    }

    const userId = await getUserIdOr401(req);

    const answers = body.answers;
    const scrum = await createScrum(answers, groupId, userId);
    return NextResponse.json({ scrum }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
