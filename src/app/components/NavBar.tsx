import styles from "./NavBar.module.css";

export default function NavBar({ userName }: { userName: string }) {
  return (
    <nav className={styles.navBar}>
      <span className={styles.logo}>scrum-up</span>
      <span className={styles.user}>{userName}</span>
    </nav>
  );
}
