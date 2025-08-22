import React from "react";
import styles from "./qnablock.module.css";

interface SectionProps {
  questions: string[];
  answers: string[];
}

export function UserQnABlock({ questions, answers }: SectionProps) {
  return (
    <section className={styles.qnaWrap}>
      {questions.map((q, idx) => {
        const answer = answers[idx]?.trim();
        return (
          <div className={styles.qnaGroup} key={idx}>
            <div className={styles.qCard}>
              <span className={styles.number}>{idx + 1}.</span>
              <span className={styles.qText}>{q}</span>
            </div>
            <div className={styles.aArea}>
              {answer ? (
                answer.split("\n").map((line, i) => (
                  <div className={styles.aLine} key={i}>
                    <span className={styles.aLineBullet}>-</span>
                    <span className={styles.aLineText}>{line}</span>
                  </div>
                ))
              ) : (
                <div className={styles.aMissing}>아직 작성하지 않았어요.</div>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
