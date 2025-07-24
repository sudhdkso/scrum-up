import dbConnect from "@/lib/mongodb";
import { GroupUpdateDTO } from "./dto/group.dto";
import { Group } from "@/models";
import { updateQuestion } from "../question/questionService";
export async function updateGroupData(groupId: string, req: GroupUpdateDTO) {
  await Group.updateOne(
    { _id: groupId },
    {
      name: req.name,
      desc: req.description,
      scrumTime: req.scrumTime,
      cycle: req.cycle,
    }
  );

  await updateQuestion(req.questions, groupId);
}
