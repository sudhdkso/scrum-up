import React from "react";
export default function Drawer({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.34)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 440,
          maxWidth: "97vw",
          maxHeight: "92vh",
          background: "#fff",
          borderRadius: 17,
          boxShadow: "0 10px 50px #2222",
          position: "relative",
          padding: "36px 24px 26px 24px",
          overflow: "auto",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            right: 16,
            top: 10,
            fontSize: 22,
            background: "none",
            border: "none",
            color: "#888",
            cursor: "pointer",
          }}
          aria-label="닫기"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
