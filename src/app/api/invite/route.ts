import { NextRequest, NextResponse } from "next/server";
import { getInviteDetail } from "@/services/inviteCode/inviteCodeService";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    if (!code) {
      return NextResponse.json({ error: "Code not found" }, { status: 404 });
    }
    const invite = await getInviteDetail(code);
    return NextResponse.json({ invite }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
