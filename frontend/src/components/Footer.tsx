import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footerWrap}>
      <div className={styles.footerTop}>
        Scrum-Up은 데일리 스크럼을 위한 개인 프로젝트입니다.
      </div>
      <div className={styles.footerLinks}>
        Made by 원지윤 |{" "}
        <a
          href="https://github.com/sudhdkso"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footerLink}
        >
          GitHub
        </a>
        <a href="/privacy" className={styles.footerPrivacy}>
          개인정보처리방침
        </a>
      </div>
      <div className={styles.footerCopyright}>
        © 2025 Scrum-Up. MIT Licensed.
      </div>
    </footer>
  );
}
