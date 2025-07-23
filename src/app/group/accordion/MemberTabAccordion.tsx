import React, { useState } from "react";
import { UserQnASectionByDate } from "./UserQnASectionByDate";
import { GroupMemberResponseDTO } from "@/service/groupMember/dto/groupMemberResponse.dto";
import { DailyScrumDTO } from "@/service/scrum/dto/DailyScrun";

type MemberTabAccordionProps = {
  members: GroupMemberResponseDTO[];
  scrums: DailyScrumDTO[];
  openMembers: string[];
  setOpenMembers: React.Dispatch<React.SetStateAction<string[]>>;
};

export function MemberTabAccordion({
  members,
  scrums,
  openMembers,
  setOpenMembers,
}: MemberTabAccordionProps) {
  const [openDatesByMember, setOpenDatesByMember] = useState<
    Record<string, string[]>
  >({});

  function getUserScrumsByDate(userId: string) {
    return scrums
      .map((d) => ({
        date: d.date,
        userScrum: d.answersByUser.find((a) => a.userId === userId),
      }))
      .filter((x) => !!x.userScrum);
  }

  const toggleOpenMember = (memberId: string) => {
    setOpenMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
    setOpenDatesByMember((prev) => ({ ...prev, [memberId]: [] }));
  };

  const toggleOpenDate = (memberId: string, date: string) => {
    setOpenDatesByMember((prev) => {
      const openDates = prev[memberId] || [];
      return {
        ...prev,
        [memberId]: openDates.includes(date)
          ? openDates.filter((d) => d !== date)
          : [...openDates, date],
      };
    });
  };

  return (
    <div style={{ marginTop: 16 }}>
      {members.map((member) => {
        const isOpen = openMembers.includes(member.id);
        const allDatesScrums = getUserScrumsByDate(member.id);
        const openDates = openDatesByMember[member.id] ?? [];

        return (
          <div
            key={member.id}
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1.5px solid #e4e6ea",
              marginBottom: 14,
              boxShadow: "0 1px 4px rgba(80,90,110,0.02)",
              fontWeight: 600,
              fontSize: "1.08rem",
              padding: 0,
              overflow: "hidden", // 카드 내부 끊김 방지
              transition: "box-shadow 0.18s",
            }}
          >
            {/* 멤버 헤더 */}
            <div
              onClick={() => toggleOpenMember(member.id)}
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "1.13rem",
                padding: "15px 18px",
                userSelect: "none",
                cursor: "pointer",
                width: "100%",
                boxSizing: "border-box",
                background: "#fff",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                transition: "background 0.14s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#f7f9fc";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#fff";
              }}
            >
              <span style={{ marginRight: 8, fontSize: 19 }}>👤</span>
              <span style={{ fontWeight: 700 }}>{member.name}</span>
              <span
                style={{
                  marginLeft: "auto",
                  color: "#9aadc9",
                  fontSize: "1.13em",
                }}
              >
                {isOpen ? "▼" : "▶"}
              </span>
            </div>

            {isOpen && (
              <div style={{ padding: "0 12px 16px 12px", background: "#fff" }}>
                {allDatesScrums.length === 0 ? (
                  <div style={{ color: "#aaa", margin: "20px 0" }}>
                    작성 내역 없음
                  </div>
                ) : (
                  allDatesScrums.map(({ date, userScrum }, idx) =>
                    userScrum ? (
                      <div
                        key={date}
                        style={{
                          border: "1.3px solid #e2e7ed",
                          borderRadius: 8,
                          marginBottom:
                            idx < allDatesScrums.length - 1 ? 13 : 0,
                          background: openDates.includes(date)
                            ? "#f2f6fa"
                            : "#fafcff",
                          boxShadow: "none",
                          overflow: "hidden",
                          transition: "background 0.18s, border 0.15s",
                        }}
                      >
                        {/* 날짜별 아코디언 헤더 */}
                        <div
                          onClick={() => toggleOpenDate(member.id, date)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            fontWeight: 600,
                            fontSize: "1em",
                            cursor: "pointer",
                            padding: "12px 15px 12px 15px",
                            borderBottom: openDates.includes(date)
                              ? "1px solid #b2defc"
                              : "1px solid #f0f2f5",
                            background: openDates.includes(date)
                              ? "#eaf6fd"
                              : "transparent",
                            width: "100%",
                            boxSizing: "border-box",
                            transition: "background 0.13s, border 0.14s",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = "#f2f8fe";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background =
                              openDates.includes(date)
                                ? "#eaf6fd"
                                : "transparent";
                          }}
                        >
                          <span style={{ fontSize: 16, marginRight: 8 }}>
                            📅
                          </span>
                          <span style={{ fontWeight: 700 }}>{date}</span>
                          <span
                            style={{
                              marginLeft: "auto",
                              color: "#b2b7cb",
                              fontSize: "1em",
                            }}
                          >
                            {openDates.includes(date) ? "▼" : "▶"}
                          </span>
                        </div>
                        {/* Q/A 본문: 오직 열렸을 때만 내부에 표시, 패딩 부여 */}
                        {openDates.includes(date) && (
                          <div
                            style={{
                              padding: "11px 13px 13px 13px",
                              background: "#fff",
                            }}
                          >
                            <UserQnASectionByDate
                              date={date}
                              questions={userScrum.questions ?? []}
                              answers={userScrum.answers ?? []}
                            />
                          </div>
                        )}
                      </div>
                    ) : null
                  )
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
