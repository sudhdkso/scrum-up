import React, { useState } from "react";
import styles from "./ScrumQuestionDropdown.module.css";

function ScrumQuestionDropdown({ questions }: { questions: string[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.dropdownWrap}>
      {/* 오늘의 질문 - 항상 한 줄만 노출 */}
      <div
        className={styles.dropdownHeader}
        onClick={() => setOpen((v) => !v)}
        title={open ? "질문 닫기" : "전체 질문 보기"}
      >
        📌 오늘의 스크럼 질문
        <span
          className={styles.dropdownChevron}
          style={{ transform: `rotate(${open ? 180 : 0}deg)` }}
        >
          ▼
        </span>
      </div>
      {/* 드롭다운 */}
      {open && (
        <ol className={styles.dropdownList}>
          {questions.length > 0 ? (
            questions.map((q, idx) => (
              <li key={idx} className={styles.dropdownItem}>
                <b>{idx + 1}. </b>
                {q}
              </li>
            ))
          ) : (
            <li className={styles.dropdownItem}>등록된 질문이 없습니다.</li>
          )}
        </ol>
      )}
    </div>
  );
}
export default ScrumQuestionDropdown;
