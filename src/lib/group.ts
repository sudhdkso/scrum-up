export async function getUserGroups() {
  const response = await fetch("/api/group", { credentials: "include" });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
}
