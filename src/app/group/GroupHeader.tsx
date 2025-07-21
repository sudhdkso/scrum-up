import React, { useState } from "react";
import { Group } from "./types";

export function GroupHeader({ group }: { group: Group }) {
  const [copyMsg, setCopyMsg] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(group.inviteCode);
    setCopyMsg(true);
    setTimeout(() => setCopyMsg(false), 1500);
  };

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
        }}
      >
        {group.name}
      </span>
      <div
        style={{
          position: "relative",
          display: "inline-block",
          marginLeft: 18,
        }}
      >
        <button
          onClick={handleCopy}
          style={{
            background: "#f3f7fb",
            border: "1px solid #cfd8dc",
            borderRadius: 6,
            padding: "4px 12px",
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          초대코드 복사
        </button>
        {copyMsg && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: "110%",
              background: "#222",
              color: "#fff",
              fontSize: "0.97rem",
              borderRadius: 6,
              padding: "6px 17px",
              whiteSpace: "nowrap",
              opacity: 0.94,
              zIndex: 100,
              boxShadow: "0 3px 12px #ddd",
              marginTop: 2,
            }}
          >
            복사되었습니다!
          </div>
        )}
      </div>
      <span style={{ color: "#555", fontSize: "1.03rem", marginLeft: "auto" }}>
        멤버 {group.members.length}명 | 질문 {group.questions.length}개
      </span>
    </div>
  );
}
