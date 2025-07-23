"use client";
import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";
import { GroupSummaryDTO } from "@/service/group/dto/group.dto";
import { getUserGroups } from "@/lib/group";

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
          <section
            style={{
              background: "#eef3fb",
              borderRadius: 10,
              padding: "18px 24px",
              marginBottom: 32,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 1px 4px rgba(90,90,150,0.04)",
              fontWeight: 500,
              fontSize: "1.15rem",
              color: "#333",
              gap: 24,
            }}
          >
            <div
              style={{
                marginBottom: 12,
                fontWeight: 700,
                fontSize: "1.3rem",
              }}
            >
              🌼 오늘의 스크럼 요약 🌼
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: 80 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "1rem", color: "#666" }}>
                  오늘 작성한 스크럼
                </span>
                <b
                  style={{
                    color: "#4267B2",
                    fontSize: "1.3rem",
                    marginTop: 4,
                  }}
                >
                  {todayScrumWritten}
                </b>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "1rem", color: "#666" }}>
                  미작성 스크럼
                </span>
                <b
                  style={{
                    color: "#d9534f",
                    fontSize: "1.3rem",
                    marginTop: 4,
                  }}
                >
                  {todayScrumNotWritten}
                </b>
              </div>
            </div>
          </section>
        )}

        {/* 소속 그룹 (리스트 및 타이틀+버튼들은 그룹 있을 때에만 노출) */}
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
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {groups.map((group) => (
                <li
                  key={group.id}
                  onClick={() => router.push(`/group/${group.id}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    justifyContent: "space-between",
                    background: "#f6f6fa",
                    borderRadius: 10,
                    padding: "18px 16px",
                    marginBottom: 12,
                    cursor: "pointer",
                    transition: "background 0.12s",
                  }}
                >
                  <span style={{ fontWeight: 500, fontSize: "1.08rem" }}>
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
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
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
          // 그룹이 없을 때: 타이틀+버튼 없이 중앙 안내 및 버튼만 표시
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
