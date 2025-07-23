"use client";
import { useEffect, useState } from "react";
import { GroupHeader } from "../GroupHeader";
import { TodayScrumStatus } from "../TodayScrumStatus";
import { TabBar } from "../TabBar";
import { DateAccordion } from "../accordion/DateAccordion";
import { MemberTabAccordion } from "../accordion/MemberTabAccordion";
import { useParams } from "next/navigation";
import { getGroupDetail } from "@/lib/group";
import { DailyScrumDTO } from "@/service/scrum/dto/DailyScrun";
import { GroupDetailResponseDTO } from "@/service/group/dto/group.dto";
import ScrumQuestionDropdown from "../ScrumQuestionDropdown";

export default function GroupScrumDetailPage() {
  const params = useParams();
  const groupId = params!.id as string;

  const [tab, setTab] = useState<"date" | "member">("date");
  const [openDates, setOpenDates] = useState<string[]>([]);
  const [openMembers, setOpenMembers] = useState<string[]>([]);

  const [group, setGroup] = useState<GroupDetailResponseDTO | null>(null);
  const [dailyScrums, setDailyScrums] = useState<DailyScrumDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error.message}</div>;
  if (!group) return <div>그룹을 찾을 수 없습니다.</div>;
  const scrums = dailyScrums;

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
      <TabBar tab={tab} setTab={setTab} />
      <main style={{ flex: 1, padding: "0 18px" }}>
        {tab === "date" ? (
          <DateAccordion
            scrums={scrums}
            openDates={openDates}
            setOpenDates={setOpenDates}
          />
        ) : (
          <MemberTabAccordion
            members={group.members}
            scrums={scrums}
            openMembers={openMembers}
            setOpenMembers={setOpenMembers}
          />
        )}
      </main>
      <div style={{ height: 16 }} />
    </div>
  );
}
