import React, { useState } from "react";
import Modal from "@/components/Modal";

// 심플 로딩 spinner 컴포넌트 추가
function Spinner({ size = 17 }: { size?: number }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        border: "2.1px solid #cfd9ea",
        borderTop: "2.1px solid #267fff",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        verticalAlign: "middle",
        marginRight: 4,
      }}
    />
  );
}

// 인라인 CSS keyframes (혹은 전역에 포함)
const spinnerKeyframes = `
@keyframes spin { 100% { transform: rotate(360deg);} }
`;

export default function GroupCreatedModal({
  open,
  onClose,
  groupId,
}: {
  open: boolean;
  onClose: () => void;
  groupId: string;
}) {
  const [inviteLink, setInviteLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/group/${groupId}/invite-code`, {
        credentials: "include",
      });
      const { code } = (await res.json()).inviteCode;
      const url = `${window.location.origin}/invite/${code}`;
      setInviteLink(url);
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1100);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 스피너 애니메이션 keyframes을 style로 추가 */}
      <style>{spinnerKeyframes}</style>
      <Modal
        open={open}
        onClose={onClose}
        title={
          <>
            <span role="img" aria-label="party" style={{ fontSize: 22 }}>
              🥳
            </span>
            <span>스크럼 그룹이 생성되었습니다!</span>
          </>
        }
        leftButton={{
          label: "메인으로",
          onClick: () => (window.location.href = "/dashboard"),
          color: "primary",
        }}
        rightButton={{
          label: "그룹으로 이동",
          onClick: () => (window.location.href = `/group/${groupId}`),
          color: "secondary",
        }}
      >
        <div
          style={{
            fontSize: "1.03rem",
            color: "#333",
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          그룹원과 공유할 수 있는 초대 링크
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#f6f8fc",
            border: "1.2px solid #8ec7fa",
            borderRadius: 8,
            minHeight: 42,
            padding: "0 0 0 12px",
            width: "100%",
            maxWidth: 320,
            margin: "0 auto",
          }}
        >
          <input
            value={inviteLink}
            readOnly
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              color: "#1f2847",
              fontWeight: 500,
              fontSize: "0.99rem",
            }}
            placeholder="초대 링크 복사"
            onFocus={(e) => e.target.select()}
          />
          <button
            style={{
              margin: "0 0 0 9px",
              padding: "7px 19px",
              borderRadius: 6,
              background: "#267fff",
              color: "#fff",
              fontWeight: 600,
              border: "none",
              fontSize: "1.02rem",
              cursor: loading ? "default" : "pointer",
              minWidth: 78,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={handleCopy}
            disabled={loading}
          >
            {loading ? <Spinner /> : copied ? "복사됨!" : "복사"}
          </button>
        </div>
      </Modal>
    </>
  );
}
