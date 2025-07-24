import { Group, Question, InviteCode } from "@/models";
import { IQuestion, IInviteCode } from "@/models/types";
import { getGroupMembersWithNameMap } from "@/services/groupMember";

export async function getGroupManagementInfo(groupId: string) {
  const group = await Group.findById(groupId);

  const question = await Question.findOne({
    groupId: groupId,
  }).lean<IQuestion>();
  const questionTexts = question ? question.questionTexts : [];

  const { members } = await getGroupMembersWithNameMap(group._id);

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
