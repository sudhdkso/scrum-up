import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import Question from "@/models/question";

export async function createQuestion(
  questions: string[],
  groupId: string,
  userId: string,
  session?: mongoose.ClientSession
) {
  const question = new Question({
    questionTexts: questions,
    groupId: new mongoose.Types.ObjectId(groupId),
    creatorId: new mongoose.Types.ObjectId(userId),
  });

  if (session) {
    await question.save({ session });
  } else {
    await question.save();
  }
  return question;
}
