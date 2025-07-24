import mongoose from "mongoose";
import { IUser } from "@/models/user";
import { GroupMember } from "@/models";

export async function createGroupMember(
  groupId: string,
  user: IUser,
  role: "manager" | "member",
  session?: mongoose.ClientSession
) {
  if (!user) {
    throw new Error("user is required");
  }

  const groupMember = new GroupMember({
    groupId: groupId,
    userId: user._id,
    name: user.name,
    role: role,
  });
  return session
    ? await groupMember.save({ session, ordered: true })
    : await groupMember.save();
}
