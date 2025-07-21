import { GroupMemberResponseDTO } from "@/service/groupMember/dto/groupMemberResponse.dto";
import { DailyScrumDTO } from "@/service/scrum/dto/DailyScrun";

export interface GroupDetailResponseDTO {
  id: string;
  name: string;
  inviteCode: string;
  members: GroupMemberResponseDTO[];
  questions: string[];
  dailyScrum: DailyScrumDTO[];
  isScrumToday: boolean;
}
