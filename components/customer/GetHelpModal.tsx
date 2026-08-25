"use client";

import React from "react";
import styles from "./GetHelpModal.module.css";

interface GetHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption?: (option: string) => void;
}

export default function GetHelpModal({
  isOpen,
  onClose,
  onSelectOption,
}: GetHelpModalProps) {
  if (!isOpen) return null;

  const options = [
    "Contact Support",
    "Report An Issue",
    "Chat with An Agent",
    "Emergency Help",
  ];

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog">
        <div className={styles.header}>
          <h2 className={styles.title}>Get Help</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="1" y1="11" x2="11" y2="1" />
            </svg>
          </button>
        </div>

        <p className={styles.subtitle}>We’re here to help with this booking</p>

        <div className={styles.optionsList}>
          {options.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              className={styles.optionBtn}
              onClick={() => {
                if (onSelectOption) onSelectOption(opt);
                onClose();
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
