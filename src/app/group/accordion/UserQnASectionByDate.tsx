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
        margin: "15px 0 26px 0",
        padding: "0 8px",
      }}
    >
      {questions.map((q, idx) => (
        <React.Fragment key={idx}>
          {/* Q 블럭 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255,236,109,0.09)",
              color: "#88752a",
              borderRadius: 5,
              fontWeight: 500,
              fontSize: "1em",
              padding: "6px 12px",
              marginBottom: 3,
              minHeight: 28,
              transition: "background 0.17s, box-shadow 0.17s",
              cursor: "default",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255,236,109,0.17)";
              e.currentTarget.style.boxShadow =
                "0 1px 4px rgba(180,180,140,0.04)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255,236,109,0.09)";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            <span
              style={{
                marginRight: 9,
                color: "#bcae58",
                fontWeight: 600,
                fontSize: "1em",
              }}
            >
              Q.
            </span>
            <span
              style={{ color: "#424242", fontWeight: 500, lineHeight: 1.54 }}
            >
              {q}
            </span>
          </div>
          {/* A 블럭 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(186,245,168,0.07)",
              color: "#497a59",
              borderRadius: 5,
              fontWeight: 500,
              fontSize: "1em",
              padding: "6px 12px",
              marginBottom: 8,
              minHeight: 28,
              transition: "background 0.17s, box-shadow 0.17s",
              cursor: "default",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(186,245,168,0.18)";
              e.currentTarget.style.boxShadow =
                "0 1px 4px rgba(130,180,140,0.06)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(186,245,168,0.07)";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            <span
              style={{
                marginRight: 9,
                color: "#74ba8a",
                fontWeight: 600,
                fontSize: "1em",
              }}
            >
              A.
            </span>
            <span
              style={{ color: "#3b413c", fontWeight: 500, lineHeight: 1.54 }}
            >
              {answers[idx] && answers[idx].trim() !== "" ? (
                answers[idx]
              ) : (
                <span style={{ color: "#bbb", fontWeight: 500 }}>미작성</span>
              )}
            </span>
          </div>
        </React.Fragment>
      ))}
      <hr
        style={{
          border: 0,
          borderTop: "1.1px solid #ececec",
          margin: "15px 0 0 0",
        }}
      />
    </div>
  );
}
