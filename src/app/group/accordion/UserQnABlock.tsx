import React from "react";

interface UserQnABlockProps {
  userName: string;
  questions: string[];
  answers: string[];
}

export function UserQnABlock({
  userName,
  questions,
  answers,
}: UserQnABlockProps) {
  return (
    <div
      style={{
        borderRadius: 9,
        background: "#fff",
        border: "1px solid #ecedf1",
        marginBottom: 18,
        padding: "14px 0 14px 0",
        boxShadow: "0 1px 3px rgba(70,81,102,0.01)",
      }}
    >
      <div style={{ marginTop: 4, padding: "0 12px" }}>
        {questions.map((q, idx) => (
          <React.Fragment key={idx}>
            {/* Q 블록 */}
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
                marginBottom: 2,
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
                style={{
                  color: "#424242",
                  fontWeight: 500,
                  lineHeight: 1.54,
                  whiteSpace: "pre-line",
                }}
              >
                {q}
              </span>
            </div>
            {/* A 블록 */}
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
                marginBottom: 10,
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
                style={{
                  color: "#3b413c",
                  fontWeight: 500,
                  lineHeight: 1.54,
                  whiteSpace: "pre-line",
                }}
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
      </div>
    </div>
  );
}
