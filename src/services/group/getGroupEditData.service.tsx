import { Group } from "@/models";
import { IGroup } from "@/models/group";
import { getQuestionByGroupId } from "@/services/question/questionService";

export async function getGroupEditData(groupId: string) {
  const group = await Group.findById(groupId).lean<IGroup>();
  if (!group) {
    throw Error("no group");
  }

  const question = await getQuestionByGroupId(groupId);

  return {
    id: group._id,
    name: group.name,
    desc: group.description,
    cycle: group.cycle,
    scrumTime: group.scrumTime,
    questions: question?.questionTexts,
  };
}
