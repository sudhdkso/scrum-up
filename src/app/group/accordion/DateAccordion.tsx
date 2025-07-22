import React from "react";
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
  const toggleOpen = (date: string) => {
    setOpenDates((open) =>
      open.includes(date) ? open.filter((d) => d !== date) : [...open, date]
    );
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
          const isOpen = openDates.includes(date);
          return (
            <div
              key={date}
              style={{
                background: "#f5f6fa",
                borderRadius: 8,
                border: "1.5px solid #e4e6ea",
                marginBottom: 14,
                fontWeight: 600,
                minHeight: 44,
                cursor: "pointer",
                fontSize: "1.08rem",
                padding: "15px 18px 0 18px",
              }}
            >
              <div
                onClick={() => toggleOpen(date)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1.12rem",
                  userSelect: "none",
                  marginBottom: 7,
                }}
              >
                {date}
                <span
                  style={{ marginLeft: 9, color: "#9aadc9", fontSize: "1.1em" }}
                >
                  {isOpen ? "▼" : "▶"}
                </span>
              </div>
              {isOpen && (
                <div style={{ marginTop: 13 }}>
                  {(answersByUser ?? []).length === 0 ? (
                    <div style={{ color: "#aaa", margin: "8px 0" }}>
                      작성된 스크럼이 없습니다.
                    </div>
                  ) : (
                    (answersByUser ?? []).map((u) => (
                      <UserQnABlock
                        key={u.userId}
                        userName={u.userName}
                        questions={u.questions}
                        answers={u.answers}
                      />
                    ))
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
