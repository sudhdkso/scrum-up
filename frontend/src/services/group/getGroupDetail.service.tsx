import { GroupDetailResponseDTO } from "./dto/group.dto";
import { Group, Scrum, Question } from "@/models";
import { IScrum, IQuestion } from "@/models/types";
import { DailyScrumDTO, UserAnswerDTO } from "../scrum/dto/DailyScrum";
import { checkIsScrumToday, getKstDateStr } from "./groupUtils";
import { getGroupMembersWithNameMap } from "@/services/groupMember";

export async function getGroupDetailById(
  groupId: string,
  userId: string
): Promise<GroupDetailResponseDTO> {
  const group = await Group.findById(groupId);
  const question = await Question.findOne({
    groupId: groupId,
  }).lean<IQuestion>();

  const questionTexts = question ? question.questionTexts : [];

  const { members, userIdToName } = await getGroupMembersWithNameMap(group._id);

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
