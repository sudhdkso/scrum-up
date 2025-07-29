import dbConnect from "@/lib/mongodb";
import User, { IUser } from "@/models/user";
import { getUserIdBySessionId } from "@/lib/session";

export async function getUserBySession(sessionId: string) {
  await dbConnect();
  const userId = await getUserIdBySessionId(sessionId);
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(userId);
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  return user;
}

export async function getUserIdBySession(sessionId: string) {
  return getUserIdBySessionId(sessionId);
}

export async function getUserInfo(userId: string) {
  const user = await User.findById(userId);
  const data = {
    id: user._id,
    name: user.name,
    email: user.email,
    isNotificationOn: user.isNotificationOn,
  };
  return data;
}

export async function changeNotificationOn(userId: string, status: boolean) {
  return await User.findByIdAndUpdate(
    userId,
    { isNotificationOn: status },
    { new: true }
  );
}
