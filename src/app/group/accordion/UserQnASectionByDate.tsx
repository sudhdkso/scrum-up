import React from "react";

interface SectionProps {
  date: string;
  questions: string[];
  answers: string[];
}

export function UserQnASectionByDate({
  date,
  questions,
  answers,
}: SectionProps) {
  return (
    <div
      style={{
        marginBottom: 13,
        padding: "10px 11px",
        background: "#fff",
        borderRadius: 6,
        border: "1px solid #ecedf1",
      }}
    >
      <div
        style={{
          fontSize: "1.06rem",
          fontWeight: 600,
          marginBottom: 7,
          color: "#466",
        }}
      >
        {date}
      </div>
      <div>
        {questions.map((q, qIdx) => (
          <div key={qIdx} style={{ marginBottom: 8 }}>
            <div style={{ color: "#577", fontWeight: 500 }}>
              Q{qIdx + 1}. {q}
            </div>
            <div style={{ marginLeft: 15, color: "#222" }}>
              {answers[qIdx] ? (
                answers[qIdx]
              ) : (
                <span style={{ color: "#bbb" }}>미작성</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
