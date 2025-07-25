import styles from "@/style/todayScrumStatus.module.css";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

export function TodayScrumStatus({
  isSrumToday,
  groupId,
}: {
  isSrumToday: boolean;
  groupId: string;
}) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/group/${groupId}/scrum`);
  };

  return (
    <div
      className={`${styles.statusWrap}${isSrumToday ? ` ${styles.done}` : ""}`}
    >
      <span className={styles.statusText}>
        {isSrumToday
          ? "✅ 오늘 내 스크럼 작성 완료"
          : "✍️ 오늘 스크럼 작성해 주세요"}
      </span>
      <Button
        variant="primary"
        onClick={handleClick}
        className={styles.statusBtn}
      >
        {isSrumToday ? "수정하기" : "작성하기"}
      </Button>
    </div>
  );
}
