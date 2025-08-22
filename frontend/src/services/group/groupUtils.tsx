import { IScrum } from "@/models/types";

export function checkIsScrumToday(
  allScrums: IScrum[],
  userId: string
): boolean {
  const today = getKstDateStr();
  return allScrums.some(
    (scrum) =>
      scrum.userId?.toString() === userId && getKstDateStr(scrum.date) === today
  );
}

export function getKstDateStr(date = new Date()) {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}
