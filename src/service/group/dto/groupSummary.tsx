export interface GroupSummaryDTO {
  id: string; // 그룹 ID (프론트에서 상세 조회나 링크 이동 등에 사용)
  name: string; // 그룹 이름
  isManager: boolean; // 이 사용자가 이 그룹의 팀장인지 여부
  isScrumToday: boolean; // 오늘 스크럼 작성 여부
}
