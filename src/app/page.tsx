import Image from "next/image";

const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 로고 중앙 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image src="/logo.png" alt="로고" width={180} height={180} priority />
          <p
            style={{
              marginTop: 24,
              fontSize: "1.1rem",
              color: "#444",
              textAlign: "center",
              fontWeight: 500,
            }}
          >
            함께 기록하는 매일, 스크럼 업!
          </p>
        </div>
      </div>
      {/* 카카오 로그인 버튼 - 화면 하단 중앙 */}
      <div
        style={{
          width: "100%",
          textAlign: "center",
          marginBottom: 48,
        }}
      >
        <a href={kakaoLoginUrl} style={{ display: "inline-block" }}>
          <Image
            src="/kakao_login_medium_wide.png"
            alt="카카오로 로그인"
            width={260}
            height={60}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </a>
      </div>
    </div>
  );
}
