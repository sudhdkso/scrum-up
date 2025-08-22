import React from "react";
import styles from "./SelectorDropdown.module.css";
import { createPortal } from "react-dom";
import { UserAnswerDTO } from "@/services/scrum/dto/DailyScrum";

export interface SelectorDropdownProps {
  options: { label: string; id: string; answer?: UserAnswerDTO | null }[];
  valueIdx: number;
  onChange: (idx: number) => void;
  show: boolean;
  setShow: (show: boolean) => void;
}

export default function SelectorDropdown({
  options,
  valueIdx,
  onChange,
  show,
  setShow,
}: SelectorDropdownProps) {
  return (
    <>
      {show && (
        <>
          <div onClick={() => setShow(false)} className={styles.bgClick} />
          <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
            {options.map((item, i) => (
              <div
                key={item.id}
                className={`${styles.item} ${
                  i === valueIdx ? styles.selected : ""
                }`}
                onClick={() => {
                  onChange(i);
                  setShow(false);
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
