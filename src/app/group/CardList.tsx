import { DailyScrumDTO } from "@/services/scrum/dto/DailyScrum";
import styles from "./CardList.module.css";

export function DateCardList({
  dates,
  scrums,
  selected,
  onSelect,
}: {
  dates: string[];
  scrums: DailyScrumDTO[];
  selected: string | null;
  onSelect: (date: string) => void;
}) {
  return (
    <div className={styles.cardList}>
      {dates.map((date) => {
        const scrum = scrums.find((s) => s.date === date);
        const total = scrum?.answersByUser.length || 0;
        const write =
          scrum?.answersByUser.filter((r) =>
            r.answers.some((a) => a && a.trim())
          ).length || 0;
        return (
          <div
            key={date}
            className={`${styles.card} ${
              selected === date ? styles["selected-date"] : ""
            }`}
            onClick={() => onSelect(date)}
          >
            <span className={styles.cardIcon} role="img" aria-label="date">
              📅
            </span>
            <div style={{ flex: 1 }}>
              <div className={styles.cardContentTitle}>{date}</div>
              <div className={styles.cardContentInfo}>
                {write} / {total}명 작성
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function MemberCardList({
  members,
  scrums,
  selected,
  onSelect,
}: {
  members: { id: string; name: string }[];
  scrums: DailyScrumDTO[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className={styles.cardList}>
      {members.map((m) => {
        const write = scrums.filter((s) =>
          s.answersByUser.find(
            (r) => r.userId === m.id && r.answers.some((a) => a && a.trim())
          )
        ).length;
        const total = scrums.length;
        return (
          <div
            key={m.id}
            className={`${styles.card} ${
              selected === m.id ? styles["selected-member"] : ""
            }`}
            onClick={() => onSelect(m.id)}
          >
            <span className={styles.cardIcon} role="img" aria-label="member">
              🧑‍💻
            </span>
            <div style={{ flex: 1 }}>
              <div className={styles.cardContentTitle}>{m.name}</div>
              <div className={styles.cardContentInfo}>
                {write} / {total}일 작성
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
