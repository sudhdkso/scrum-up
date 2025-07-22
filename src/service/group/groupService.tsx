import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import {
  CreateGroupRequestDTO,
  GroupSummaryDTO,
  GroupDetailResponseDTO,
} from "./dto/group.dto";
import { IUser } from "@/models/user";
import Group, { IGroup } from "@/models/group";
import { createQuestion } from "../question/questionService";
import GroupMember, { IGroupMember } from "@/models/group-member";
import Scrum, { IScrum } from "@/models/scrum";
import { GroupMemberResponseDTO } from "../groupMember/dto/groupMemberResponse.dto";
import { DailyScrumDTO, UserAnswerDTO } from "../scrum/dto/DailyScrun";
import User from "@/models/user";
import Question, { IQuestion } from "@/models/question";
import InviteCode, { IInviteCode } from "@/models/invite-code";

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

    await GroupMember.create(
      [
        {
          userId: toObjectId(user._id),
          groupId: toObjectId(group._id),
          role: "manager",
        },
      ],
      { session, ordered: true }
    );

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
    id: m.userId.toString(),
    name: userIdToName[m.userId.toString()] || "",
    role: m.role ?? "",
  }));

  memberDocs.forEach((m) => {
    userIdToName[m.id] = m.name;
  });

  const allScrumsInGroup = await Scrum.find({
    groupId: toObjectId(groupId),
  }).lean<IScrum[]>();

  let isScrumToday = false;

  if (userId) {
    isScrumToday = checkIsScrumToday(allScrumsInGroup, userId);
  }

  const scrumMap: { [date: string]: UserAnswerDTO[] } = {};
  for (const scrum of allScrumsInGroup) {
    const dateStr = getKstDateStr(new Date(scrum.date));
    if (!dateStr) continue;
    if (!scrumMap[dateStr]) scrumMap[dateStr] = [];
    scrumMap[dateStr].push({
      userId: scrum.userId?.toString(),
      userName: userIdToName[scrum.userId?.toString()] || "",
      questions: scrum.questions || [],
      answers: scrum.answers || [],
    });
  }

  const dailyScrum: DailyScrumDTO[] = Object.entries(scrumMap)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, answersByUser]) => ({
      date: getKstDateStr(new Date(date)),
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

export async function getGroupManageData(groupId: string) {
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
    id: m.userId.toString(),
    name: userIdToName[m.userId.toString()] || "",
    role: m.role ?? "",
  }));

  const inviteCodeDoc = await InviteCode.findOne({
    groupId: toObjectId(groupId),
  }).lean<IInviteCode>();

  const inviteCode = inviteCodeDoc
    ? {
        code: inviteCodeDoc.code,
        expiresAt: inviteCodeDoc.expiresAt,
      }
    : {
        code: "",
        expiresAt: 0,
      };

  return {
    id: group._id.toString(),
    name: group.name,
    desc: group.descrption,
    scrumTime: group.scrumTime,
    inviteCode: inviteCode,
    members,
    questions: questionTexts,
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

function checkIsScrumToday(allScrums: IScrum[], userId: string): boolean {
  const today = getKstDateStr();
  return allScrums.some(
    (scrum) =>
      scrum.userId?.toString() === userId && getKstDateStr(scrum.date) === today
  );
}

function getKstDateStr(date = new Date()) {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}
