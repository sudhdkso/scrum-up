"use client";
import styles from "./NavBar.module.css";

// (예시: 클라이언트 컴포넌트에서)
import { useUser } from "./AuthProvider";

export default function NavBar() {
  const user = useUser();
  return (
    <nav className={styles.navBar}>
      <span className={styles.logo}>scrum-up</span>
      <span className={styles.user}>{user?.name ?? "로그인 필요"}</span>
    </nav>
  );
}
