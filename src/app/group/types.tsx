// group/types.ts
export type Member = { id: string; name: string };
export type Group = {
  id: string;
  name: string;
  inviteCode: string;
  members: Member[];
  questions: string[];
};
export type UserScrum = { userId: string; userName: string; answers: string[] };
export type DailyGroupScrum = { date: string; answersByUser: UserScrum[] };
