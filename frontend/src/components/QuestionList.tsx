"use client";
import React, { useState } from "react";
import { MdDelete, MdAdd } from "react-icons/md";
import styles from "./QuestionList.module.css";
import SingleLineInput from "@/components/SingleLineInput";

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
  const [error, setError] = useState("");

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
      {/* 기존 질문들 */}
      {questions.map((q, idx) => (
        <SingleLineInput
          key={idx}
          value={q}
          onChange={(val) => updateQuestion(idx, val)}
          showRemoveButton={questions.length > minQuestions}
          onRemove={() => removeQuestion(idx)}
          showAddButton={false}
          errorMsg={undefined}
          placeholder={`질문 ${idx + 1}`}
        />
      ))}

      {/* 새 질문 추가 입력 */}
      {addMode ? (
        <div className={styles.qCardNew}>
          <SingleLineInput
            value={newQ}
            onChange={(val) => {
              setNewQ(val);
              if (error) setError("");
            }}
            placeholder="새 질문 입력"
            autoFocus
            showAddButton={true}
            showRemoveButton={false}
            onAdd={addQuestion}
            onEnter={addQuestion}
            errorMsg={error}
          />
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
