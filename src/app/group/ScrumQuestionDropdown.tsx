import React, { useState } from "react";

function ScrumQuestionDropdown({ questions }: { questions: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        marginBottom: 22,
        padding: "15px 16px",
        background: "#f7faff",
        borderRadius: 10,
        boxShadow: "0 1px 5px rgba(160,180,210,0.06)",
        position: "relative",
      }}
    >
      {/* 오늘의 질문 - 항상 한 줄만 노출 */}
      <div
        style={{
          cursor: "pointer",
          fontWeight: 700,
          fontSize: "1.10rem",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
        onClick={() => setOpen((v) => !v)}
        title={open ? "질문 닫기" : "전체 질문 보기"}
      >
        📌 오늘의 스크럼 질문
        <span
          style={{
            marginLeft: "auto",
            fontSize: "1.3rem",
            transform: `rotate(${open ? 180 : 0}deg)`,
            transition: "0.2s",
          }}
        >
          ▼
        </span>
      </div>

      {/* 드롭다운: 전체 질문(넘버링된 목록) */}
      {open && (
        <ol style={{ paddingLeft: 22, marginTop: 9, marginBottom: 0 }}>
          {questions.length > 0 ? (
            questions.map((q, idx) => (
              <li key={idx} style={{ marginBottom: 6, fontSize: "1.04rem" }}>
                <b>{idx + 1}. </b>
                {q}
              </li>
            ))
          ) : (
            <li>등록된 질문이 없습니다.</li>
          )}
        </ol>
      )}
    </div>
  );
}

export default ScrumQuestionDropdown;
