import { IGroup } from "@/models/group";
import { ScrumFormPageDTO } from "./dto/group.dto";
import { Group } from "@/models";
import { getTodayScrum, getYesterdayScrum } from "../scrum/scrumService";
import { getQuestionByGroupId } from "../question/questionService";

export async function getScrumFormPage(
  groupId: string,
  userId: string
): Promise<ScrumFormPageDTO | undefined> {
  const group = await Group.findById(groupId).lean<IGroup>();
  if (!group) return;

  const question = await getQuestionByGroupId(groupId);
  const yesterdayScrum = await getYesterdayScrum(groupId, userId);
  const todayScrum = await getTodayScrum(groupId, userId);

  return {
    name: group.name,
    desc: group.description,
    questions: question?.questionTexts ?? [],
    isScrumToday: !todayScrum,
    todayScrum: todayScrum
      ? { _id: todayScrum.scrumId, answers: todayScrum.answers }
      : undefined,
    yesterdayScrum: yesterdayScrum
      ? {
          questions: yesterdayScrum.questions ?? [],
          answers: yesterdayScrum.answers ?? [],
        }
      : undefined,
  };
}
