export function UserQnABlock({
  userName,
  questions,
  answers,
}: {
  userName: string;
  questions: string[];
  answers: string[];
}) {
  return (
    <div
      style={{
        borderRadius: 8,
        background: "#fff",
        border: "1px solid #ecedf1",
        marginBottom: 18,
        padding: "15px 17px",
      }}
    >
      <b style={{ color: "#345", fontSize: "1.08rem" }}>{userName}</b>
      <div style={{ marginTop: 10 }}>
        {questions.map((q, idx) => (
          <div key={idx} style={{ marginBottom: 13 }}>
            <div
              style={{ background: "#fff", fontWeight: 500, marginBottom: 3 }}
            >
              Q{idx + 1}. {q}
            </div>
            <div style={{ marginLeft: 14, color: "#333", fontWeight: 400 }}>
              {answers[idx] ? (
                answers[idx]
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
