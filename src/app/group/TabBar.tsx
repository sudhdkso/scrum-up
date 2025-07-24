import styles from "./tabBar.module.css";

export function TabBar({
  tab,
  setTab,
}: {
  tab: "date" | "member";
  setTab: (t: "date" | "member") => void;
}) {
  return (
    <nav className={styles.tabBarNav}>
      <button
        type="button"
        className={`${styles.tabBtn} ${tab === "date" ? styles.active : ""}`}
        onClick={() => setTab("date")}
      >
        📅 일자별 보기
      </button>
      <button
        type="button"
        className={`${styles.tabBtn} ${tab === "member" ? styles.active : ""}`}
        onClick={() => setTab("member")}
      >
        👤 멤버별 보기
      </button>
    </nav>
  );
}
