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
                    padding: "0 8px 16px 8px",
                    background: "#fafdff",
                  }}
                >
                  {(answersByUser ?? []).length === 0 ? (
                    <div style={{ color: "#aaa", margin: "24px 0" }}>
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
                            border: isMemberOpen
                              ? "1.2px solid #93cbfa"
                              : "1px solid #f2f4f6",
                            borderRadius: 5,
                            margin: "13px 0",
                            background: "#f7fafd",
                            padding: 0,
                            transition: "border 0.18s, background 0.17s",
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
                              padding: "9px 15px",
                              userSelect: "none",
                              borderRadius: 5,
                              width: "100%",
                              boxSizing: "border-box",
                              background: isMemberOpen
                                ? "#edf5fc"
                                : "transparent",
                              transition: "background 0.14s",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = "#f1f6fa";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = isMemberOpen
                                ? "#edf5fc"
                                : "transparent";
                            }}
                          >
                            <span style={{ fontSize: 18, marginRight: 8 }}>
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
                            <div
                              style={{
                                padding: "7px 11px 13px 15px",
                                background: "#fff",
                                borderRadius: 5,
                              }}
                            >
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
