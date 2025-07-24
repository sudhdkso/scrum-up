"use client";
import React, { useState } from "react";
import { MdDelete, MdAdd } from "react-icons/md";
import styles from "./questionList.module.css";

interface QuestionListProps {
  questions: string[];
  setQuestions: (qArr: string[]) => void;
  maxQuestions?: number;
  minQuestions?: number;
}

export default function QuestionList({
  questions,
  setQuestions,
  maxQuestions = 10,
  minQuestions = 1,
}: QuestionListProps) {
  const [addMode, setAddMode] = useState(false);
  const [newQ, setNewQ] = useState("");
  const [error, setError] = useState(""); // 에러 메시지 상태

  const updateQuestion = (idx: number, value: string) => {
    setQuestions(questions.map((q, i) => (i === idx ? value : q)));
  };

  const removeQuestion = (idx: number) => {
    if (questions.length <= minQuestions) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const addQuestion = () => {
    const value = newQ.trim();
    if (!value) {
      setError("질문 내용을 입력해주세요.");
      return;
    }
    if (questions.length >= maxQuestions) {
      setError(`질문은 최대 ${maxQuestions}개까지 추가할 수 있습니다.`);
      return;
    }
    setQuestions([...questions, value]);
    setNewQ("");
    setError("");
    setAddMode(false);
  };

  return (
    <div className={styles.qCardsWrap}>
      {questions.map((q, idx) => (
        <div className={styles.qCard} key={idx}>
          <input
            value={q}
            className={styles.qCardInput}
            onChange={(e) => updateQuestion(idx, e.target.value)}
          />
          {questions.length > minQuestions && (
            <button
              className={styles.iconBtn}
              onClick={() => removeQuestion(idx)}
              type="button"
              aria-label="삭제"
            >
              <MdDelete size={16} />
            </button>
          )}
        </div>
      ))}

      {addMode ? (
        <div className={styles.qCardNew}>
          <input
            value={newQ}
            onChange={(e) => {
              setNewQ(e.target.value);
              if (error) setError(""); // 값 변경 시 에러 해제
            }}
            className={`${styles.qCardInput} ${error ? styles.inputError : ""}`}
            placeholder="새 질문 입력"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addQuestion();
              }
            }}
          />
          <button
            className={styles.iconBtn}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault();
              addQuestion();
            }}
          >
            <MdAdd size={18} />
          </button>
          {error && <div className={styles.errorMessage}>{error}</div>}
        </div>
      ) : (
        questions.length < maxQuestions && (
          <button
            className={styles.qCardAddBtn}
            onClick={() => {
              setNewQ("");
              setError("");
              setAddMode(true);
            }}
            type="button"
          >
            <MdAdd size={20} /> 질문 추가하기
          </button>
        )
      )}
    </div>
  );
}
