import dbConnect from "@/lib/mongodb";
import { Group, GroupMember, InviteCode } from "@/models";
import { IUser, IGroup, IInviteCode } from "@/models/types";
import { createGroupMember } from "./createGroupMember.service";

type JoinGroupResult = {
  alreadyMember: boolean;
  groupId: string;
};

export async function joinGroup(
  code: string,
  user: IUser
): Promise<JoinGroupResult> {
  await dbConnect();

  const inviteCode = await InviteCode.findOne({ code }).lean<IInviteCode>();
  if (!inviteCode) throw new Error("초대코드가 유효하지 않습니다.");

  const group = await Group.findById(inviteCode.groupId).lean<IGroup>();
  if (!group) throw new Error("그룹이 존재하지 않습니다.");

  const existingMember = await GroupMember.findOne({
    userId: user._id,
    groupId: group._id,
  });

  if (existingMember) {
    return { alreadyMember: true, groupId: group._id.toString() };
  }

  await createGroupMember(group._id, user, "member");

  return { alreadyMember: false, groupId: group._id.toString() };
}
