import React, { useState } from "react";
import { UserQnABlock } from "./UserQnABlock";
import { DailyScrumDTO } from "@/services/scrum/dto/DailyScrun";
import styles from "./accordionCard.module.css"; // 추가!

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
            <div key={date} className={styles.accordionCardWrap}>
              {/* 날짜 아코디언 헤더 */}
              <div
                className={styles.accordionHeader}
                onClick={() => toggleOpenDate(date)}
                tabIndex={0}
              >
                <span className={styles.accordionIcon}>📅</span>
                <span style={{ fontWeight: 700 }}>{date}</span>
                <span className={styles.accordionChevron}>
                  {isDateOpen ? "▼" : "▶"}
                </span>
              </div>
              {isDateOpen && (
                <div className={styles.accordionBody}>
                  {(answersByUser ?? []).map((userInfo) => {
                    const { userId, userName, questions, answers } = userInfo;
                    const isMemberOpen = openMembers.includes(userId);

                    return (
                      <div key={userId} className={styles.accordionCardWrap}>
                        <div
                          className={styles.accordionHeader}
                          onClick={() => toggleMember(date, userId)}
                          tabIndex={0}
                        >
                          <span className={styles.accordionIcon}>👤</span>
                          <span style={{ fontWeight: 700 }}>{userName}</span>
                          <span className={styles.accordionChevron}>
                            {isMemberOpen ? "▼" : "▶"}
                          </span>
                        </div>
                        {isMemberOpen && (
                          <div className={styles.accordionBody}>
                            <UserQnABlock
                              questions={questions}
                              answers={answers}
                            />
                          </div>
                        )}
                      </div>
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
