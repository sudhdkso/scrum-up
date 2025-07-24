import mongoose from "mongoose";
import GroupMember from "@/models/group-member";

//그룹 멤버 전체 삭제
export async function deleteGroupMembersByGroupId(
  groupId: string,
  session: mongoose.ClientSession
) {
  const result = await GroupMember.deleteMany({ groupId }).session(session);
  return result.deletedCount;
}

//그룹 멤버 단일 삭제
export async function deleteGroupMemberByMemberId(
  groupId: string,
  memberId: string
) {
  const deleted = await GroupMember.findOneAndDelete({
    groupId,
    userId: memberId,
  });
  if (!deleted) {
    throw new Error("멤버가 그룹에 존재하지 않습니다.");
  }
  return deleted;
}
