import React, { useState } from "react";
import { UserQnABlock } from "./UserQnABlock";
import { DailyScrumDTO } from "@/services/scrum/dto/DailyScrun";
import { InnerAccordionCard } from "@/components/InnerAccordionCard";

export function DateAccordion({
  scrums,
  openDates,
  setOpenDates,
}: {
  scrums: DailyScrumDTO[];
  openDates: string[];
  setOpenDates: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [openMembersByDate, setOpenMembersByDate] = useState<
    Record<string, string[]>
  >({});

  const toggleOpenDate = (date: string) => {
    setOpenDates((open) =>
      open.includes(date) ? open.filter((d) => d !== date) : [...open, date]
    );
    setOpenMembersByDate((prev) => ({ ...prev, [date]: [] }));
  };

  const toggleMember = (date: string, userId: string) => {
    setOpenMembersByDate((prev) => {
      const opened = prev[date] ?? [];
      return {
        ...prev,
        [date]: opened.includes(userId)
          ? opened.filter((id) => id !== userId)
          : [...opened, userId],
      };
    });
  };

  return (
    <div style={{ marginTop: 16 }}>
      {scrums.length === 0 ? (
        <div
          style={{
            color: "#aaa",
            padding: "48px 0",
            textAlign: "center",
            fontSize: "1.10rem",
            fontWeight: 500,
          }}
        >
          작성된 스크럼이 없습니다.
        </div>
      ) : (
        scrums.map(({ date, answersByUser }) => {
          const isDateOpen = openDates.includes(date);
          const openMembers = openMembersByDate[date] ?? [];

          return (
            <div
              key={date}
              style={{
                background: "#fff",
                borderRadius: 12,
                border: "1.5px solid #e4e6ea",
                marginBottom: 20,
                boxShadow: "0 2px 8px rgba(180, 182, 194, 0.07)",
                fontWeight: 600,
                fontSize: "1.08rem",
                padding: 0,
                overflow: "hidden",
                transition: "box-shadow 0.17s",
              }}
            >
              {/* 날짜 아코디언 헤더 */}
              <div
                onClick={() => toggleOpenDate(date)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1.13rem",
                  padding: "17px 24px",
                  userSelect: "none",
                  cursor: "pointer",
                  width: "100%",
                  boxSizing: "border-box",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  background: "#fff",
                  transition: "background 0.14s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#f7f9fc";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#fff";
                }}
              >
                <span style={{ marginRight: 10, fontSize: 20 }}>📅</span>
                <span style={{ fontWeight: 700 }}>{date}</span>
                <span
                  style={{
                    marginLeft: "auto",
                    color: "#9aadc9",
                    fontSize: "1.13em",
                  }}
                >
                  {isDateOpen ? "▼" : "▶"}
                </span>
              </div>
              {/* 날짜가 열렸을 때만 멤버별 아코디언 리스트 노출 */}
              {isDateOpen && (
                <div
                  style={{
                    padding: "0 12px 16px 12px",
                    background: "#fff",
                  }}
                >
                  {(answersByUser ?? []).map((userInfo, idx) => {
                    const { userId, userName, questions, answers } = userInfo;
                    const isMemberOpen = openMembers.includes(userId);

                    return (
                      <InnerAccordionCard
                        key={userId}
                        open={isMemberOpen}
                        headerIcon={
                          <span style={{ fontSize: 16, marginRight: 8 }}>
                            👤
                          </span>
                        }
                        headerTitle={userName}
                        onClickHeader={() => toggleMember(date, userId)}
                      >
                        <UserQnABlock questions={questions} answers={answers} />
                      </InnerAccordionCard>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
