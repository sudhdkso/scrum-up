import Scrum from "@/models/scrum";
import mongoose from "mongoose";
import Question, { IQuestion } from "@/models/question";
import { DailyScrumUpdateDTO } from "./dto/DailyScrum";

export async function createScrum(
  answers: string[],
  groupId: string,
  userId: string
) {
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

export async function getTodayScrum(
  groupId: string,
  userId: string
): Promise<DailyScrumUpdateDTO | null> {
  const { start, end } = getKstDateRange();
  const scrum = await Scrum.findOne({
    userId: new mongoose.Types.ObjectId(userId),
    groupId: new mongoose.Types.ObjectId(groupId),
    date: {
      $gte: start,
      $lt: end,
    },
  });
  if (!scrum) return null;

  return {
    scrumId: scrum._id?.toString(),
    questions: scrum.questions,
    answers: scrum.answers,
  } as DailyScrumUpdateDTO;
}

export async function getYesterdayScrum(groupId: string, userId: string) {
  const { start, end } = getKstDateRange(-1);
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
  return await Scrum.updateOne(
    {
      _id: new mongoose.Types.ObjectId(scrumId),
    },
    { $set: { answers: answers } },
    { new: true }
  );
}

function getKstDateRange(offsetDays = 0) {
  // 현재 한국시간 기준 Date
  const now = new Date();
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const year = kstNow.getUTCFullYear();
  const month = kstNow.getUTCMonth();
  const date = kstNow.getUTCDate();

  // 타겟일 0시(KST)의 UTC
  const baseStart = new Date(
    Date.UTC(year, month, date, 0, 0, 0) - 9 * 60 * 60 * 1000
  );
  const start = new Date(
    baseStart.getTime() + offsetDays * 24 * 60 * 60 * 1000
  );
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  return { start, end };
}
