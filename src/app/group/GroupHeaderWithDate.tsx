function getKoreanDateString(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = (date.getMonth() + 1).toString().padStart(2, "0");
  const dd = date.getDate().toString().padStart(2, "0");
  return `오늘은 ${yyyy}년 ${mm}월 ${dd}일 입니다!`;
}

export default function GroupHeaderWithDate({
  groupName,
}: {
  groupName: string;
}) {
  const now = new Date();
  const dateStr = getKoreanDateString(now);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontWeight: 700,
        fontSize: "1.15rem",
        color: "#333",
        marginBottom: 8,
        flexWrap: "wrap",
      }}
    >
      <span style={{ fontWeight: 700, marginRight: 15 }}>{groupName}</span>
      {/* 오늘 날짜 */}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          fontWeight: 500,
          color: "#6A667A",
        }}
      >
        <span style={{ fontSize: "1.3em", marginRight: 6, lineHeight: 1 }}>
          🌸
        </span>
        {dateStr}
      </span>
    </div>
  );
}
