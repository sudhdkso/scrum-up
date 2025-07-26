"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getGroupDetail } from "@/lib/group";
import { GroupHeader } from "../GroupHeader";
import { TodayScrumStatus } from "../TodayScrumStatus";
import { ScrumTypeTab } from "../ScrumTypeTab";
import ScrumQuestionDropdown from "../ScrumQuestionDropdown";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { GroupDetailResponseDTO } from "@/services/group/dto/group.dto";
import { DailyScrumDTO } from "@/services/scrum/dto/DailyScrum";
import Drawer from "@/components/Drawer/Drawer";
import ScrumDrawerDetail from "@/components/ScrumDrawerDetail/ScrumDrawerDetail";
import { DateCardList, MemberCardList } from "../CardList";

export default function GroupScrumDetailPage() {
  const params = useParams();
  const groupId = params!.id as string;

  const [tab, setTab] = useState<"date" | "member">("date");
  const [group, setGroup] = useState<GroupDetailResponseDTO | null>(null);
  const [dailyScrums, setDailyScrums] = useState<DailyScrumDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [drawerTarget, setDrawerTarget] = useState<{
    type: "date" | "member";
    key: string;
  } | null>(null);

  useEffect(() => {
    if (!groupId) return;
    (async () => {
      try {
        setLoading(true);
        const data = await getGroupDetail(groupId);
        setGroup(data.group);
        setDailyScrums(data.group.dailyScrum || []);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, [groupId]);

  if (loading) {
    return (
      <div
        style={{
          maxWidth: 600,
          minHeight: "100vh",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "22px 0 10px 19px" }}>
          <Skeleton width={160} height={28} style={{ marginBottom: 8 }} />
          <Skeleton width={100} height={15} />
        </div>
        <Skeleton
          width="90%"
          height={23}
          style={{ margin: "0 auto 10px auto" }}
        />
        <Skeleton
          width="98%"
          height={26}
          style={{ margin: "0 auto 15px auto" }}
        />
        <div style={{ flex: 1, padding: "0 20px" }}>
          {[0, 1, 2].map((i) => (
            <Skeleton
              key={i}
              width="100%"
              height={64}
              style={{ marginBottom: 14, borderRadius: 11 }}
            />
          ))}
        </div>
      </div>
    );
  }
  if (error) return <div>에러: {error.message}</div>;
  if (!group) return <div>그룹을 찾을 수 없습니다.</div>;

  const scrums = dailyScrums;
  const members = group.members;

  return (
    <div
      style={{
        maxWidth: 600,
        minHeight: "100vh",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <GroupHeader group={group} />
      <TodayScrumStatus isSrumToday={group.isScrumToday} groupId={groupId} />
      <ScrumQuestionDropdown questions={group.questions} />
      <ScrumTypeTab tab={tab} setTab={setTab} />
      <main style={{ flex: 1, padding: "0 2px" }}>
        {tab === "date" ? (
          <DateCardList
            dates={scrums.map((s) => s.date)}
            scrums={scrums}
            selected={drawerTarget?.type === "date" ? drawerTarget.key : null}
            onSelect={(date) => setDrawerTarget({ type: "date", key: date })}
          />
        ) : (
          <MemberCardList
            members={members}
            scrums={scrums}
            selected={drawerTarget?.type === "member" ? drawerTarget.key : null}
            onSelect={(id) => setDrawerTarget({ type: "member", key: id })}
          />
        )}
        <Drawer open={!!drawerTarget} onClose={() => setDrawerTarget(null)}>
          {drawerTarget && (
            <ScrumDrawerDetail
              mode={drawerTarget.type}
              target={drawerTarget.key}
              scrums={scrums}
              members={members}
              onClose={() => setDrawerTarget(null)}
            />
          )}
        </Drawer>
      </main>
      <div style={{ height: 16 }} />
    </div>
  );
}
