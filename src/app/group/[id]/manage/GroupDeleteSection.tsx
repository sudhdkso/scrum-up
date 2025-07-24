import React, { useState } from "react";
import Modal from "@/components/Modal";

export default function GroupDeleteSection({
  groupId,
  onDeleted,
}: {
  groupId: string;
  onDeleted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [hover, setHover] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await fetch(`/api/group/${groupId}`, {
        method: "DELETE",
        credentials: "include",
      });
      setOpen(false);
      onDeleted();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          style={{
            color: hover ? "#c81f1f" : "#e94141",
            background: hover ? "#ffecec" : "white",
            border: hover ? "1.5px solid #c81f1f" : "1.5px solid #e94141",
            borderRadius: 7,
            padding: "10px 20px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.14s",
          }}
          onClick={() => setOpen(true)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          🗑️ 그룹 삭제하기
        </button>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={
          <span>
            <span
              role="img"
              aria-label="delete"
              style={{ fontSize: 21, marginRight: 6 }}
            >
              🗑️
            </span>
            그룹 삭제
          </span>
        }
        leftButton={{
          label: "취소",
          onClick: () => setOpen(false),
          color: "secondary",
        }}
        rightButton={{
          label: deleting ? "삭제 중..." : "삭제",
          onClick: handleDelete,
          color: "danger",
          disabled: deleting,
        }}
        styleOverlay={{
          alignItems: "flex-start",
          paddingTop: "20vh",
        }}
      >
        <div style={{ fontWeight: 500, marginBottom: 5, fontSize: "1.07em" }}>
          <span role="img" aria-label="warning" style={{ marginRight: 5 }}>
            🥲
          </span>
          정말 그룹을 삭제하시겠습니까?
        </div>
        <div style={{ color: "#888", fontSize: "0.98em" }}>
          삭제 후에는 <b>되돌릴 수 없습니다.</b>
        </div>
      </Modal>
    </>
  );
}
