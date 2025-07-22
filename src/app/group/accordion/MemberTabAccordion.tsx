import React from "react";
import { Member, DailyGroupScrum } from "../types";
import { UserQnASectionByDate } from "./UserQnASectionByDate";
import { GroupMemberResponseDTO } from "@/service/groupMember/dto/groupMemberResponse.dto";
import { DailyScrumDTO } from "@/service/scrum/dto/DailyScrun";

type MemberTabAccordionProps = {
  members: GroupMemberResponseDTO[];
  openMembers: string[];
  setOpenMembers: React.Dispatch<React.SetStateAction<string[]>>;
  scrums: DailyScrumDTO[];
};

export function MemberTabAccordion({
  members,
  scrums,
  openMembers,
  setOpenMembers,
}: MemberTabAccordionProps) {
  function getUserScrumsByDate(userId: string) {
    return scrums
      .map((d) => ({
        date: d.date,
        userScrum: d.answersByUser.find((a) => a.userId === userId),
      }))
      .filter((x) => !!x.userScrum);
  }

  const toggle = (id: string) => {
    setOpenMembers((open) =>
      open.includes(id) ? open.filter((openId) => openId !== id) : [...open, id]
    );
  };

  return (
    <div style={{ marginTop: 14 }}>
      {members.map((member) => {
        const isOpen = openMembers.includes(member.id);
        const allDatesScrums = getUserScrumsByDate(member.id);

        return (
          <div
            key={member.id}
            style={{
              background: "#f5f6fa",
              borderRadius: "8px",
              border: "1.5px solid #edeef1",
              marginBottom: 14,
              fontWeight: 500,
              cursor: "pointer",
              fontSize: "1.08rem",
              padding: "15px 18px",
            }}
            onClick={() => toggle(member.id)}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              {member.name}
              <span
                style={{
                  marginLeft: 10,
                  color: "#9aadc9",
                  fontSize: "1.08em",
                }}
              >
                {isOpen ? "▼" : "▶"}
              </span>
            </div>
            {isOpen && (
              <div style={{ marginTop: 13 }}>
                {allDatesScrums.length === 0 ? (
                  <div style={{ color: "#aaa", margin: "8px 0" }}>
                    작성 내역 없음
                  </div>
                ) : (
                  allDatesScrums.map(
                    ({ date, userScrum }) =>
                      userScrum && (
                        <UserQnASectionByDate
                          key={date}
                          date={date}
                          questions={userScrum?.questions ?? []}
                          answers={userScrum?.answers ?? []}
                        />
                      )
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
