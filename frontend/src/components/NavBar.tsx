"use client";
import styles from "./NavBar.module.css";
import { useUser } from "./AuthProvider";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const { user } = useUser();
  const router = useRouter();

  const isLoading = !user || !user.name; // isLoading 플래그가 있다면 명확하게
  const isLoggedIn = user && !!user.name;

  return (
    <nav className={styles.navBar}>
      <span
        className={styles.logo}
        style={{ cursor: "pointer" }}
        onClick={() => router.push("/dashboard")}
      >
        scrum-up
      </span>
      {isLoading ? (
        <span className={styles.skeletonName} />
      ) : isLoggedIn ? (
        <span
          className={styles.user}
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/user/setting")}
        >
          {user.name}
        </span>
      ) : (
        <span
          className={styles.user}
          style={{ cursor: "pointer", color: "#aaa" }}
          onClick={() => router.push("/login")}
        >
          로그인 해주세요
        </span>
      )}
    </nav>
  );
}
