import React, { useState } from "react";
import { UserQnASectionByDate } from "./UserQnASectionByDate";
import { GroupMemberResponseDTO } from "@/service/groupMember/dto/groupMemberResponse.dto";
import { DailyScrumDTO } from "@/service/scrum/dto/DailyScrun";

// props 타입
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
              borderRadius: 8,
              border: "1.5px solid #e4e6ea",
              marginBottom: 14,
              fontWeight: 600,
              fontSize: "1.08rem",
              padding: 0,
            }}
          >
            {/* 멤버 아코디언 헤더 */}
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
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                transition: "background 0.14s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#f7f9fc";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "";
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
            {/* 멤버가 열렸을 때만 날짜별 아코디언 노출 */}
            {isOpen && (
              <div
                style={{
                  padding: "0 12px 12px 12px",
                  background: "#fff",
                }}
              >
                {allDatesScrums.length === 0 ? (
                  <div style={{ color: "#aaa", margin: "20px 0" }}>
                    작성 내역 없음
                  </div>
                ) : (
                  allDatesScrums.map(({ date, userScrum }) =>
                    userScrum ? (
                      <div
                        key={date}
                        style={{
                          border: "1px solid #ecedef",
                          borderRadius: 6,
                          margin: "12px 0",
                          boxShadow: "0 1px 2px rgba(72,81,102,0.025)",
                          background: "#fafcff",
                          padding: 0,
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
                            padding: "10px 14px",
                            userSelect: "none",
                            borderRadius: 6,
                            width: "100%",
                            boxSizing: "border-box",
                            transition: "background 0.13s",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = "#f3f5f9";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = "";
                          }}
                        >
                          <span style={{ fontSize: 17, marginRight: 8 }}>
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
                        {/* 날짜(QNA)가 펼쳐졌을 때만 상세내용 */}
                        {openDates.includes(date) && (
                          <div style={{ padding: "6px 6px 11px 6px" }}>
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
