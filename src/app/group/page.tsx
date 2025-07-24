"use client";
import React, { useState } from "react";
import styles from "@/style/groupForm.module.css";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";
import TextAreaInput from "@/components/TextAreaInput";
import QuestionList from "@/components/QuestionList";
import GroupCreatedModal from "./GroupCreatedModal";
import Accordion from "@/components/Accordion";
import TimeSelect from "@/components/TimeSelect";

const DEFAULT_QUESTIONS = [
  "어제 무엇을 했나요?",
  "오늘 무엇을 할 계획인가요?",
  "진행에 방해되는 장애물이 있나요?",
];
const MAX_QUESTIONS = 10;
type CycleType = "매일" | "평일" | "주말";

function getSubmitCycle(cycle: CycleType[]) {
  if (
    cycle.includes("매일") ||
    (cycle.includes("평일") && cycle.includes("주말"))
  ) {
    return "매일";
  } else if (cycle.includes("평일")) return "평일";
  else "주말";
}

function getSummaryCycleText(cycle: CycleType[]): string {
  if (
    cycle.includes("매일") ||
    (cycle.includes("평일") && cycle.includes("주말"))
  ) {
    return "매일";
  }
  return cycle.join(", ");
}

export default function GroupCreateAccordion() {
  const [activeStep, setActiveStep] = useState(1);
  const [groupName, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [questions, setQuestions] = useState([...DEFAULT_QUESTIONS]);

  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("00");
  const [cycle, setCycle] = useState<CycleType[]>(["매일", "평일", "주말"]);

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [createdGroupId, setCreatedGroupId] = useState<string>("");
  const [errorName, setErrorName] = useState("");
  const [errorCycle, setErrorCycle] = useState("");

  const hourList = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const minuteList = Array.from({ length: 12 }, (_, i) =>
    String(i * 5).padStart(2, "0")
  );
  const sendTime = `${hour}:${minute}`;

  const summaryTime =
    hour && minute
      ? `${getSummaryCycleText(cycle)} / ${hour}:${minute}`
      : "미입력";
  const summaryQuestions =
    questions.length > 0 ? `질문 ${questions.length}개` : "질문 없음";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // step1: 이름
    if (!groupName.trim()) {
      setActiveStep(1);
      setErrorName("그룹 이름을 입력해주세요!");
      return;
    }
    // step2: 주기
    if (!cycle || cycle.length === 0) {
      setActiveStep(2);
      setErrorCycle("스크럼 주기를 선택해주세요!");
      return;
    }
    setErrorName("");
    setErrorCycle("");
    setLoading(true);

    const submitCycle = getSubmitCycle(cycle);

    const res = await fetch("/api/group", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: groupName,
        description: desc,
        questions,
        scrumTime: sendTime,
        cycle: submitCycle,
      }),
    });

    const data = (await res.json()).group;
    setLoading(false);

    if (res.ok) {
      setCreatedGroupId(data._id);
      setModalOpen(true);
    } else {
      alert(data.message || "생성 실패");
    }
  }

  return (
    <div className={styles.centerContainer}>
      <form
        style={{ width: "90%", maxWidth: "90%", margin: 0, padding: 0 }}
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        {/* 이름/설명 */}
        <Accordion
          open={activeStep === 1}
          onHeaderClick={() => setActiveStep(1)}
          title={
            <span>
              <span role="img" aria-label="edit">
                ✏️
              </span>{" "}
              어떤 그룹을 만드시겠어요?
            </span>
          }
          summary={
            groupName ? (
              <span>
                <b>{groupName}</b>
                <br />
                <span style={{ color: "#999" }}>{desc || "설명없음"}</span>
              </span>
            ) : (
              <span style={{ color: "#bbb" }}>그룹 이름을 입력해 주세요</span>
            )
          }
        >
          <label className={styles.labelBase}>
            이름을 지어주세요
            <TextInput
              required
              value={groupName}
              onChange={(e) => {
                setName(e.target.value);
                if (errorName) setErrorName("");
              }}
              className={
                styles.inputBase + (errorName ? " " + styles.inputError : "")
              }
              placeholder="예: 프론트엔드 아침 스크럼팀"
              style={{ marginTop: 8 }}
            />
          </label>
          {errorName && (
            <div
              style={{
                color: "#e95d5d",
                marginTop: 3,
                fontSize: "0.97rem",
                fontWeight: 500,
                marginBottom: -6,
              }}
            >
              {errorName}
            </div>
          )}
          <label
            className={styles.labelBase}
            htmlFor="desc"
            style={{ marginTop: 14 }}
          >
            그룹을 간단히 소개해볼까요?{" "}
            <span style={{ color: "#7189" }}>(선택)</span>
            <TextAreaInput
              id="desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className={styles.textareaBase}
              placeholder="예: 매일 아침 9시에 진행하는 프론트엔드 공유 시간"
              style={{ marginTop: 8 }}
            />
          </label>
          <Button
            variant="primary"
            type="button"
            style={{ marginTop: 20, width: "100%" }}
            onClick={() => {
              if (!groupName.trim()) {
                setErrorName("그룹 이름을 입력해주세요!");
                return;
              }
              setErrorName("");
              setActiveStep(2);
            }}
          >
            다음
          </Button>
        </Accordion>

        {/*  시간/주기 */}
        <Accordion
          open={activeStep === 2}
          onHeaderClick={() => setActiveStep(2)}
          title={
            <span>
              <span role="img" aria-label="clock">
                ⏰
              </span>{" "}
              스크럼은 언제 할까요?
            </span>
          }
          summary={<span>{summaryTime}</span>}
        >
          <TimeSelect
            hour={hour}
            setHour={setHour}
            minute={minute}
            setMinute={setMinute}
            cycle={cycle}
            setCycle={(v) => {
              setCycle(v);
              if (v.length > 0 && errorCycle) setErrorCycle("");
            }}
            className={styles.timeSelectorBlock}
          />
          {errorCycle && (
            <div
              style={{
                color: "#e95d5d",
                marginTop: 8,
                marginBottom: 4,
                fontWeight: 500,
                fontSize: "0.97rem",
              }}
            >
              {errorCycle}
            </div>
          )}
          <div className={styles.buttonRow}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setActiveStep(1)}
            >
              이전
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => setActiveStep(3)}
            >
              다음
            </Button>
          </div>
        </Accordion>

        {/*  질문 리스트 */}
        <Accordion
          open={activeStep === 3}
          onHeaderClick={() => setActiveStep(3)}
          title={
            <span>
              <span role="img" aria-label="">
                ❓
              </span>{" "}
              어떤 질문을 나누고 싶으세요?
            </span>
          }
          summary={<span>{summaryQuestions}</span>}
        >
          <QuestionList
            questions={questions}
            setQuestions={setQuestions}
            maxQuestions={MAX_QUESTIONS}
            minQuestions={1}
          />
          <div className={styles.buttonRow}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setActiveStep(2)}
            >
              이전
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => setActiveStep(4)}
            >
              다음
            </Button>
          </div>
        </Accordion>

        {/* 최종 확인 */}
        <Accordion
          open={activeStep === 4}
          onHeaderClick={() => setActiveStep(4)}
          title={<span>🎉 이렇게 그룹이 만들어져요!</span>}
        >
          <ul className={styles.finalList}>
            <li>
              이름: <b>{groupName}</b>
            </li>
            {desc && (
              <li>
                설명: <span>{desc}</span>
              </li>
            )}
            <li>시간: {summaryTime}</li>
            <li>
              질문:
              <ul>
                {questions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </li>
          </ul>
          <div className={styles.buttonRow}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setActiveStep(3)}
              style={{ marginTop: 20 }}
            >
              이전
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              style={{
                flex: 1,
                marginTop: 20,
                width: "100%",
              }}
              onClick={(e) => handleSubmit(e)}
            >
              그룹 생성하기
            </Button>
          </div>
        </Accordion>
      </form>

      <GroupCreatedModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        groupId={createdGroupId}
      />
    </div>
  );
}
