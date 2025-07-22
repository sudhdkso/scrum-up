"use client";
import styles from "./NavBar.module.css";
import { useUser } from "./AuthProvider";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const user = useUser();
  const router = useRouter();
  return (
    <nav className={styles.navBar}>
      <span
        className={styles.logo}
        style={{ cursor: "pointer" }}
        onClick={() => router.push("/dashboard")}
      >
        scrum-up
      </span>
      <span className={styles.user}>{user?.name ?? "로그인 필요"}</span>
    </nav>
  );
}
