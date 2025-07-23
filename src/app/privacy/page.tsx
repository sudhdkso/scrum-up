"use client";
import React from "react";
import { useRouter } from "next/navigation";
import styles from "@/components/NavBar.module.css";

export default function PrivacyPolicy() {
  const router = useRouter();
  return (
    <div>
      <nav className={styles.navBar}>
        <span
          className={styles.logo}
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/dashboard")}
        >
          scrum-up
        </span>
      </nav>
      <div
        style={{
          maxWidth: 680,
          margin: "10px auto",
          padding: "40px 24px",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 12px #0001",
        }}
      >
        <h1 style={{ fontSize: "1.6rem", marginBottom: 28, fontWeight: 700 }}>
          개인정보처리방침
        </h1>

        <p>스크럼업(Scrum Up)은 다음과 같이 개인정보를 수집 및 이용합니다.</p>

        <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginTop: 30 }}>
          1. 수집하는 개인정보 항목
        </h2>
        <ul style={{ paddingLeft: 22 }}>
          <li>카카오 로그인 시: 이름, 이메일, 카카오 고유 ID</li>
        </ul>

        <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginTop: 26 }}>
          2. 개인정보 수집 및 이용 목적
        </h2>
        <ul style={{ paddingLeft: 22 }}>
          <li>사용자 식별 및 로그인 기능 제공</li>
          <li>그룹 초대 처리 및 사용자별 스크럼 내용 관리</li>
        </ul>

        <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginTop: 26 }}>
          3. 개인정보 보유 및 이용 기간
        </h2>
        <ul style={{ paddingLeft: 22 }}>
          <li>회원 탈퇴 시 즉시 삭제</li>
        </ul>

        <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginTop: 26 }}>
          4. 개인정보 제3자 제공
        </h2>
        <p>스크럼업은 사용자의 개인정보를 외부에 제공하지 않습니다.</p>

        <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginTop: 26 }}>
          5. 개인정보 처리 위탁
        </h2>
        <ul style={{ paddingLeft: 22 }}>
          <li>
            스크럼업은 서비스 운영을 위해 다음과 같이 개인정보 처리를 위탁할 수
            있습니다.
            <ul style={{ paddingLeft: 22, marginTop: 3 }}>
              <li>클라우드 서버 (예: Vercel, MongoDB Atlas 등)</li>
            </ul>
          </li>
        </ul>

        <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginTop: 26 }}>
          6. 이용자의 권리
        </h2>
        <ul style={{ paddingLeft: 22 }}>
          <li>
            이용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며,
            삭제를 요청할 수 있습니다.
          </li>
        </ul>

        <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginTop: 26 }}>
          7. 문의
        </h2>
        <p>www071838@gmail.com</p>
      </div>
    </div>
  );
}
