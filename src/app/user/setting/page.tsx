"use client";
import React, { useEffect, useState } from "react";
import styles from "./UserSettingPage.module.css";
import Modal from "@/components/Modal";

type User = {
  id: string;
  email: string;
  name: string;
};
export default function UserSettingPage() {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [notificationOn, setNotificationOn] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    async function fetchUserInfo() {
      setLoading(true);
      try {
        const res = await fetch("/api/user/info", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.message || "Failed to fetch user info");
        }
        const data = await res.json();
        const user = data.user ?? data;
        setUserInfo(user);
        setNotificationOn(!!user.isNotificationOn);
      } catch (error) {
        alert("유저 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }
    fetchUserInfo();
  }, []);

  async function handleNotificationToggle() {
    if (!userInfo) return;
    const newState = !notificationOn;
    setNotificationOn(newState);
    try {
      const res = await fetch("/api/user/notification", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationOn: newState }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to fetch notification status");
      }
    } catch (e) {
      console.log(e);
      alert("알림 설정 변경에 실패했습니다");
      setNotificationOn(!newState);
    }
  }

  async function handleSocialLogout() {
    try {
      const r = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!r.ok) throw new Error();
      alert("연동 해제되었습니다.");
    } catch (e) {
      alert("로그아웃 실패");
    }
  }

  function handleGoScrum() {
    window.location.href = "/scrum/my";
  }

  async function handleWithdraw() {
    setWithdrawing(true);
    try {
      const r = await fetch("/api/user/withdraw", {
        method: "DELETE",
        credentials: "include",
      });
      const contentType = r.headers.get("content-type") ?? "";
      if (!r.ok) {
        if (contentType.includes("html")) {
          const text = await r.text();
          throw new Error("탈퇴 응답이 HTML입니다:" + text.slice(0, 80));
        }
        throw new Error("계정 탈퇴 실패(" + r.status + ")");
      }
      alert("계정이 탈퇴되었습니다.");
      window.location.href = "/";
    } catch (e) {
      alert("계정 탈퇴 중 오류 발생");
    }
    setWithdrawing(false);
    setShowModal(false);
  }
  if (loading) return <div>로딩 중...</div>;

  return (
    <section className={styles.settingWrap}>
      <div className={styles.group}>
        <h2 className={styles.title}>기본 정보</h2>
        <div className={styles.infoRow}>
          <span className={styles.label}>이름</span>
          <span className={styles.value}>{userInfo?.name}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>이메일</span>
          <span className={styles.value}>{userInfo?.email}</span>
          <span className={styles.emailType}>연동 계정</span>
        </div>
      </div>

      <div className={styles.group}>
        <h2 className={styles.title}>스크럼 설정</h2>
        <div className={styles.infoRow}>
          <span className={styles.label}>알림</span>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={notificationOn}
              onChange={handleNotificationToggle}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>

      <div className={styles.group}>
        <h2 className={styles.title}>소셜 연동</h2>
        <div className={styles.infoRow}>
          <span className={styles.label}>카카오 로그인</span>
          <span className={styles.socialOn}>✅ 연동됨</span>
          <button className={styles.linkBtn} onClick={handleSocialLogout}>
            로그아웃
          </button>
        </div>
      </div>

      <div className={styles.group}>
        <h2 className={styles.title}>내 활동 데이터</h2>
        <button className={styles.scrumBtn} onClick={handleGoScrum}>
          작성한 스크럼 보기
        </button>
      </div>

      <div className={styles.dangerZone}>
        <button className={styles.dangerBtn} onClick={() => setShowModal(true)}>
          탈퇴 하기
        </button>
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="정말 계정을 탈퇴하시겠습니까?"
        leftButton={{
          label: "취소",
          onClick: () => setShowModal(false),
          color: "secondary",
        }}
        rightButton={{
          label: withdrawing ? "탈퇴 중..." : "탈퇴하기",
          onClick: handleWithdraw,
          color: "danger",
          disabled: withdrawing,
        }}
      >
        <div style={{ margin: "20px 0 2px", fontSize: "1.03em" }}>
          탈퇴 시 모든 데이터가 즉시 삭제되며 <br /> 복구할 수 없습니다.
        </div>
      </Modal>
    </section>
  );
}
