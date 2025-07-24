import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import { GroupSummaryDTO } from "./dto/group.dto";
import { Group, GroupMember, Scrum } from "@/models";
import { IScrum } from "@/models/types";
import { checkIsScrumToday, getKstDateStr } from "./groupUtils";

export async function getUserGroups(
  userId: string
): Promise<GroupSummaryDTO[]> {
  if (!userId) {
    throw new Error("userId 필요");
  }
  await dbConnect();

  const memberships = await GroupMember.find({ userId });
  const groupIds = memberships.map((m) => m.groupId);

  const groups = await Group.find({ _id: { $in: groupIds } });

  const allScrums = await Scrum.find({
    groupId: { $in: groupIds },
    userId: userId,
  }).lean<IScrum[]>();

  return groups.map((group) => {
    const isManager = group.managerId.toString() === userId;

    // 해당 그룹의 내 스크럼 중 오늘 날짜가 있는지 확인
    const groupScrums = allScrums.filter(
      (scrum) => scrum.groupId.toString() === group._id.toString()
    );

    const isScrumToday = checkIsScrumToday(groupScrums, userId);

    return {
      id: group._id.toString(),
      name: group.name,
      isManager,
      isScrumToday,
    };
  });
}
