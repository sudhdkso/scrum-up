import React, { useState, useEffect } from "react";
import { UserQnABlock } from "@/components/UserQnABlock";
import SelectorDropdown from "@/components/SelectorDropdown/SelectorDropdown";
import styles from "./ScrumDrawerDetail.module.css";
import type {
  DailyScrumDTO,
  UserAnswerDTO,
} from "@/services/scrum/dto/DailyScrum";

type DetailMode = "date" | "member";
interface Member {
  id: string;
  name: string;
}
interface Props {
  mode: DetailMode;
  target: string;
  scrums: DailyScrumDTO[];
  members: Member[];
  onClose: () => void;
}

export default function ScrumDrawerDetail({
  mode,
  target,
  scrums,
  members,
}: Props) {
  const isDateMode = mode === "date";
  let items: { label: string; answer: UserAnswerDTO | null; id: string }[],
    title: string;
  if (isDateMode) {
    const scrum = scrums.find((s) => s.date === target);
    items = members.map((m) => ({
      label: m.name,
      answer: scrum?.answersByUser?.find((u) => u.userId === m.id) ?? null,
      id: m.id,
    }));
    title = target;
  } else {
    const member = members.find((m) => m.id === target);
    items = scrums.map((s) => ({
      label: s.date,
      answer: s.answersByUser.find((u) => u.userId === target) ?? null,
      id: s.date,
    }));
    title = member?.name ?? "-";
  }
  const [idx, setIdx] = useState(0);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    setIdx(0);
  }, [target, scrums, members, mode]);

  return (
    <div className={styles.root}>
      <div className={styles.centerTitle}>{title}</div>
      <div className={styles.selectorWrap}>
        {idx > 0 ? (
          <button
            className={styles.arrowBtn}
            onClick={() => setIdx(idx - 1)}
            aria-label="이전"
          >
            &lt;
          </button>
        ) : (
          <div className={styles.arrowPlaceholder} />
        )}
        <span
          className={styles.selectorValue}
          onClick={() => setShowList(true)}
        >
          {items[idx].label}
          <span className={styles.selectorArrow}>▼</span>
          <SelectorDropdown
            options={items}
            valueIdx={idx}
            onChange={setIdx}
            show={showList}
            setShow={setShowList}
          />
        </span>
        {idx < items.length - 1 ? (
          <button
            className={styles.arrowBtn}
            onClick={() => setIdx(idx + 1)}
            aria-label="다음"
          >
            &gt;
          </button>
        ) : (
          <div className={styles.arrowPlaceholder} />
        )}
      </div>
      <div className={styles.qnaArea}>
        {items[idx].answer ? (
          <UserQnABlock
            questions={items[idx].answer.questions}
            answers={items[idx].answer.answers}
          />
        ) : (
          <div className={styles.noData}>미작성</div>
        )}
      </div>
      <div className={styles.pageIndicator}>
        {idx + 1} / {items.length}
      </div>
    </div>
  );
}
