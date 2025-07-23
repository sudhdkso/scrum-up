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

export async function getInviteCode(groupId: string) {
  const response = await fetch(`/api/group/${groupId}/invite-code`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}

export async function updateGroupQuestion(
  questions: string[],
  groupId: string
) {
  const response = await fetch(`/api/group/${groupId}/questions`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questions }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}

export async function joinGroup(code: string) {
  const response = await fetch(`/api/group/join?code=${code}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}
