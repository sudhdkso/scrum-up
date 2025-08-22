import React, { forwardRef } from "react";
import { MdAdd, MdDelete } from "react-icons/md";
import styles from "./SingleLineInput.module.css";

export interface SingleLineInputProps {
  value: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange: (value: string) => void;
  placeholder?: string;
  errorMsg?: string;
  onEnter?: () => void;
  onAdd?: () => void;
  onRemove?: () => void;
  showAddButton?: boolean;
  showRemoveButton?: boolean;
  autoFocus?: boolean;
}

const SingleLineInput = forwardRef<HTMLInputElement, SingleLineInputProps>(
  function SingleLineInput(
    {
      value,
      onKeyDown,
      onChange,
      placeholder = "",
      errorMsg,
      onEnter,
      onAdd,
      onRemove,
      showAddButton = false,
      showRemoveButton = false,
      autoFocus = false,
    },
    ref
  ) {
    return (
      <div className={styles.inputRow}>
        <div className={styles.inputInner}>
          <input
            ref={ref}
            type="text"
            className={`${styles.inputBase}${
              errorMsg ? " " + styles.errorInput : ""
            }`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (onKeyDown) {
                onKeyDown(e);
              } else if (e.key === "Enter" && onEnter) {
                e.preventDefault();
                onEnter();
              }
            }}
            placeholder={placeholder}
            autoFocus={autoFocus}
          />
          {showAddButton && (
            <button
              type="button"
              className={styles.addBtn}
              onClick={onAdd}
              aria-label="추가"
              tabIndex={-1}
            >
              <MdAdd size={18} />
            </button>
          )}
          {showRemoveButton && (
            <button
              type="button"
              className={styles.removeBtn}
              onClick={onRemove}
              aria-label="삭제"
              tabIndex={-1}
            >
              <MdDelete size={16} />
            </button>
          )}
        </div>
        {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}
      </div>
    );
  }
);

export default SingleLineInput;
