import redisClient from "./redis";

export async function saveSession(sessionId: string, userId: string) {
  await redisClient.set(sessionId, userId, {
    EX: 60 * 60 * 24,
  });
}

export async function getUserIdBySessionId(sessionId: string) {
  return await redisClient.get(sessionId);
}

export async function deleteSession(sessionId: string) {
  await redisClient.del(sessionId);
}
