import mongoose from "mongoose";
import { Group, GroupMember, Scrum, Question, InviteCode } from "@/models";

export async function deleteGroupWithAllData(groupId: string) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await Scrum.deleteMany({ groupId }).session(session);

    await GroupMember.deleteMany({ groupId }).session(session);

    await Question.deleteMany({ groupId }).session(session);

    await InviteCode.deleteMany({ groupId }).session(session);

    await Group.findByIdAndDelete(groupId);

    await session.commitTransaction();
    return { ok: true };
  } catch (error) {
    await session.abortTransaction();
    throw Error("삭제 중 오류가 발생하였습니다.");
  } finally {
    session.endSession();
  }
}
