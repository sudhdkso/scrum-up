"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "@/style/groupManage.module.css";
import { getInviteCode } from "@/lib/group";
import { GroupManageDTO } from "@/services/group/dto/group.dto";
import GroupDeleteSection from "./GroupDeleteSection";
import { kickGroupMember } from "@/lib/group-member";
import KickMemberSection from "./KickMemberSection";

export default function GroupManagePage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params!.id as string;

  const [group, setGroup] = useState<GroupManageDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
  // 멤버 관리 아코디언
  const [memberOpen, setMemberOpen] = useState(false);

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
            <div className={styles.groupDesc}>{group.desc}</div>
            <div className={styles.alarmRow}>
              <span role="img" aria-label="alarm">
                ⏰
              </span>
              알림 시간 <b>{group.scrumTime}</b>
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
                  <KickMemberSection
                    memberName={m.name}
                    onKick={async () => {
                      await kickGroupMember(groupId, m.id);
                      setGroup((prev) =>
                        prev
                          ? {
                              ...prev,
                              members: prev.members.filter(
                                (mem) => mem.id !== m.id
                              ),
                            }
                          : prev
                      );
                    }}
                  />
                )}
              </li>
            ))}
          </ul>
        </Accordion>

        <hr className={styles.divider} />

        <div
          className={styles.sectionRow}
          style={{ cursor: "pointer" }}
          onClick={() => router.push(`/group/${groupId}/edit`)}
        >
          <span className={styles.sectionEmoji} role="img" aria-label="edit">
            ✏️
          </span>
          <div className={styles.sectionTitle}>그룹 정보 수정 </div>
        </div>

        {/* 질문 관리 (아코디언) */}

        <hr className={styles.divider} />

        <GroupDeleteSection
          groupId={groupId}
          onDeleted={() => router.push("/dashboard")}
        />
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
