import React from "react";
import styles from "./Modal.module.css";
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  leftButton?: {
    label: string;
    onClick: () => void;
    color?: "primary" | "danger" | "secondary";
    disabled?: boolean;
  };
  rightButton?: {
    label: string;
    onClick: () => void;
    color?: "primary" | "danger" | "secondary";
    disabled?: boolean;
  };
  footer?: React.ReactNode;
  styleOverlay?: React.CSSProperties;
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  leftButton,
  rightButton,
  footer,
  styleOverlay,
}: ModalProps) {
  return open ? (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles.modalCloseBtn}
          onClick={onClose}
          aria-label="닫기"
        >
          ×
        </button>
        {title && <div className={styles.modalTitle}>{title}</div>}
        <div className={styles.modalContent}>{children}</div>
        <div className={styles.modalBtnGroup}>
          {leftButton && (
            <button
              type="button"
              className={`${styles.modalButton} ${
                styles[leftButton.color ?? "primary"]
              }`}
              onClick={leftButton.onClick}
              disabled={leftButton.disabled}
            >
              {leftButton.label}
            </button>
          )}
          {rightButton && (
            <button
              type="button"
              className={`${styles.modalButton} ${
                styles[rightButton.color ?? "primary"]
              }`}
              onClick={rightButton.onClick}
              disabled={rightButton.disabled}
            >
              {rightButton.label}
            </button>
          )}
        </div>
        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  ) : null;
}
