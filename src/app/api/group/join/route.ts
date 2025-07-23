import { getUserBySession } from "@/service/user/userService";
import { NextRequest, NextResponse } from "next/server";
import { joinGroup } from "@/service/group/groupService";
import { getUserOr401 } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    if (!code) {
      return NextResponse.json({ error: "Not found code" }, { status: 404 });
    }
    const user = await getUserOr401(req);

    joinGroup(code, user);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
