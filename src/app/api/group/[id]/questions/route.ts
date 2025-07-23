import { NextRequest, NextResponse } from "next/server";
import { updateQuestion } from "@/service/question/questionService";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const groupId = (await params).id;
    if (!groupId) {
      return NextResponse.json({ error: "No group id" }, { status: 400 });
    }
    const body = await req.json();
    //권한 확인 추가하기

    const questions = await updateQuestion(body.questions, groupId);
    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
