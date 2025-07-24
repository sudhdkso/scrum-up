import dbConnect from "@/lib/mongodb";
import GroupMember from "@/models/group-member";
import Group, { IGroup } from "@/models/group";

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
  const groupMember = await GroupMember.findOne({ groupId, userId: memberId });
  if (!groupMember) {
    throw new Error("멤버가 그룹에 존재하지 않습니다.");
  }

  await GroupMember.deleteOne({ groupId, userId: memberId });

  return { ok: true };
}
