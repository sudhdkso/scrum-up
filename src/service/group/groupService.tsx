import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import { CreateGroupRequestDTO } from "./dto/createGroupRequest.dto";
import { IUser } from "@/models/user";
import Group from "@/models/group";
import { createQuestion } from "../question/questionService";
import { GroupSummaryDTO } from "./dto/groupSummary";
import GroupMember from "@/models/group_member";

export async function createGroup(request: CreateGroupRequestDTO, user: IUser) {
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const group = new Group({
      name: request.name,
      description: request.description,
      inviteCode: generateInviteCode(),
      scrumTime: request.scrumTime,
      cycle: request.cycle,
      managerId: toObjectId(user._id),
    });

    await group.save({ session });

    const groupMember = await GroupMember.create(
      [
        {
          userId: toObjectId(user._id),
          groupId: toObjectId(group._id),
          role: "manager",
        },
      ],
      { session, ordered: true }
    );

    console.log("groupMember", groupMember);
    await createQuestion(request.questions, group._id, user._id, session);
    await session.commitTransaction();

    return group;
  } catch (error) {
    await session.abortTransaction();
    console.error("DB Save Error:", error);
    if (error instanceof Error) console.error(error.stack);
    throw error;
  } finally {
    session.endSession();
  }
}

export async function getUserGroups(
  userId: string
): Promise<GroupSummaryDTO[]> {
  if (!userId) {
    throw new Error("userId 필요");
  }
  await dbConnect();
  // 1. 먼저 GroupMember 테이블에서 userId로 자신의 소속 그룹 목록을 구함
  const memberships = await GroupMember.find({ userId });
  // 2. memberships에서 groupId만 뽑음
  const groupIds = memberships.map((m) => m.groupId);
  // 3. 그룹 id 기준으로 Group 컬렉션 조회
  const groups = await Group.find({ _id: { $in: groupIds } });
  return groups.map((group) => {
    // 자신이 관리자인지 판별 (managerId와 자기 userId 비교)
    const isManager = group.managerId.toString() === userId;

    // 필요시, 소속 멤버 데이터에서 status 등 다른 정보 쓸 수 있음
    return {
      id: group._id.toString(),
      name: group.name,
      isManager,
      isScrumToday: false, // 여긴 business logic에 따라 구현
    };
  });
}

function generateInviteCode(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function toObjectId(
  id: string | mongoose.Types.ObjectId
): mongoose.Types.ObjectId {
  if (typeof id === "string" && mongoose.Types.ObjectId.isValid(id)) {
    return new mongoose.Types.ObjectId(id);
  }
  return id as mongoose.Types.ObjectId;
}
