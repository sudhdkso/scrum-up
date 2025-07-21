export function TodayScrumStatus({ isSrumToday }: { isSrumToday: boolean }) {
  return (
    <div
      style={{
        marginTop: 16,
        marginBottom: 20,
        background: isSrumToday ? "#e7ffe7" : "#fffbe7",
        borderRadius: 8,
        padding: "15px 20px",
        fontSize: "1.09rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>
        {isSrumToday
          ? "✅ 오늘 내 스크럼 작성 완료"
          : "✍️ 오늘 스크럼 작성해 주세요"}
      </span>
      <button
        style={{
          padding: "8px 18px",
          borderRadius: 18,
          background: "#4267B2",
          color: "#fff",
          border: 0,
          fontSize: "1.01rem",
        }}
      >
        {isSrumToday ? "요약 보기" : "작성하러 가기"}
      </button>
    </div>
  );
}
