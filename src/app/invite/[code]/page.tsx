"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import InvitePage from "@/app/components/GroupInvitePage";
import { getInviteDetailByCode } from "@/lib/invite";
import { InviteDetailDTO } from "@/service/inviteCode/dto/invite-code.dto";
import { useUser } from "@/app/components/AuthProvider";

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

    // 로그인 상태면 바로 가입 처리
    // joinGroupApiCall(code).then(() => {
    //   // 가입 완료 후 페이지 이동 등 처리
    // });
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;
  if (!info) return <div>초대 정보를 찾을 수 없습니다.</div>;
  return (
    <InvitePage
      // 실제로는 code로 그룹 정보 불러와 넘겨주면 됨
      inviterName={info.inviterName}
      appName="ScrumUp"
      groupName={info.groupName}
      memberCount={info.memberCount}
      scrumTime={info.scrumTime}
      onAccept={handleAccept}
      // onAccept, onDecline 실제 구현에 맞게 콜백 달기
    />
  );
}
