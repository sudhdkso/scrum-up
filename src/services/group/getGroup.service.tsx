import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import { GroupDetailResponseDTO } from "./dto/group.dto";
import {
  Group,
  GroupMember,
  User,
  Scrum,
  Question,
  InviteCode,
} from "@/models";
import {
  IUser,
  IGroupMember,
  IScrum,
  IQuestion,
  IInviteCode,
} from "@/models/types";
import { GroupMemberResponseDTO } from "../groupMember/dto/groupMemberResponse.dto";
import { DailyScrumDTO, UserAnswerDTO } from "../scrum/dto/DailyScrun";
import { checkIsScrumToday, getKstDateStr } from "./groupUtils";

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
    groupId: group._id,
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
    groupId: group._id,
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
  const isManager = group.managerId.toString() === userId;

  return {
    id: group._id.toString(),
    name: group.name,
    isManager,
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
    groupId: group._id,
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
    groupId: group._id,
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
