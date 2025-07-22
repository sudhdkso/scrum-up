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

  const question = await Question.findOne({
    groupId: new mongoose.Types.ObjectId(groupId),
  }).lean<IQuestion>();

  const scrum = await Scrum.create({
    userId: new mongoose.Types.ObjectId(userId),
    groupId: new mongoose.Types.ObjectId(groupId),
    questions: question?.questionTexts || [],
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
  console.log("star", start);
  console.log("end", end);
  console.log("today scrum", scrum);
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
  // 현재 시각을 KST로 보정
  const now = new Date();
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const year = kstNow.getUTCFullYear();
  const month = kstNow.getUTCMonth();
  const date = kstNow.getUTCDate();

  // 오늘 0시(KST)의 UTC
  const start = new Date(
    Date.UTC(year, month, date, 0, 0, 0) - 9 * 60 * 60 * 1000
  );
  // 내일 0시(KST)의 UTC
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  return { start, end };
}
