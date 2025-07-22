import dbConnect from "@/lib/mongodb";
import Scrum from "@/models/scrum";
import mongoose from "mongoose";
import Question, { IQuestion } from "@/models/question";
import { DailyScrumUpdateDTO } from "./dto/DailyScrun";

export async function createScrum(
  answers: string[],
  groupId: string,
  userId: string
) {
  await dbConnect();

  const question = await Question.find({
    groupId: new mongoose.Types.ObjectId(groupId),
  }).lean<IQuestion>();

  const scrum = await Scrum.create({
    userId: new mongoose.Types.ObjectId(userId),
    groupId: new mongoose.Types.ObjectId(groupId),
    questions: question.questionTexts,
    answers,
  });

  return scrum;
}

export async function name(groupId: string, userId: string) {
  await dbConnect();

  return await Scrum.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    groupId: new mongoose.Types.ObjectId(groupId),
  }).lean<DailyScrumUpdateDTO>();
}
