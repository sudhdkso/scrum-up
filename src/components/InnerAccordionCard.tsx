import React from "react";

export function InnerAccordionCard({
  open,
  headerIcon,
  headerTitle,
  onClickHeader,
  children,
}: {
  open: boolean;
  headerIcon: React.ReactNode;
  headerTitle: React.ReactNode;
  onClickHeader: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: "1.3px solid #e2e7ed",
        borderRadius: 8,
        marginBottom: 13,
        background: open ? "#f2f6fa" : "#fafcff",
        boxShadow: "none",
        overflow: "hidden",
        transition: "background 0.18s, border 0.15s",
      }}
    >
      {/* 아코디언 헤더 */}
      <div
        onClick={onClickHeader}
        style={{
          display: "flex",
          alignItems: "center",
          fontWeight: 600,
          fontSize: "1em",
          cursor: "pointer",
          padding: "12px 15px 12px 15px",
          borderBottom: open ? "1px solid #b2defc" : "1px solid #f0f2f5",
          background: open ? "#eaf6fd" : "transparent",
          width: "100%",
          boxSizing: "border-box",
          transition: "background 0.13s, border 0.14s",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "#f2f8fe";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = open ? "#eaf6fd" : "transparent";
        }}
      >
        {headerIcon}
        <span style={{ fontWeight: 700 }}>{headerTitle}</span>
        <span
          style={{
            marginLeft: "auto",
            color: "#b2b7cb",
            fontSize: "1em",
          }}
        >
          {open ? "▼" : "▶"}
        </span>
      </div>
      {open && (
        <div
          style={{
            padding: "11px 13px 13px 13px",
            background: "#fff",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
