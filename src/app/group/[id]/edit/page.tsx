"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "@/style/groupManage.module.css";
import Button from "@/components/Button";
import { getGroupDetail } from "@/lib/group";
import ScrapQuestions from "@/components/ScrapQuestions";
import { GroupManageDTO } from "@/services/group/dto/group.dto";
import { updateGroupQuestion } from "@/lib/group";

export default function GroupEditPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params?.id as string;
  const [group, setGroup] = useState<GroupManageDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [questionOpen, setQuestionOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    desc: "",
    scrumTime: "",
    questions: [] as string[],
  });

  useEffect(() => {
    if (!groupId) return;
    setLoading(true);

    getGroupDetail(groupId)
      .then((data) => {
        setGroup(data);
        setForm({
          name: data.name || "",
          desc: data.desc || "",
          scrumTime: data.scrumTime || "",
          questions: data.questions || [],
        });
      })
      .catch(() => setError("그룹 정보를 불러올 수 없습니다."))
      .finally(() => setLoading(false));
  }, [groupId]);

  const handleChange = (key: keyof typeof form, value: string | string[]) => {
    setForm((old) => ({ ...old, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      //await updateGroupDetail(groupId, form);
      alert("그룹 정보가 저장되었습니다!");
      router.push(`/group/${groupId}/manage`);
    } catch {
      alert("저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const [questions, setQuestions] = useState<string[]>([]);

  useEffect(() => {
    if (group?.questions) {
      setQuestions([...group.questions]);
    }
  }, [group]);
  const [editing, setEditing] = useState(false);

  // 질문 수정/추가/삭제/저장 로직
  const handleQuestionChange = (idx: number, value: string) => {
    const updated = [...questions];
    updated[idx] = value;
    setQuestions(updated);
  };
  const handleAddQuestion = () => setQuestions([...questions, ""]);

  const handleDeleteQuestion = (idx: number) =>
    setQuestions(questions.filter((_, i) => i !== idx));

  const handleSaveQuestions = async () => {
    try {
      setSaving(true);
      await updateGroupQuestion(questions, groupId);
      setEditing(false);

      // 저장 성공 후 원본 동기화
      setGroup((prev) =>
        prev ? { ...prev, questions: [...questions] } : prev
      );

      // 알림
      alert("질문이 저장되었습니다.");
    } catch (err) {
      alert("질문 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (group?.questions) {
      setQuestions([...group.questions]);
    }
    setEditing(false);
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: "28px 20px",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 10px #0001",
      }}
    >
      <h2 style={{ marginBottom: 18, fontWeight: 700 }}>그룹 정보 수정</h2>
      <div style={{ marginBottom: 16 }}>
        <label>
          그룹명
          <br />
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #dedede",
              borderRadius: 6,
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>
          설명
          <br />
          <textarea
            value={form.desc}
            onChange={(e) => handleChange("desc", e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #dedede",
              borderRadius: 6,
              minHeight: 64,
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label>
          스크럼 시간
          <br />
          <input
            type="text"
            value={form.scrumTime}
            onChange={(e) => handleChange("scrumTime", e.target.value)}
            placeholder="예: 오전 10:00"
            style={{
              width: "60%",
              padding: "8px",
              border: "1px solid #dedede",
              borderRadius: 6,
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontWeight: 500 }}>질문 목록</label>
        <Accordion
          open={questionOpen}
          setOpen={setQuestionOpen}
          emoji="❓"
          title="질문 관리"
        >
          <ScrapQuestions
            questions={questions}
            onChange={setQuestions}
            maxQuestions={10}
            inputClassName={styles.inputBase}
          />

          <div className={styles.questionEditBtns}>
            <Button variant="primary" onClick={handleSaveQuestions}>
              저장하기
            </Button>
            <Button variant="secondary" onClick={handleCancelEdit}>
              취소
            </Button>
          </div>
        </Accordion>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
        <Button variant="primary" onClick={handleSave}>
          저장
        </Button>
        <Button variant="secondary" onClick={() => router.back()}>
          취소
        </Button>
      </div>
    </div>
  );
}

function Accordion({
  open,
  setOpen,
  emoji,
  title,
  children,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
  emoji: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.accordionSection}>
      <div
        className={styles.accordionHeader}
        onClick={() => setOpen(!open)}
        tabIndex={0}
      >
        <span className={styles.sectionEmoji}>{emoji}</span>
        <span className={styles.sectionTitle}>{title}</span>
        <span className={styles.arrowIcon}>{open ? "▲" : "▼"}</span>
      </div>
      {open && <div className={styles.accordionBody}>{children}</div>}
    </div>
  );
}
