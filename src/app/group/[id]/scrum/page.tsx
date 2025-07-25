"use client";
import { useRef, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getGroupDetail } from "@/lib/group";
import styles from "./scrumForm.module.css";
import { UserQnABlock } from "../../accordion/UserQnABlock";
import SingleLineInput from "@/components/SingleLineInput";
import GroupHeaderWithDate from "../../GroupHeaderWithDate";

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

  const [group, setGroup] = useState<any>(null);
  const [answers, setAnswers] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [scrumId, setScrumId] = useState<string | null>(null);
  const [error, setError] = useState<any>(null);
  const [yesterdayOpen, setYesterdayOpen] = useState(false);
  const [inputErrors, setInputErrors] = useState<Record<string, boolean>>({});
  const [inputMsgs, setInputMsgs] = useState<Record<string, string>>({});
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

  const yesterdayMock = {
    questions: ["오늘 한 일은?", "막힌 점은?", "내일 할 일은?"],
    answers: [
      "API 버그 수정\n코드 리팩토링",
      "",
      "스터디 발표 준비\n테스트 코드 작성",
    ],
  };

  useEffect(() => {
    (async () => {
      setError(null);
      setLoading(true);
      try {
        const groupRes = await getGroupDetail(groupId);
        setGroup(groupRes.group);

        let initAnswers: string[][] = groupRes.group.questions.map(() => [""]);
        let gotScrum = null;

        if (groupRes.group.isScrumToday) {
          const res = await fetch(`/api/scrum/today?groupId=${groupId}`, {
            credentials: "include",
          });
          if (res.ok) {
            gotScrum = (await res.json()).todayScrum;
            setScrumId(gotScrum._id);
          }
        }
        if (gotScrum && gotScrum.answers) {
          initAnswers = gotScrum.answers.map((a: string = "") =>
            a ? a.split("\n") : [""]
          );
        }
        setAnswers(initAnswers);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [groupId, scrumId]);

  useEffect(() => {
    if (answers.length !== inputRefs.current.length)
      inputRefs.current = answers.map((arr, i) => Array(arr.length).fill(null));
    else {
      answers.forEach((arr, i) => {
        if (!inputRefs.current[i]) inputRefs.current[i] = [];
        if (arr.length !== inputRefs.current[i].length)
          inputRefs.current[i] = Array(arr.length).fill(null);
      });
    }
  }, [answers]);

  const handleAnswerChange = (qIdx: number, lineIdx: number, v: string) => {
    setAnswers((prev) =>
      prev.map((arr, i) =>
        i === qIdx ? arr.map((val, j) => (j === lineIdx ? v : val)) : arr
      )
    );
    setInputErrors((prev) => ({ ...prev, [`${qIdx}_${lineIdx}`]: false }));
    setInputMsgs((prev) => ({ ...prev, [`${qIdx}_${lineIdx}`]: "" }));
  };
  const handleLineAdd = (qIdx: number, lIdx: number) => {
    if (!answers[qIdx][lIdx] || !answers[qIdx][lIdx].trim()) {
      const emptyLine = answers[qIdx].findIndex((line) => !line.trim());
      setInputErrors((prev) => ({
        ...prev,
        [`${qIdx}_${emptyLine >= 0 ? emptyLine : lIdx}`]: true,
      }));
      setInputMsgs((prev) => ({
        ...prev,
        [`${qIdx}_${emptyLine >= 0 ? emptyLine : lIdx}`]:
          "한 글자 이상 입력하세요",
      }));
      return;
    }
    setAnswers((prev) =>
      prev.map((arr, i) => (i === qIdx ? [...arr, ""] : arr))
    );
    setTimeout(() => {
      const ref = inputRefs.current[qIdx]?.[answers[qIdx].length];
      if (ref) ref.focus();
    }, 0);
  };
  const handleRemoveLine = (qIdx: number, lIdx: number) => {
    setAnswers((prev) =>
      prev.map((arr, i) =>
        i === qIdx
          ? arr.length === 1
            ? arr
            : arr.filter((_, j) => j !== lIdx)
          : arr
      )
    );
    setInputErrors((prev) => {
      const next = { ...prev };
      delete next[`${qIdx}_${lIdx}`];
      return next;
    });
    setInputMsgs((prev) => {
      const next = { ...prev };
      delete next[`${qIdx}_${lIdx}`];
      return next;
    });
  };
  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    qIdx: number,
    lIdx: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!answers[qIdx][lIdx] || !answers[qIdx][lIdx].trim()) {
        setInputErrors((prev) => ({ ...prev, [`${qIdx}_${lIdx}`]: true }));
        setInputMsgs((prev) => ({
          ...prev,
          [`${qIdx}_${lIdx}`]: "한 글자 이상 입력하세요",
        }));
        return;
      }
      if (answers[qIdx].some((line, idx) => !line.trim() && idx !== lIdx)) {
        return;
      }
      handleLineAdd(qIdx, lIdx);
    }
  };
  const handleAddClick = (qIdx: number, lIdx: number) => {
    handleLineAdd(qIdx, lIdx);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);
    try {
      const processed = answers.map((arr) =>
        arr
          .map((x) => x.trim())
          .filter(Boolean)
          .join("\n")
      );
      await submitScrumAnswer({ groupId, answers: processed, scrumId });
      router.push(`/group/${groupId}`);
    } catch (e) {
      setError(e);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error)
    return <div className={styles.error}>{error.message || String(error)}</div>;
  if (!group || !group.questions)
    return <div className={styles.error}>그룹/질문 데이터 없음</div>;

  return (
    <form onSubmit={handleSubmit} className={styles.formRoot}>
      <div className={styles.headSection}>
        <div style={{ marginBottom: 20 }}>
          <GroupHeaderWithDate groupName={group.name} />
        </div>
        {group.desc && <div className={styles.groupDesc}>{group.desc}</div>}
      </div>
      <div className={styles.yesterdaySection}>
        <button
          type="button"
          aria-expanded={yesterdayOpen}
          onClick={() => setYesterdayOpen((v) => !v)}
          className={styles.yesterdayToggleBtn}
        >
          📝 어제 내 스크럼 {yesterdayOpen ? "▲" : "▼"}
        </button>
        {yesterdayOpen && (
          <div className={styles.yesterdayBox}>
            <UserQnABlock
              questions={yesterdayMock.questions}
              answers={yesterdayMock.answers}
            />
          </div>
        )}
      </div>
      {group.questions.map((text: string, i: number) => (
        <div key={i} className={styles.questionBoxOuter}>
          <div className={styles.questionHeaderRow}>
            <span className={styles.questionTitle}>
              {i + 1}. {text}
            </span>
          </div>
          {answers[i]?.map((answer, j) => (
            <SingleLineInput
              key={j}
              value={answer}
              ref={(el) => {
                if (!inputRefs.current[i]) inputRefs.current[i] = [];
                inputRefs.current[i][j] = el;
              }}
              onChange={(v) => handleAnswerChange(i, j, v)}
              onKeyDown={(e) => handleInputKeyDown(e as any, i, j)}
              placeholder={j === 0 ? "답변 입력 후 엔터 또는 +" : "추가 입력"}
              errorMsg={inputErrors[`${i}_${j}`] ? inputMsgs[`${i}_${j}`] : ""}
              showAddButton={j === answers[i].length - 1}
              showRemoveButton={answers[i].length > 1}
              onAdd={() => handleAddClick(i, j)}
              onRemove={() => handleRemoveLine(i, j)}
            />
          ))}
        </div>
      ))}
      <button
        type="submit"
        disabled={submitLoading}
        className={styles.submitBtn}
      >
        {submitLoading ? "제출 중..." : "제출하기"}
      </button>
      {error && (
        <div className={styles.errorMsg}>{error.message || String(error)}</div>
      )}
    </form>
  );
}
