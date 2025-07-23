import { getUserBySession } from "@/service/user/userService";
import { NextRequest, NextResponse } from "next/server";
import { createGroup, getUserGroups } from "@/service/group/groupService";
import { CreateGroupRequestDTO } from "@/service/group/dto/group.dto";
import { getUserIdOr401 } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdOr401(req);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
