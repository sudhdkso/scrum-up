"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "@/style/groupEdit.module.css";
import Button from "@/components/Button";
import { getGroupEditData } from "@/lib/group";
import { GroupManageDTO } from "@/services/group/dto/group.dto";
import { MdEdit } from "react-icons/md";
import QuestionList from "@/components/QuestionList";
import { updateGroupData } from "@/lib/group";

export default function GroupEditPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params?.id as string;

  const [group, setGroup] = useState<GroupManageDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savePending, setSavePending] = useState(false);

  const [editName, setEditName] = useState(false);
  const [editDesc, setEditDesc] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [descValue, setDescValue] = useState("");
  const [showDescAll, setShowDescAll] = useState(false);

  const [editTime, setEditTime] = useState(false);
  const [scrumTime, setScrumTime] = useState("");
  const [scrumCycle, setScrumCycle] = useState("");
  const [scrumHour, setScrumHour] = useState("09");
  const [scrumMinute, setScrumMinute] = useState("00");

  const [questions, setQuestions] = useState<string[]>([]);

  useEffect(() => {
    if (!groupId) return;
    setLoading(true);
    getGroupEditData(groupId)
      .then((data) => {
        const g = data.group;
        setGroup(g);
        setNameValue(g.name ?? "");
        setDescValue(g.desc ?? "");
        setScrumTime(g.scrumTime ?? "");
        setScrumCycle(g.cycle ?? "매일");
        setQuestions(g.questions ?? []);
      })
      .catch(() => setError("그룹 정보를 불러올 수 없습니다."))
      .finally(() => setLoading(false));
  }, [groupId]);

  const handleSave = async () => {
    setSavePending(true);
    try {
      await updateGroupData(groupId, {
        name: nameValue,
        desc: descValue,
        questions,
        scrumTime,
        cycle: scrumCycle,
      });
      alert("그룹 정보가 저장되었습니다!"); //alert말고 다른거로 수정하기
      router.push(`/group/${groupId}/manage`);
    } catch (e) {
      alert((e as Error).message || "저장 실패");
    } finally {
      setSavePending(false);
    }
  };

  const hourList = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const minuteList = Array.from({ length: 12 }, (_, i) =>
    String(i * 5).padStart(2, "0")
  );

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className={styles.pageWrap}>
      <section className={styles.groupHeader}>
        <span className={styles.groupAvatar}>👥</span>
        <div className={styles.groupMainInfo}>
          {editName ? (
            <input
              className={styles.titleInput}
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={() => {
                setEditName(false);
                setGroup((g) => ({ ...g!, name: nameValue }));
              }}
              autoFocus
            />
          ) : (
            <h1 className={styles.groupTitle}>
              {group?.name}
              <button
                className={styles.editIconBtn}
                onClick={() => setEditName(true)}
                type="button"
                aria-label="이름 수정"
              >
                <MdEdit size={21} />
              </button>
            </h1>
          )}
          {editDesc ? (
            <textarea
              className={styles.descTextarea}
              value={descValue}
              onChange={(e) => setDescValue(e.target.value)}
              onBlur={() => {
                setEditDesc(false);
                setGroup((g) => ({ ...g!, desc: descValue }));
              }}
              autoFocus
            />
          ) : (
            <div className={styles.groupDescBlock}>
              <span className={styles.groupDesc}>
                {showDescAll || !group?.desc || group.desc.length < 60 ? (
                  group?.desc ? (
                    group.desc
                  ) : (
                    <span style={{ color: "#b1b5be" }}>
                      그룹 설명이 없습니다
                    </span>
                  )
                ) : (
                  <>
                    {group.desc.slice(0, 58)}...
                    <button
                      className={styles.expandBtn}
                      onClick={() => setShowDescAll(true)}
                    >
                      펼치기
                    </button>
                  </>
                )}
              </span>
              <button
                className={styles.editIconBtn}
                onClick={() => setEditDesc(true)}
                type="button"
                aria-label="설명 수정"
              >
                <MdEdit size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      <section className={styles.scrumInfoBlock}>
        <span className={styles.scrumIcon}>⏰</span>
        {editTime ? (
          <>
            <select
              value={scrumCycle}
              onChange={(e) => setScrumCycle(e.target.value)}
              className={styles.selectBase}
            >
              <option value="매일">매일</option>
              <option value="평일">평일</option>
              <option value="주말">주말</option>
            </select>
            <select
              value={scrumHour}
              onChange={(e) => setScrumHour(e.target.value)}
              className={styles.selectBase}
              style={{ width: 70, marginLeft: 8 }}
            >
              {hourList.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <span style={{ margin: "0 3px" }}>:</span>
            <select
              value={scrumMinute}
              onChange={(e) => setScrumMinute(e.target.value)}
              className={styles.selectBase}
              style={{ width: 70 }}
            >
              {minuteList.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <Button
              onClick={() => {
                setScrumTime(`${scrumHour}:${scrumMinute}`);
                setEditTime(false);
              }}
              style={{
                marginLeft: 10,
                fontSize: "0.97em",
                padding: "5px 16px",
                height: 32,
              }}
            >
              확인
            </Button>
          </>
        ) : (
          <>
            <span className={styles.scrumTimeText}>
              이 그룹은 <b>{scrumCycle}</b> <b>{scrumTime}</b>에 스크럼을
              진행해요
            </span>
            <button
              className={styles.editIconBtn}
              onClick={() => setEditTime(true)}
              type="button"
              aria-label="시간 수정"
            >
              <MdEdit size={16} />
            </button>
          </>
        )}
      </section>

      <QuestionList
        questions={questions}
        setQuestions={setQuestions}
        maxQuestions={10}
        minQuestions={1}
      />

      <div className={styles.btnRow}>
        <Button variant="primary" onClick={handleSave} disabled={savePending}>
          변경사항 저장
        </Button>
        <Button variant="secondary" onClick={() => router.back()}>
          취소
        </Button>
      </div>
    </div>
  );
}
