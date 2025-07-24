import dbConnect from "@/lib/mongodb";
import Group, { IGroup } from "@/models/group";
import { deleteGroupMemberByMemberId } from "./deleteGroupMember.service";

export async function kickGroupMember(
  groupId: string,
  userId: string,
  memberId: string
) {
  await dbConnect();

  const group = await Group.findById({ _id: groupId }).lean<IGroup>();
  if (!group) {
    throw Error("존재하지 않는 그룹입니다.");
  }

  if (group.managerId.toString() !== userId) {
    throw new Error("권한이 없습니다. (관리자만 강퇴 가능)");
  }

  await deleteGroupMemberByMemberId(groupId, memberId);

  return { ok: true };
}

export async function leaveGroupMember(groupId: string, userId: string) {
  await dbConnect();
  const group = await Group.findById(groupId);
  if (!group) {
    throw Error("존재하지 않는 그룹입니다.");
  }
  await deleteGroupMemberByMemberId(groupId, userId);

  return { ok: true };
}
