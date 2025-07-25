"use client";
import { useRef, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getScrumFormPage } from "@/lib/group";
import styles from "./scrumForm.module.css";
import { UserQnABlock } from "../../accordion/UserQnABlock";
import SingleLineInput from "@/components/SingleLineInput";
import GroupHeaderWithDate from "../../GroupHeaderWithDate";
import { ScrumFormPageDTO } from "@/services/group/dto/group.dto";
import { DailyScrumUpdateDTO } from "@/services/scrum/dto/DailyScrum";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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

  const [group, setGroup] = useState<ScrumFormPageDTO | null>(null);
  const [answers, setAnswers] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [scrumId, setScrumId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [yesterdayOpen, setYesterdayOpen] = useState(false);
  const [inputErrors, setInputErrors] = useState<Record<string, boolean>>({});
  const [inputMsgs, setInputMsgs] = useState<Record<string, string>>({});
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);
  const [yesterdayScrum, setYesterdayScrum] =
    useState<DailyScrumUpdateDTO | null>(null);

  useEffect(() => {
    (async () => {
      setError(null);
      setLoading(true);
      try {
        const formRes = await getScrumFormPage(groupId);
        if (!formRes) {
          setError(new Error("그룹 정보를 불러올 수 없습니다."));
          setLoading(false);
          return;
        }

        const form = formRes.form;
        setGroup(form);
        let initAnswers: string[][] = [];
        if (form.todayScrum?.answers) {
          initAnswers = form.todayScrum.answers.map((a: string) =>
            a ? a.split("\n") : [""]
          );
          setScrumId(form.todayScrum._id);
        } else {
          initAnswers = form.questions.map(() => [""]);
          setScrumId(null);
        }
        setAnswers(initAnswers);

        setYesterdayScrum(form.yesterdayScrum ?? null);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    })();
    // groupId 바뀔 때마다만 실행
  }, [groupId]);

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
      setError(e as Error);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    const questionCount = group?.questions?.length || 3;
    return (
      <form className={styles.formRoot}>
        <div className={styles.headSection} style={{ marginBottom: 20 }}>
          <Skeleton width={180} height={30} style={{ marginBottom: 10 }} />
          <Skeleton width={150} height={17} style={{ marginBottom: 4 }} />
        </div>
        <div className={styles.yesterdaySection}>
          <Skeleton width={176} height={22} style={{ marginBottom: 7 }} />
          <div className={styles.yesterdayBox}>
            <Skeleton width="65%" height={15} style={{ margin: "3px 0" }} />
            <Skeleton
              width="82%"
              height={14}
              style={{ margin: "2px 0" }}
              count={2}
            />
          </div>
        </div>
        {Array(questionCount)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className={styles.questionBoxOuter}
              style={{ marginBottom: 15 }}
            >
              <div className={styles.questionHeaderRow}>
                <Skeleton width={115} height={17} style={{ marginBottom: 5 }} />
              </div>
              <Skeleton
                width="100%"
                height={35}
                borderRadius={7}
                style={{ marginBottom: 7 }}
              />
            </div>
          ))}
        <Skeleton
          width="100%"
          height={37}
          style={{ marginTop: 22, borderRadius: 6 }}
        />
      </form>
    );
  }

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
              questions={yesterdayScrum?.questions ?? []}
              answers={yesterdayScrum?.answers ?? []}
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
              onKeyDown={(e) => handleInputKeyDown(e, i, j)}
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
      {error && <div className={styles.errorMsg}>{String(error)}</div>}
    </form>
  );
}
