export async function getUserGroups() {
  const response = await fetch("/api/group", { credentials: "include" });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    console.error("API Error", response.status, data);
    throw new Error(data?.message || "그룹 조회 실패");
  }

  return response.json();
}

export async function getGroupDetail(groupId: string) {
  const response = await fetch(`/api/group/${groupId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message || "그룹 조회 실패");
  }
  return response.json();
}

export async function getInviteCode(groupId: string) {
  const response = await fetch(`/api/group/${groupId}/invite-code`, {
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message || "초대코드 조회 실패");
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
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message || "그룹 업데이트 실패");
  }
  return response.json();
}

export async function joinGroup(code: string) {
  const response = await fetch(`/api/group/join?code=${code}`, {
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message || "그룹 가입 실패");
  }
  return response.json();
}

export async function getGroupEditData(groupId: string) {
  const response = await fetch(`/api/group/${groupId}/edit`, {
    credentials: "include",
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message || "그룹 수정 실패");
  }
  return response.json();
}

export async function updateGroupData(
  groupId: string,
  payload: {
    name: string;
    desc: string;
    questions: string[];
    scrumTime: string;
    cycle: string | string[];
  }
) {
  const response = await fetch(`/api/group/${groupId}/edit`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message || "그룹 수정 실패");
  }

  return await response.json();
}

export async function getScrumFormPage(groupId: string) {
  const response = await fetch(`/api/group/${groupId}/scrum/formpage`, {
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message || "스크럼 조회 실패");
  }

  const body = await response.json();
  return body;
}
