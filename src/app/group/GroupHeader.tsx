import React from "react";
import { GroupDetailResponseDTO } from "@/services/group/dto/group.dto";
import { useRouter } from "next/navigation";
import { MdSettings } from "react-icons/md"; // ← 추가

export function GroupHeader({ group }: { group: GroupDetailResponseDTO }) {
  const router = useRouter();
  const isManager = group.isManager;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "28px 0 14px 0",
        borderBottom: "1px solid #eceef1",
      }}
    >
      <span
        style={{
          fontWeight: 700,
          fontSize: "1.25rem",
          lineHeight: 1.4,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {group.name}
        {isManager && (
          <MdSettings
            size={22}
            style={{ cursor: "pointer", marginLeft: 4 }}
            onClick={() => router.push(`/group/${group.id}/manage`)}
            title="설정"
            color="#999"
          />
        )}
      </span>

      <span style={{ color: "#555", fontSize: "1.03rem", marginLeft: "auto" }}>
        멤버 {group.members.length}명 | 질문 {group.questions.length}개
      </span>
    </div>
  );
}
