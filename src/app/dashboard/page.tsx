"use client";
import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";
import { GroupSummaryDTO } from "@/services/group/dto/group.dto";
import { getUserGroups } from "@/lib/group";
import styles from "./dashboard.module.css";

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

  if (loading) return <div>로딩 중...</div>;
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
                <Button variant="primary" onClick={() => router.push("/group")}>
                  + 그룹 생성
                </Button>
                <Button variant="secondary">🔍 그룹 참가</Button>
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
                    <Button
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/group/${group.id}/scrum`);
                      }}
                    >
                      작성
                    </Button>
                    {group.isManager && (
                      <Button
                        variant="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/group/${group.id}/manage`);
                        }}
                      >
                        관리
                      </Button>
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
