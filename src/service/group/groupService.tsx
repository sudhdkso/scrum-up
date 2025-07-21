import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import { CreateGroupRequestDTO } from "./dto/createGroupRequest.dto";
import { IUser } from "@/models/user";
import Group from "@/models/group";
import { createQuestion } from "../question/questionService";
import { GroupSummaryDTO } from "./dto/groupSummary";
import GroupMember, { IGroupMember } from "@/models/group_member";
import Scrum from "@/models/scrum";
import { GroupDetailResponseDTO } from "./dto/groupDetailResponse.dto";
import { GroupMemberResponseDTO } from "../groupMember/dto/groupMemberResponse.dto";
import { DailyScrumDTO, UserAnswerDTO } from "../scrum/dto/DailyScrun";
import User from "@/models/user";
import Question, { IQuestion } from "@/models/question";

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
  const memberships = await GroupMember.find({ userId });

  const groupIds = memberships.map((m) => m.groupId);

  const groups = await Group.find({ _id: { $in: groupIds } });
  return groups.map((group) => {
    // 자신이 관리자인지 판별 (managerId와 자기 userId 비교)
    const isManager = group.managerId.toString() === userId;

    // 필요시, 소속 멤버 데이터에서 status 등 다른 정보 쓸 수 있음
    return {
      id: group._id.toString(),
      name: group.name,
      isManager,
      isScrumToday: false,
    };
  });
}

export async function getGroupDetailById(
  groupId: string,
  userId: string
): Promise<GroupDetailResponseDTO> {
  await dbConnect();
  const group = await Group.findById(groupId);
  const question = await Question.findOne({
    groupId: groupId,
  }).lean<IQuestion>();
  const questionTexts = question ? question.questionTexts : [];

  const memberDocs = await GroupMember.find({
    groupId: toObjectId(groupId),
  }).lean<IGroupMember[]>();

  const userIds = memberDocs.map((m) => m.userId);

  //그룹에 포함된 그룸멤버 Id가져와서 이름맵으로 변환
  const users = await User.find({ _id: { $in: userIds } }).lean<IUser[]>();
  const userIdToName = Object.fromEntries(
    users.map((u) => [u._id.toString(), u.name || ""])
  );

  const members: GroupMemberResponseDTO[] = memberDocs.map((m) => ({
    id: m._id.toString(),
    name: userIdToName[m.userId.toString()] || "",
    role: m.role ?? "",
  }));

  memberDocs.forEach((m) => {
    userIdToName[m.id] = m.name;
  });

  const allScrumsInGroup = await Scrum.find({
    groupId: toObjectId(groupId),
  }).lean();

  let isScrumToday = false;

  if (userId) {
    const today = new Date().toISOString().slice(0, 10);
    isScrumToday = allScrumsInGroup.some(
      (scrum: any) =>
        scrum.userId?.toString() === userId &&
        scrum.date?.toISOString().slice(0, 10) === today
    );
  }

  const scrumMap: { [date: string]: UserAnswerDTO[] } = {};
  console.log(question);
  for (const scrum of allScrumsInGroup) {
    const dateStr = scrum.date?.toISOString().slice(0, 10);
    if (!dateStr) continue;
    if (!scrumMap[dateStr]) scrumMap[dateStr] = [];
    scrumMap[dateStr].push({
      userId: scrum.userId?.toString(),
      userName: userIdToName[scrum.userId?.toString()] || "",
      answers: scrum.answer || [],
    });
  }

  const formatDate = (d: Date | string) => {
    return new Date(d).toISOString().slice(0, 10); // "YYYY-MM-DD"
  };

  const dailyScrum: DailyScrumDTO[] = Object.entries(scrumMap)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, answersByUser]) => ({
      date: formatDate(date),
      answersByUser,
    }));

  return {
    id: group._id.toString(),
    name: group.name,
    inviteCode: group.inviteCode,
    members,
    questions: questionTexts,
    dailyScrum,
    isScrumToday,
  };
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
