"use client";
import { AuthProvider } from "@/app/components/AuthProvider";
import NavBar from "@/app/components/NavBar";
import { useState } from "react";
import { GroupHeader } from "../GroupHeader";
import { TodayScrumStatus } from "../TodayScrumStatus";
import { TabBar } from "../TabBar";
import { DateAccordion } from "../accordion/DateAccordion";
import { MemberTabAccordion } from "../accordion/MemberTabAccordion";
import { Group, DailyGroupScrum } from "../types";

type Member = { id: string; name: string };
type UserScrum = { userId: string; userName: string; answers: string[] };

const demoGroup: Group = {
  id: "g1",
  name: "주간 스크럼팀",
  inviteCode: "HJQ5Q8F2",
  members: [
    { id: "u1", name: "홍길동" },
    { id: "u2", name: "이몽룡" },
  ],
  questions: [
    "어제 무엇을 하셨나요?",
    "오늘 계획은 무엇인가요?",
    "진행 중 장애물이 있나요?",
  ],
};

const demoDailyScrums: DailyGroupScrum[] = [
  {
    date: "2025-07-21",
    answersByUser: [
      {
        userId: "u1",
        userName: "홍길동",
        answers: ["API 개발 완료", "프론트엔드 작업", "없음"],
      },
      {
        userId: "u2",
        userName: "이몽룡",
        answers: ["DB 설계", "문서 작성", "요구사항 미확정"],
      },
    ],
  },
  {
    date: "2025-07-20",
    answersByUser: [
      {
        userId: "u1",
        userName: "홍길동",
        answers: ["깃 브랜치 정리", "API 설계", ""],
      },
    ],
  },
];

export default function GroupScrumDetailPage() {
  const [tab, setTab] = useState<"date" | "member">("date");
  const [openDates, setOpenDates] = useState<string[]>([]);
  const [openMembers, setOpenMembers] = useState<string[]>([]);
  const today = "2025-07-21";
  const myUserId = "u1";

  const myTodayScrum = false;

  // const myTodayScrum = demoDailyScrums
  // .find((d) => d.date === today)
  // ?.answersByUser.find((a) => a.userId === myUserId);

  // 날짜 최신순
  const scrums = demoDailyScrums
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));
  return (
    <AuthProvider>
      <NavBar />
      <div
        style={{
          maxWidth: 600,
          minHeight: "100vh",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <GroupHeader group={demoGroup} />
        <TodayScrumStatus isSrumToday={Boolean(myTodayScrum)} />
        <TabBar tab={tab} setTab={setTab} />
        <main style={{ flex: 1, padding: "0 18px" }}>
          {tab === "date" ? (
            <DateAccordion
              scrums={scrums}
              questions={demoGroup.questions}
              openDates={openDates}
              setOpenDates={setOpenDates}
            />
          ) : (
            <MemberTabAccordion
              members={demoGroup.members}
              scrums={scrums}
              questions={demoGroup.questions}
              openMembers={openMembers}
              setOpenMembers={setOpenMembers}
            />
          )}
        </main>
        <div style={{ height: 16 }} />
      </div>
    </AuthProvider>
  );
}
