import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";
import InviteCode, { IInviteCode } from "@/models/invite-code";
import Group, { IGroup } from "@/models/group";
import Groupmember from "@/models/group-member";
import User, { IUser } from "@/models/user";

export async function createInviteCode(groupId: string, userId: string) {
  await dbConnect();
  const now = new Date();
  const inviteCode = await InviteCode.findOne({
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

export async function getInviteDetail(code: string) {
  await dbConnect();

  const inviteCode = await InviteCode.findOne({
    code: code,
  }).lean<IInviteCode>();

  if (!inviteCode) {
    throw Error("not found group by invite code");
  }

  const group = await Group.findById(inviteCode?.groupId).lean<IGroup>();

  if (!group) {
    throw Error("not found group");
  }

  const user = await User.findById(group?.managerId).lean<IUser>();
  const memberCount = await Groupmember.countDocuments({
    groupId: inviteCode?.groupId,
  });

  return {
    inviterName: user?.name,
    groupName: group?.name,
    memberCount: memberCount ?? 0,
    scrumTime: group?.scrumTime,
  };
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
