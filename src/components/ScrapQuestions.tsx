interface SQProps {
  questions: string[];
  onChange: (next: string[]) => void;
  maxQuestions?: number;
  inputClassName?: string;
}
export default function ScrapQuestions({
  questions,
  onChange,
  maxQuestions = 10,
  inputClassName,
}: SQProps) {
  const add = () =>
    questions.length < maxQuestions && onChange([...questions, ""]);
  const remove = (idx: number) =>
    questions.length > 1 && onChange(questions.filter((_, i) => i !== idx));
  const update = (idx: number, val: string) =>
    onChange(questions.map((q, i) => (i === idx ? val : q)));

  return (
    <div style={{ fontWeight: 600 }}>
      스크럼 질문{" "}
      <span style={{ fontWeight: 400, color: "#888", fontSize: "0.95em" }}>
        (최소 1개, 최대 {maxQuestions}개)
      </span>
      <div
        style={{
          marginTop: 13,
          display: "flex",
          flexDirection: "column",
          gap: 11,
        }}
      >
        {questions.map((q, i) => (
          <div
            key={i}
            style={{ display: "flex", gap: 8, alignItems: "center" }}
          >
            <input
              value={q}
              placeholder={`질문 ${i + 1}`}
              onChange={(e) => update(i, e.target.value)}
              className={inputClassName}
            />
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => remove(i)}
                style={{
                  background: "#ffe5e5",
                  color: "#d9534f",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  padding: "3px 12px",
                }}
                title="질문 삭제"
              >
                -
              </button>
            )}
            {i === questions.length - 1 && questions.length < maxQuestions && (
              <button
                type="button"
                onClick={add}
                style={{
                  background: "#eaf6fb",
                  color: "#5865f2",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  padding: "3px 12px",
                }}
                title="질문 추가"
              >
                +
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
