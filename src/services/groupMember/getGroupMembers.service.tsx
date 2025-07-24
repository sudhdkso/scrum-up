import { User, GroupMember } from "@/models";
import { IUser } from "@/models/user";
export async function getGroupMembersWithNameMap(groupId: string) {
  const memberDocs = await GroupMember.find({ groupId }).lean();
  const userIds = memberDocs.map((m) => m.userId);

  const users = await User.find({ _id: { $in: userIds } }).lean<IUser[]>();

  const userIdToName: Record<string, string> = Object.fromEntries(
    users.map((u) => [u._id.toString(), u.name || ""])
  );

  memberDocs.forEach((m) => {
    userIdToName[m.userId.toString()] =
      m.name || userIdToName[m.userId.toString()] || "";
  });

  const members = memberDocs.map((m) => ({
    id: m.userId.toString(),
    name: userIdToName[m.userId.toString()] || "",
    role: m.role ?? "",
  }));

  return {
    members,
    userIdToName,
  };
}
