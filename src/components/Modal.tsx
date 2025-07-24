import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  leftButton?: {
    label: string;
    onClick: () => void;
    color?: "primary" | "danger" | "secondary";
    disabled?: boolean;
  };
  rightButton?: {
    label: string;
    onClick: () => void;
    color?: "primary" | "danger" | "secondary";
    disabled?: boolean;
  };
  footer?: React.ReactNode;
  styleOverlay?: React.CSSProperties;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  leftButton,
  rightButton,
  footer,
  styleOverlay,
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.17)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...styleOverlay, // ← 이렇게 전달
      }}
      onClick={onClose}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          minWidth: 320,
          maxWidth: 430,
          width: "100%",
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 6px 32px rgba(40,70,140,0.15)",
          padding: "32px 24px 20px 24px",
          position: "relative",
          outline: "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기(X) */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 18,
            background: "none",
            border: "none",
            fontSize: 22,
            color: "#bbb",
            cursor: "pointer",
            lineHeight: 1,
          }}
          aria-label="닫기"
        >
          ×
        </button>

        {title && (
          <div
            style={{
              fontWeight: 700,
              fontSize: "1.13rem",
              color: "#1d2542",
              marginBottom: 16,
              marginTop: 2,
            }}
          >
            {title}
          </div>
        )}

        <div style={{ marginBottom: 22 }}>{children}</div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 14,
            marginTop: 8,
          }}
        >
          {leftButton && (
            <button
              onClick={leftButton.onClick}
              style={{
                flex: 1,
                background:
                  leftButton.color === "danger"
                    ? "#e94141"
                    : leftButton.color === "secondary"
                    ? "#f2f4fa"
                    : "var(--primary-blue, #267fff)",
                color: leftButton.color === "secondary" ? "#267fff" : "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                padding: "11px 0",
                fontSize: "1.04rem",
                cursor: leftButton.disabled ? "default" : "pointer",
                opacity: leftButton.disabled ? 0.6 : 1,
              }}
              disabled={leftButton.disabled}
            >
              {leftButton.label}
            </button>
          )}
          {rightButton && (
            <button
              onClick={rightButton.onClick}
              style={{
                flex: 1,
                background:
                  rightButton.color === "danger"
                    ? "#e94141"
                    : rightButton.color === "secondary"
                    ? "#f2f4fa"
                    : "var(--primary-blue, #267fff)",
                color: rightButton.color === "secondary" ? "#267fff" : "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                padding: "11px 0",
                fontSize: "1.04rem",
                cursor: rightButton.disabled ? "default" : "pointer",
                opacity: rightButton.disabled ? 0.6 : 1,
              }}
              disabled={rightButton.disabled}
            >
              {rightButton.label}
            </button>
          )}
        </div>
        {footer && <div style={{ marginTop: 10 }}>{footer}</div>}
      </div>
    </div>
  );
}
