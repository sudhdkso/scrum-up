export async function getUserData() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_DEV_URL}/api/user`);

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
}

export async function createUser(name: string, email: string, kakaoId: string) {
  const response = await fetch(`/api/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, kakaoId }),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return response.json();
}

export async function name(id: string) {
  const response = await fetch(`/api/user/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
}
