"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "@/style/groupManage.module.css";
import Button from "@/components/Button";
import { getInviteCode } from "@/lib/group";
import { GroupManageDTO } from "@/service/group/dto/group.dto";
import ScrapQuestions from "@/components/ScrapQuestions";
import { updateGroupQuestion } from "@/lib/group";

export default function GroupManagePage() {
  const params = useParams();
  const groupId = params!.id as string;

  const [group, setGroup] = useState<GroupManageDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!groupId) return;

    (async () => {
      setError(null);
      setLoading(true);
      try {
        const res = await fetch(`/api/group/${groupId}/manage`, {
          credentials: "include",
        });
        if (res.ok) {
          const group = (await res.json()).group;
          if (group && group.questions) {
            setGroup(group);
          }
        }
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, [groupId]);

  // 초대코드 복사 및 캐싱
  const [inviteCopied, setInviteCopied] = useState(false);

  const [inviteInfo, setInviteInfo] = useState<{
    code: string;
    expiresAt: number;
  } | null>(null);

  useEffect(() => {
    if (group?.inviteCode) {
      setInviteInfo(group.inviteCode);
    }
  }, [group]);

  const fetchInviteCode = async () => {
    const data = (await getInviteCode(groupId)).inviteCode;
    return { code: data.code, expiresAt: data.expiresAt };
  };

  const handleCopyInvite = async () => {
    let info = inviteInfo;
    if (!info || Date.now() > info.expiresAt) {
      info = await fetchInviteCode();
      setInviteInfo(info);
    }
    const url = `${window.location.origin}/invite/${info.code}`;
    await navigator.clipboard.writeText(url);
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 1200);
  };
  const handleLeave = async (id: string) => {
    //탈퇴 fetch 호출
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
      console.log(questions);
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

  // 멤버 관리 아코디언
  const [memberOpen, setMemberOpen] = useState(false);
  // 질문 관리 아코디언
  const [questionOpen, setQuestionOpen] = useState(false);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error.message}</div>;
  if (!group) return <div>그룹을 찾을 수 없습니다.</div>;
  return (
    <div style={{ marginTop: 0, paddingTop: 0 }}>
      <div className={styles.adminSection}>
        {/* 그룹/설명/알림 */}
        <section className={styles.headerSection}>
          <div className={styles.groupInfo}>
            <span className={styles.groupName}>{group.name}</span>
            <button className={styles.iconBtn} title="그룹 수정">
              ⚙️
            </button>
            <div className={styles.groupDesc}>{group.desc}</div>
            <div className={styles.alarmRow}>
              <span role="img" aria-label="alarm">
                ⏰
              </span>
              알림 시간 <b>{group.scrumTime}</b>
              <button className={styles.iconBtn} title="알림시간 수정">
                🕒
              </button>
            </div>
          </div>
        </section>

        <hr className={styles.divider} />

        {/* 초대하기 */}
        <div className={styles.sectionRow}>
          <span className={styles.sectionEmoji} role="img" aria-label="invite">
            🔗
          </span>
          <div className={styles.sectionTitle}>초대하기</div>
          <button className={styles.inviteCopyBtn} onClick={handleCopyInvite}>
            {inviteCopied ? "복사됨!" : "초대 코드 복사"}
          </button>
        </div>

        <hr className={styles.divider} />

        {/* 멤버 관리 (아코디언) */}
        <Accordion
          open={memberOpen}
          setOpen={setMemberOpen}
          emoji="🧑‍🤝‍🧑"
          title="멤버 관리"
        >
          <ul className={styles.fullWidthList}>
            {group.members.map((m) => (
              <li key={m.id} className={styles.rowWide}>
                <span style={{ flex: 2 }}>
                  {m.name}
                  <span className={styles.roleInline}>
                    ({getKoRole(m.role)})
                  </span>
                </span>
                {m.role !== "manager" && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <Button
                      variant="secondary"
                      onClick={() => handleLeave(m.id)}
                    >
                      탈퇴
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Accordion>

        <hr className={styles.divider} />

        {/* 질문 관리 (아코디언) */}
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

        <hr className={styles.divider} />

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            className={styles.dangerBtn}
            onClick={() => window.confirm("정말 그룹을 삭제하시겠습니까?")}
          >
            그룹 삭제하기
          </button>
        </div>
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

function getKoRole(role: string) {
  if (role === "manager") return "매니저";
  if (role === "member") return "멤버";
  return role;
}
