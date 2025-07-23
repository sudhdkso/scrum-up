import React, { useState } from "react";
import { UserQnABlock } from "./UserQnABlock";
import { DailyScrumDTO } from "@/service/scrum/dto/DailyScrun";

export function DateAccordion({
  scrums,
  openDates,
  setOpenDates,
}: {
  scrums: DailyScrumDTO[];
  openDates: string[];
  setOpenDates: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  // 날짜별로 어떤 멤버들이 열려있는지 상태 관리
  const [openMembersByDate, setOpenMembersByDate] = useState<
    Record<string, string[]>
  >({});

  const toggleOpenDate = (date: string) => {
    setOpenDates((open) =>
      open.includes(date) ? open.filter((d) => d !== date) : [...open, date]
    );
    // 날짜가 닫히면 하위 멤버 오픈상태 초기화(선택)
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
                borderRadius: 8,
                border: "1.5px solid #e4e6ea",
                marginBottom: 14,
                fontWeight: 600,
                fontSize: "1.08rem",
                padding: "0 0 0 0",
              }}
            >
              {/* 날짜 아코디언 헤더 */}
              <div
                onClick={() => toggleOpenDate(date)}
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
                <span style={{ marginRight: 8, fontSize: 19 }}>📅</span>
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
                  style={{ padding: "0 12px 12px 12px", background: "#fff" }}
                >
                  {(answersByUser ?? []).length === 0 ? (
                    <div style={{ color: "#aaa", margin: "20px 0" }}>
                      작성 내역 없음
                    </div>
                  ) : (
                    (answersByUser ?? []).map((userInfo) => {
                      const { userId, userName, questions, answers } = userInfo;
                      const isMemberOpen = openMembers.includes(userId);

                      return (
                        <div
                          key={userId}
                          style={{
                            border: "1px solid #ecedef",
                            borderRadius: 6,
                            margin: "12px 0",
                            boxShadow: "0 1px 2px rgba(72,81,102,0.025)",
                            background: "#fafcff",
                            padding: 0,
                          }}
                        >
                          {/* 멤버별 아코디언 헤더 */}
                          <div
                            onClick={() => toggleMember(date, userId)}
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
                              👤
                            </span>
                            <span style={{ fontWeight: 700 }}>{userName}</span>
                            <span
                              style={{
                                marginLeft: "auto",
                                color: "#b2b7cb",
                                fontSize: "1em",
                              }}
                            >
                              {isMemberOpen ? "▼" : "▶"}
                            </span>
                          </div>
                          {/* 멤버 QNA가 펼쳐졌을 때만 상세내용 */}
                          {isMemberOpen && (
                            <div style={{ padding: "6px 6px 11px 6px" }}>
                              <UserQnABlock
                                userName={userName}
                                questions={questions}
                                answers={answers}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
