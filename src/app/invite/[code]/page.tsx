"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import InvitePage from "@/components/GroupInvitePage";
import { getInviteDetailByCode } from "@/lib/invite";
import { InviteDetailDTO } from "@/services/inviteCode/dto/invite-code.dto";
import { useUser } from "@/components/AuthProvider";
import { joinGroup } from "@/lib/group";
import styles from "@/style/InvitePage.module.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
const REDIRECT_URI = process.env.NEXT_PUBLIC_INVITE_REDIRECT_URI;
const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

export default function InviteByCodePage() {
  const params = useParams();
  const code = params!.code as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [info, setInfo] = useState<InviteDetailDTO | null>(null);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = (await getInviteDetailByCode(code)).invite;
        setInfo(data);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, [code]);

  const user = useUser();
  const isLoggedIn = !!user;

  const handleAccept = () => {
    if (!isLoggedIn) {
      const state = encodeURIComponent(code);
      window.location.href = kakaoLoginUrl + `&state=${state}`;
      return;
    }

    joinGroup(code)
      .then((res) => {
        if (res.alreadyMember) {
          window.location.href = `/group/${res.groupId}`;
        } else {
          window.location.href = `/dashboard`;
          // 또는 가입 후 대시보드로 이동 원하면 /dashboard 등
        }
      })
      .catch((e) => {
        setError(e as Error);
      });
  };

  if (loading) {
    return (
      <main className={styles.container}>
        {/* 헤더: 로고(상단 중앙 커다랗게) */}
        <header className={styles.header}>
          <Skeleton width={140} height={46} borderRadius={13} />
        </header>
        {/* 초대 메세지 (라인/여백 큼직하게) */}
        <section className={styles.inviteSection}>
          <div
            className={styles.inviteText}
            style={{ minHeight: 66, marginBottom: 22 }}
          >
            <Skeleton width={270} height={26} style={{ marginBottom: 10 }} />
            <Skeleton width={202} height={18} />
          </div>
          {/* 그룹/멤버/시간 info 카드 */}
          <div
            className={styles.infoCard}
            style={{
              padding: 27,
              fontSize: "1.16em",
              minHeight: 108,
              margin: "0 auto",
            }}
          >
            <Skeleton width={140} height={24} style={{ marginBottom: 15 }} />
            <Skeleton width={136} height={21} style={{ marginBottom: 13 }} />
            <Skeleton width={156} height={20} />
          </div>
        </section>
        {/* CTA 버튼 (크고 넉넉하게) */}
        <section className={styles.ctaSection} style={{ marginBottom: 26 }}>
          <Skeleton
            width="100%"
            height={54}
            style={{ borderRadius: 9, marginBottom: 12 }}
          />
          <Skeleton
            width="55%"
            height={36}
            style={{ borderRadius: 7, margin: "0 auto" }}
          />
        </section>
        {/* 하단 설명 */}
        <footer className={styles.footer} style={{ marginTop: 39 }}>
          <div style={{ marginBottom: 14 }}>
            <Skeleton width={160} height={20} style={{ marginBottom: 6 }} />
            <Skeleton width={240} height={16} />
          </div>
        </footer>
      </main>
    );
  }
  if (error) return <div>에러 발생: {error.message}</div>;
  if (!info) return <div>초대 정보를 찾을 수 없습니다.</div>;
  return (
    <InvitePage
      inviterName={info.inviterName}
      appName="ScrumUp"
      groupName={info.groupName}
      memberCount={info.memberCount}
      scrumTime={info.scrumTime}
      onAccept={handleAccept}
      // onDecline 등
    />
  );
}
