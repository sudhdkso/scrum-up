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

export async function getTodayScrum(groupId: string, userId: string) {
  await dbConnect();

  const { start, end } = getKstTodayRange();
  const scrum = await Scrum.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    groupId: new mongoose.Types.ObjectId(groupId),
    date: {
      $gte: start,
      $lt: end,
    },
  }).lean<DailyScrumUpdateDTO>();
  return scrum;
}

export async function updateTodayScrum(scrumId: string, answers: string[]) {
  await dbConnect();
  return await Scrum.updateOne(
    {
      _id: new mongoose.Types.ObjectId(scrumId),
    },
    { $set: { answers: answers } },
    { new: true }
  );
}

function getKstTodayRange() {
  const now = new Date();

  const kstOffsetMs = 9 * 60 * 60 * 1000;

  //UTC 기준으로 오늘 KST의 00:00:00 시각 계산
  const start = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      -9,
      0,
      0,
      0
    )
  );

  // end: start + 24시간
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  return { start, end };
}
