export default function Footer() {
  return (
    <footer
      className="mx-auto w-full max-w-[600px] px-4"
      style={{
        background: "#fff",
        color: "#555",
        textAlign: "center",
        padding: "24px 0 16px 0",
      }}
    >
      <div>Scrum-Up은 데일리 스크럼을 위한 개인 프로젝트입니다.</div>
      <div style={{ margin: "8px 0" }}>
        Made by 원지윤 |{" "}
        <a
          href="https://github.com/sudhdkso" // <-- 본인 주소로 수정!
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#267cee", textDecoration: "underline" }}
        >
          GitHub
        </a>
      </div>
      <div>© 2025 Scrum-Up. MIT Licensed.</div>
    </footer>
  );
}
