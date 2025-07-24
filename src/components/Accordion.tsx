import React from "react";
import styles from "@/style/groupForm.module.css";

export default function Accordion({
  open,
  onHeaderClick,
  title,
  summary,
  children,
}: {
  open: boolean;
  onHeaderClick: () => void;
  title: React.ReactNode;
  summary?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={
        styles.accordionSection + " " + (open ? styles.opened : styles.closed)
      }
    >
      <div
        className={styles.accordionHeader}
        onClick={onHeaderClick}
        tabIndex={0}
      >
        <div className={styles.accordionTitle}>{title}</div>
        {!open && <div className={styles.accordionSummary}>{summary}</div>}
        <div className={styles.accordionArrow}>{open ? "▲" : "▼"}</div>
      </div>
      {open && <div className={styles.accordionBody}>{children}</div>}
    </section>
  );
}
