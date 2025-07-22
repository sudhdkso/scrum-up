"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import InvitePage from "@/app/components/GroupInvitePage";
import { getInviteDetailByCode } from "@/lib/invite";
import { InviteDetailDTO } from "@/service/inviteCode/dto/invite-code.dto";

export default function InviteByCodePage() {
  // 서버에서 code로 그룹/초대 정보 fetch해서 prop으로 내려주는 로직 (DB 연동시)
  // const inviteData = await getInviteDetailByCode(code);
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
      // onAccept, onDecline 실제 구현에 맞게 콜백 달기
    />
  );
}
