export async function getUserGroups() {
  const response = await fetch("/api/group", { credentials: "include" });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
}

export async function getGroupDetail(groupId: string) {
  const response = await fetch(`/api/group/${groupId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}
