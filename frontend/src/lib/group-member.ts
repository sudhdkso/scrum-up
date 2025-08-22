export async function kickGroupMember(groupId: string, memberId: string) {
  const response = await fetch(`/api/group/${groupId}/members/${memberId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}
