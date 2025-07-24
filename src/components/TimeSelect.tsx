import React from "react";
import styles from "./TimeSection.module.css";

const CYCLES = [
  { key: "매일", label: "매일" },
  { key: "평일", label: "평일" },
  { key: "주말", label: "주말" },
];

type CycleType = "매일" | "평일" | "주말";

interface TimeSelectProps {
  hour: string;
  setHour: (v: string) => void;
  minute: string;
  setMinute: (v: string) => void;
  cycle: CycleType[];
  setCycle: (c: CycleType[]) => void;
  hourList?: string[];
  minuteList?: string[];
  className?: string;
}

export default function TimeSelect({
  hour,
  setHour,
  minute,
  setMinute,
  cycle,
  setCycle,
  hourList = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")),
  minuteList = Array.from({ length: 12 }, (_, i) =>
    String(i * 5).padStart(2, "0")
  ),
  className = "",
}: TimeSelectProps) {
  // 토글 로직
  const handleToggle = (which: CycleType) => {
    if (which === "매일") {
      if (cycle.length === 3) setCycle([]);
      else setCycle(["매일", "평일", "주말"]);
    } else {
      let newSet = [...cycle];
      if (newSet.includes(which)) {
        newSet = newSet.filter((v) => v !== which && v !== "매일");
      } else {
        newSet = [...newSet.filter((v) => v !== "매일"), which];
      }
      if (newSet.includes("평일") && newSet.includes("주말")) {
        newSet = ["매일", "평일", "주말"];
      }
      setCycle(newSet);
    }
  };

  return (
    <div className={styles.timeSelectBlock}>
      <div className={styles.labelBox}>
        <div className={styles.sectionDesc}>
          스크럼을 얼마나 자주 진행할까요?
        </div>
      </div>
      <div className={styles.cycleButtonWrap}>
        {CYCLES.map(({ key, label }) => (
          <button
            type="button"
            key={key}
            className={
              styles.cycleBtn +
              " " +
              (cycle.includes(key as CycleType) ? styles.cycleBtnActive : "")
            }
            onClick={() => handleToggle(key as CycleType)}
            aria-pressed={cycle.includes(key as CycleType)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={styles.labelBox} style={{ marginTop: 26 }}>
        <div className={styles.sectionDesc}>
          어느 시간대에 스크럼을 진행하실 건가요?
        </div>
      </div>
      <div className={styles.timeRow}>
        <select
          value={hour}
          onChange={(e) => setHour(e.target.value)}
          className={styles.selectBase}
          style={{
            minWidth: 70,
            width: "auto",
            maxWidth: 100,
            padding: "4px 10px",
            height: 32,
          }}
        >
          {hourList.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <span style={{ margin: "0 5px", fontWeight: 500 }}>:</span>
        <select
          value={minute}
          onChange={(e) => setMinute(e.target.value)}
          className={styles.selectBase}
          style={{
            minWidth: 70,
            width: "auto",
            maxWidth: 100,
            padding: "4px 10px",
            height: 32,
          }}
        >
          {minuteList.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
