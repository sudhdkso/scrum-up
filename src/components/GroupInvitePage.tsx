import Image from "next/image";
import styles from "@/style/InvitePage.module.css"; // CSS module 예시

export default function GroupInvitePage({
  inviterName = "홍길동",
  appName = "ScrumUp",
  groupName = "성장하는 개발자들",
  memberCount = 5,
  scrumTime = "매일 오전 10시",
  onAccept,
  onDecline,
}: {
  inviterName?: string;
  appName?: string;
  groupName?: string;
  memberCount?: number;
  scrumTime?: string;
  onAccept?: () => void;
  onDecline?: () => void;
}) {
  return (
    <main className={styles.container}>
      {/* 로고 또는 앱 이름 */}
      <header className={styles.header}>
        {/* 실제 로고 쓸 땐 <Image /> 또는 <img /> */}
        <span className={styles.logo}>{appName}</span>
      </header>

      {/* 초대 정보 영역 */}
      <section className={styles.inviteSection}>
        <div className={styles.inviteText}>
          <span style={{ fontSize: "1.25em", marginRight: 4 }}>🙋‍♀️</span>
          <b>{inviterName}</b> 님이
          <b>[{appName}] 그룹에</b>
          <br />
          <span style={{ fontWeight: 600, fontSize: "1.1em" }}>
            초대했어요!
          </span>
        </div>
        <div className={styles.infoCard}>
          <div>
            <span role="img" aria-label="group" style={{ marginRight: 5 }}>
              📝
            </span>
            <b>그룹 이름:</b> {groupName}
          </div>
          <div>
            <span role="img" aria-label="members" style={{ marginRight: 5 }}>
              👥
            </span>
            <b>현재 멤버 수:</b> {memberCount}명
          </div>
          <div>
            <span role="img" aria-label="time" style={{ marginRight: 5 }}>
              🕒
            </span>
            <b>스크럼 시간:</b> {scrumTime}
          </div>
        </div>
      </section>

      {/* CTA 버튼 영역 */}
      <section className={styles.ctaSection}>
        <button className={styles.acceptBtn} onClick={onAccept}>
          지금 그룹에 참여하기
        </button>
        <button className={styles.declineBtn} onClick={onDecline}>
          거절하기
        </button>
      </section>

      {/* 서비스 설명 */}
      <footer className={styles.footer}>
        <hr className={styles.divider} />
        <div className={styles.aboutService}>
          <span style={{ fontWeight: 600 }}>❓ ScrumUp이 뭔가요?</span>
          <p style={{ margin: "8px 0 0 0" }}>
            &quot;매일 3분, 성장하는 팀의 비결!&quot;
            <a
              href="https://scrumup.example.com/about"
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: 6 }}
            >
              더 알아보기 →
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
