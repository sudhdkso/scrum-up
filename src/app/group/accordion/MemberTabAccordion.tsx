import React, { useState } from "react";
import { UserQnABlock } from "./UserQnABlock";
import { GroupMemberResponseDTO } from "@/services/groupMember/dto/groupMemberResponse.dto";
import { DailyScrumDTO } from "@/services/scrum/dto/DailyScrun";
import styles from "./accordionCard.module.css"; // 추가!

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
          <div key={member.id} className={styles.accordionCardWrap}>
            {/* 멤버 헤더 */}
            <div
              className={styles.accordionHeader}
              onClick={() => toggleOpenMember(member.id)}
              tabIndex={0}
            >
              <span className={styles.accordionIcon}>👤</span>
              <span style={{ fontWeight: 700 }}>{member.name}</span>
              <span className={styles.accordionChevron}>
                {isOpen ? "▼" : "▶"}
              </span>
            </div>
            {isOpen && (
              <div className={styles.accordionBody}>
                {allDatesScrums.length === 0 ? (
                  <div style={{ color: "#aaa", margin: "20px 0" }}>
                    작성 내역 없음
                  </div>
                ) : (
                  allDatesScrums.map(({ date, userScrum }) =>
                    userScrum ? (
                      <div key={date} className={styles.accordionCardWrap}>
                        <div
                          className={styles.accordionHeader}
                          onClick={() => toggleOpenDate(member.id, date)}
                          tabIndex={0}
                        >
                          <span className={styles.accordionIcon}>📅</span>
                          <span style={{ fontWeight: 700 }}>{date}</span>
                          <span className={styles.accordionChevron}>
                            {openDates.includes(date) ? "▼" : "▶"}
                          </span>
                        </div>
                        {openDates.includes(date) && (
                          <div className={styles.accordionBody}>
                            <UserQnABlock
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
