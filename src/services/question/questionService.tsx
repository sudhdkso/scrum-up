import mongoose from "mongoose";
import Question, { IQuestion } from "@/models/question";

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

export async function updateQuestion(questions: string[], groupId: string) {
  return await Question.findOneAndUpdate(
    { groupId: new mongoose.Types.ObjectId(groupId) },
    { $set: { questionTexts: questions } },
    { new: true }
  );
}

export async function getQuestionByGroupId(
  groupId: string
): Promise<IQuestion | null> {
  return Question.findOne({ groupId }).lean<IQuestion>();
}
