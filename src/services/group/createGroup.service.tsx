import mongoose from "mongoose";
import { createQuestion } from "../question/questionService";
import { CreateGroupRequestDTO } from "./dto/group.dto";
import { Group, GroupMember } from "@/models";
import { IUser } from "@/models/types";
import { createGroupMember } from "@/services/groupMember";

export async function createGroup(request: CreateGroupRequestDTO, user: IUser) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const group = new Group({
      name: request.name,
      description: request.description,
      scrumTime: request.scrumTime,
      cycle: request.cycle,
      managerId: user._id,
    });

    await group.save({ session });

    await createGroupMember(group._id, user, "manager", session);

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
