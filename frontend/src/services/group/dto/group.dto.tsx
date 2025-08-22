import { DailyScrumDTO } from "@/services/scrum/dto/DailyScrum";
import { GroupMemberResponseDTO } from "@/services/groupMember/dto/groupMemberResponse.dto";

export interface CreateGroupRequestDTO {
  name: string;
  description: string;
  questions: string[];
  scrumTime: string;
  cycle: string;
}

export interface GroupEditDTO {
  id: string;
  name: string;
  desc: string;
  scrmTime: string;
  questions: string[];
}

export interface GroupDetailResponseDTO {
  id: string;
  name: string;
  isManager: boolean;
  members: GroupMemberResponseDTO[];
  questions: string[];
  dailyScrum: DailyScrumDTO[];
  isScrumToday: boolean;
}

export interface GroupListResponseDTO {
  groups: GroupSummaryDTO[];
}

export interface GroupSummaryDTO {
  id: string; // 그룹 ID (프론트에서 상세 조회나 링크 이동 등에 사용)
  name: string; // 그룹 이름
  isManager: boolean; // 이 사용자가 이 그룹의 팀장인지 여부
  isScrumToday: boolean; // 오늘 스크럼 작성 여부
}

export interface GroupManageDTO {
  id: string;
  name: string;
  desc: string;
  inviteCode: {
    code: string;
    expiresAt: number;
  };
  scrumTime: string;
  members: {
    id: string;
    name: string;
    role: "manager" | "member";
  }[];
  questions: string[];
}

export interface GroupUpdateDTO {
  name: string;
  description?: string;
  questions: string[];
  scrumTime: string;
  cycle: string;
}

export interface ScrumFormPageDTO {
  name: string;
  desc?: string;
  questions: string[];
  isScrumToday: boolean;
  todayScrum?: { _id: string; answers: string[] };
  yesterdayScrum?: { questions: string[]; answers: string[] };
}
