import React from "react";
import styles from "./qnablock.module.css";

interface SectionProps {
  questions: string[];
  answers: string[];
}

export function UserQnABlock({ questions, answers }: SectionProps) {
  return (
    <div className={styles.qnaWrap}>
      {questions.map((q, idx) => (
        <React.Fragment key={idx}>
          <div className={styles.qBlock}>
            <span className={styles.qLabel}>Q.</span>
            <span className={styles.qaContent}>{q}</span>
          </div>
          <div className={styles.aBlock}>
            <span className={styles.aLabel}>A.</span>
            <span className={styles.aContentLines}>
              {answers[idx] && answers[idx].trim() !== "" ? (
                answers[idx].split("\n").map((line, i) =>
                  line.trim() === "" ? (
                    <div key={i} className={styles.aLineEmpty}>
                      {/* 빈 줄 spacer */}
                    </div>
                  ) : (
                    <div key={i} className={styles.aLine}>
                      <span className={styles.aLineBullet} />
                      <span className={styles.aLineText}>{line}</span>
                    </div>
                  )
                )
              ) : (
                <span className={styles.aMissing}>미작성</span>
              )}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
