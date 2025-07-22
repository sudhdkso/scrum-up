import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";
import InviteCode from "@/models/invite-code";

export async function createInviteCode(groupId: string, userId: string) {
  await dbConnect();
  const now = new Date();
  let inviteCode = await InviteCode.findOne({
    groupId: new mongoose.Types.ObjectId(groupId),
    expiresAt: { $gt: now },
  });

  if (inviteCode) {
    return inviteCode;
  }

  return await InviteCode.create({
    groupId: new mongoose.Types.ObjectId(groupId),
    createdBy: new mongoose.Types.ObjectId(userId),
    code: generateInviteCode(),
  });
}

function generateInviteCode(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
