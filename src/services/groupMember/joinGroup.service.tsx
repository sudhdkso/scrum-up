import dbConnect from "@/lib/mongodb";
import { Group, GroupMember, InviteCode } from "@/models";
import { IUser, IGroup, IInviteCode } from "@/models/types";

export async function joinGroup(code: string, user: IUser) {
  await dbConnect();
  const inviteCode = await InviteCode.findOne({
    code: code,
  }).lean<IInviteCode>();

  if (!inviteCode) throw Error("not found inviteCode");

  const group = await Group.findById(inviteCode.groupId).lean<IGroup>();

  if (!group) throw Error("not found group");

  // 이미 멤버인지 체크!
  const existingMember = await GroupMember.findOne({
    userId: user._id,
    groupId: group._id,
  });

  if (existingMember) {
    // 이미 멤버이면
    return { alreadyMember: true, groupId: group._id };
  }

  // 신규 가입
  await GroupMember.create({
    userId: user._id,
    name: user.name,
    groupId: group._id,
    role: "member",
  });

  return { alreadyMember: false, groupId: group._id };
}
