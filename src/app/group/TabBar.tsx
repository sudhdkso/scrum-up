export function TabBar({
  tab,
  setTab,
}: {
  tab: "date" | "member";
  setTab: (t: "date" | "member") => void;
}) {
  return (
    <nav
      style={{
        display: "flex",
        gap: 14,
        marginBottom: 10,
        marginTop: 2,
        justifyContent: "center",
      }}
    >
      <button
        onClick={() => setTab("date")}
        style={{
          fontWeight: tab === "date" ? 700 : 400,
          background: tab === "date" ? "#eef7ff" : "#fff",
          border: "1px solid #ddd",
          borderRadius: "7px",
          padding: "9px 25px",
          fontSize: "1.08rem",
        }}
      >
        📅 일자별 보기
      </button>
      <button
        onClick={() => setTab("member")}
        style={{
          fontWeight: tab === "member" ? 700 : 400,
          background: tab === "member" ? "#eef7ff" : "#fff",
          border: "1px solid #ddd",
          borderRadius: "7px",
          padding: "9px 25px",
          fontSize: "1.08rem",
        }}
      >
        👤 멤버별 보기
      </button>
    </nav>
  );
}
