export async function getInviteDetailByCode(code: string) {
  const response = await fetch(`/api/invite?code=${code}`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
}
