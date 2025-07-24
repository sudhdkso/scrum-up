import React, { useState } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";

export default function KickMemberSection({
  memberName,
  onKick,
  disabled = false,
}: {
  memberName: string;
  onKick: () => Promise<void>;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 클릭시 모달 열고, 탈퇴시 로딩
  const handleKick = async () => {
    setLoading(true);
    await onKick();
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setOpen(true)}
        disabled={disabled || loading}
      >
        탈퇴
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={
          <>
            <span
              role="img"
              aria-label="kick"
              style={{ fontSize: 21, marginRight: 8 }}
            >
              🚫
            </span>
            멤버 탈퇴
          </>
        }
        leftButton={{
          label: "취소",
          onClick: () => setOpen(false),
          color: "secondary",
          disabled: loading,
        }}
        rightButton={{
          label: loading ? "탈퇴 중..." : "탈퇴",
          onClick: handleKick,
          color: "danger",
          disabled: loading,
        }}
        styleOverlay={{
          alignItems: "flex-start",
          paddingTop: "11vh",
        }}
      >
        <div style={{ fontWeight: 500, marginBottom: 7 }}>
          <span style={{ color: "#e94141" }}>{memberName}님</span>을 정말
          탈퇴시키시겠습니까?
        </div>
        <div style={{ color: "#888", fontSize: "0.98em" }}>
          탈퇴 시 이 멤버가 작성한 <b>스크럼이 모두 사라집니다.</b>
        </div>
      </Modal>
    </>
  );
}
