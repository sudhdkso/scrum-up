import dbConnect from "@/lib/mongodb";
import Scrum from "@/models/scrum";
import mongoose from "mongoose";

export async function createScrum(
  answers: string[],
  groupId: string,
  userId: string
) {
  await dbConnect();

  const scrum = await Scrum.create({
    userId: new mongoose.Types.ObjectId(userId),
    groupId: new mongoose.Types.ObjectId(groupId),
    answers,
  });

  return scrum;
}
