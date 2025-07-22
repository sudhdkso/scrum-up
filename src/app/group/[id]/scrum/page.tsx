"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getGroupDetail } from "@/lib/group";
import { GroupDetailResponseDTO } from "@/service/group/dto/groupDetailResponse.dto";
import { AuthProvider } from "@/app/components/AuthProvider";
import NavBar from "@/app/components/NavBar";
import styles from "@/app/style/scrumForm.module.css";

// 답변 제출 함수
async function submitScrumAnswer({
  groupId,
  answers,
  scrumId,
}: {
  groupId: string;
  answers: string[];
  scrumId?: string | null;
}) {
  const api = scrumId ? `/api/scrum/${scrumId}` : `/api/group/${groupId}/scrum`;
  const method = scrumId ? "PATCH" : "POST";
  const res = await fetch(api, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  if (!res.ok) throw new Error("스크럼 답변 제출 실패");
  return res.json();
}

export default function GroupScrumWritePage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params!.id as string;

  const [group, setGroup] = useState<GroupDetailResponseDTO | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [scrumId, setScrumId] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) return;

    (async () => {
      setError(null);
      setLoading(true);
      try {
        const group = (await getGroupDetail(groupId)).group;
        setGroup(group);

        const res = await fetch(`/api/scrum/today?groupId=${groupId}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = (await res.json()).todayScrum;
          if (data && data.answers) {
            setAnswers(data.answers);
            setScrumId(data._id);
          } else {
            // 작성 경험이 한 번도 없는 경우
            setAnswers(Array(group.questions.length).fill(""));
            setScrumId(null);
          }
        } else {
          setAnswers(Array(group.questions.length).fill(""));
          setScrumId(null);
        }
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, [groupId]);
  const handleAnswerChange = (idx: number, value: string) => {
    setAnswers((prev) => prev.map((v, i) => (i === idx ? value : v)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    try {
      await submitScrumAnswer({ groupId, answers, scrumId });
      router.push(`/group/${groupId}`);
    } catch (e) {
      setError(e as Error);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error.message}</div>;
  if (!group) return <div>그룹을 찾을 수 없습니다.</div>;

  return (
    <AuthProvider>
      <NavBar />
      <div>
        <div className={styles.centerContainer}>
          <h2></h2>
          <form className={styles.formContainer} onSubmit={handleSubmit}>
            {/* 상단: 그룹/날짜 */}
            <div style={{ marginBottom: 20 }}>
              <GroupHeaderWithDate groupName={group.name} />
            </div>
            <div
              style={{
                background: "#e8f3ff",
                color: "#246",
                padding: "8px 14px",
                borderRadius: 9,
                fontWeight: 600,
                fontSize: "1.08rem",
                marginBottom: 21,
              }}
            >
              📌 오늘의 스크럼 질문
            </div>
            {/* 질문 + 답변 입력 */}
            {group.questions.map((q, idx) => (
              <div key={idx} style={{ marginBottom: 22 }}>
                <div
                  style={{ marginBottom: 7, fontWeight: 600, color: "#345" }}
                >
                  {idx + 1}. {q}
                </div>
                <textarea
                  value={answers[idx]}
                  onChange={(e) => handleAnswerChange(idx, e.target.value)}
                  rows={3}
                  style={{
                    width: "100%",
                    borderRadius: 6,
                    border: "1.2px solid #c9def7",
                    padding: "10px 12px",
                    fontSize: "1.08rem",
                    resize: "vertical",
                    outline: "none",
                  }}
                  placeholder="여기에 답변을 입력하세요"
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={submitLoading}
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "1.16rem",
                fontWeight: 600,
                borderRadius: 8,
                border: "none",
                background: "#2979ff",
                color: "#fff",
                marginTop: 20,
                cursor: submitLoading ? "not-allowed" : "pointer",
              }}
            >
              {submitLoading ? "제출 중..." : "제출하기"}
            </button>
          </form>
        </div>
      </div>
    </AuthProvider>
  );
}

function getKoreanDateString(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = (date.getMonth() + 1).toString().padStart(2, "0");
  const dd = date.getDate().toString().padStart(2, "0");
  return `오늘은 ${yyyy}년 ${mm}월 ${dd}일 입니다!`;
}

export function GroupHeaderWithDate({ groupName }: { groupName: string }) {
  const now = new Date();
  const dateStr = getKoreanDateString(now);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontWeight: 700,
        fontSize: "1.15rem",
        color: "#333",
        marginBottom: 8,
        flexWrap: "wrap",
      }}
    >
      <span style={{ fontWeight: 700, marginRight: 15 }}>{groupName}</span>
      {/* 오늘 날짜 */}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          fontWeight: 500,
          color: "#6A667A",
        }}
      >
        <span style={{ fontSize: "1.3em", marginRight: 6, lineHeight: 1 }}>
          🌸
        </span>
        {dateStr}
      </span>
    </div>
  );
}
