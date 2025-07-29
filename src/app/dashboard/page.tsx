"use client";
import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";
import { GroupSummaryDTO } from "@/services/group/dto/group.dto";
import { getUserGroups } from "@/lib/group";
import styles from "./dashboard.module.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MdEdit } from "react-icons/md";
import { FiSettings } from "react-icons/fi";

export default function Dashboard() {
  const router = useRouter();
  const [groups, setGroups] = useState<GroupSummaryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserGroups();
        setGroups(data.groups);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const todayScrumWritten = groups.filter((g) => g.isScrumToday).length;
  const todayScrumNotWritten = groups.length - todayScrumWritten;
  const showGroups = groups.length > 0;

  // 🟡 1. 스켈레톤 자리 표시 (로딩 중)
  if (loading) {
    // 예시: 그룹 3개 가정, 필요시 더/덜
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "32px 0", flex: 1 }}>
          {/* 오늘의 스크럼 요약 */}
          <section
            className={styles.dashboardSummaryCard}
            style={{ marginBottom: 28 }}
          >
            <Skeleton width={160} height={28} style={{ marginBottom: 8 }} />
            <div className={styles.summaryStatus}>
              <div className={styles.summaryStatItem}>
                <Skeleton width={102} height={18} style={{ marginBottom: 4 }} />
                <Skeleton width={36} height={21} style={{}} />
              </div>
              <div className={styles.summaryStatItem}>
                <Skeleton width={82} height={18} style={{ marginBottom: 4 }} />
                <Skeleton width={36} height={21} style={{}} />
              </div>
            </div>
          </section>
          {/* 소속 그룹 리스트 - 헤더 버튼, 그룹목록 */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Skeleton width={74} height={15} style={{ margin: 0 }} />
              <div style={{ display: "flex", gap: 8 }}>
                <Skeleton width={88} height={32} borderRadius={6} />
                <Skeleton width={94} height={32} borderRadius={6} />
              </div>
            </div>
            <ul className={styles.dashboardList} style={{ padding: 0 }}>
              {[1, 2, 3].map((_, idx) => (
                <li
                  key={idx}
                  className={styles.dashboardGroupItem}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 13,
                  }}
                >
                  <Skeleton
                    width={120}
                    height={19}
                    style={{ marginRight: 18 }}
                  />
                  <span
                    style={{
                      marginLeft: "auto",
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <Skeleton width={21} height={23} />
                    <Skeleton width={53} height={30} borderRadius={6} />
                    <Skeleton width={50} height={30} borderRadius={6} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div>에러 발생: {error.message}</div>;

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <div style={{ padding: "32px 0", flex: 1 }}>
        {/* 오늘의 스크럼 요약 */}
        {showGroups && (
          <section className={styles.dashboardSummaryCard}>
            <div className={styles.summaryTitle}>🌼 오늘의 스크럼 요약 🌼</div>
            <div className={styles.summaryStatus}>
              <div className={styles.summaryStatItem}>
                <span className={styles.summaryStatLabel}>
                  오늘 작성한 스크럼
                </span>
                <b className={`${styles.summaryStatValue} ${styles.completed}`}>
                  {todayScrumWritten}
                </b>
              </div>
              <div className={styles.summaryStatItem}>
                <span className={styles.summaryStatLabel}>미작성 스크럼</span>
                <b className={`${styles.summaryStatValue} ${styles.missed}`}>
                  {todayScrumNotWritten}
                </b>
              </div>
            </div>
          </section>
        )}
        {/* 소속 그룹 리스트 */}
        {showGroups ? (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h2 style={{ fontSize: "1.05rem", color: "#666", margin: 0 }}>
                소속 그룹
              </h2>
              <div style={{ display: "flex", gap: 8 }}>
                <Button
                  variant="secondary"
                  onClick={() => router.push("/group")}
                >
                  + 그룹 생성
                </Button>
                {/* <Button variant="secondary">🔍 그룹 참가</Button> */}
              </div>
            </div>
            <ul className={styles.dashboardList}>
              {groups.map((group) => (
                <li
                  key={group.id}
                  className={styles.dashboardGroupItem}
                  onClick={() => router.push(`/group/${group.id}`)}
                >
                  <span className={styles.groupName}>
                    {group.name}
                    {group.isManager && (
                      <span
                        title="그룹장"
                        style={{ marginLeft: 6, color: "#f4c542" }}
                      >
                        👑
                      </span>
                    )}
                  </span>
                  <span className={styles.groupBtns}>
                    <span title="오늘 스크럼 참여">
                      {group.isScrumToday ? "✔️" : "⚠️"}
                    </span>
                    <button
                      className={styles.iconBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/group/${group.id}/scrum`);
                      }}
                      title="스크럼 작성"
                      type="button"
                    >
                      <MdEdit size={20} color="#267fff" />
                    </button>
                    {group.isManager && (
                      <button
                        className={styles.iconBtnPrimary}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/group/${group.id}/manage`);
                        }}
                        title="그룹 관리"
                        type="button"
                      >
                        <FiSettings size={20} color="#fff" />
                      </button>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          // 그룹이 없을 때 안내
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 80,
              gap: 24,
            }}
          >
            <div
              style={{ fontSize: "1.1rem", color: "#aaa", marginBottom: 24 }}
            >
              아직 소속 그룹이 없습니다.
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              <Button
                variant="primary"
                round
                onClick={() => router.push("/group")}
              >
                🔘 새 그룹 만들기
              </Button>
              <Button variant="secondary" round>
                🔘 초대코드로 참가
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
