"use client";

import React, { useState, useRef } from "react";
import styles from "./TwoFactorPinModal.module.css";

interface TwoFactorPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isChangePin?: boolean;
}

export default function TwoFactorPinModal({
  isOpen,
  onClose,
  onSuccess,
  isChangePin = false,
}: TwoFactorPinModalProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [isEnabled, setIsEnabled] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (!isOpen) return null;

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newDigits.every((d) => d !== "")) {
      setIsEnabled(true);
    } else {
      setIsEnabled(false);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleAction = () => {
    if (isEnabled) {
      onSuccess();
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog">
        <div className={styles.header}>
          <h2 className={styles.title}>Two-Factor Authentication</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="1" y1="11" x2="11" y2="1" />
            </svg>
          </button>
        </div>

        <p className={styles.subtitle}>
          {isChangePin ? "Enter a new six digit PIN" : "Create a six digit PIN"}
        </p>

        {/* 6 Digit Inputs */}
        <div className={styles.digitsRow}>
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="text"
              maxLength={1}
              className={styles.digitBox}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
            />
          ))}
        </div>

        <button
          type="button"
          className={`${styles.actionBtn} ${isEnabled ? styles.activeAction : ""}`}
          onClick={handleAction}
        >
          {isEnabled ? (
            <span className={styles.enabledWrap}>
              {isChangePin ? "PIN Updated" : "Enabled"}
              <span className={styles.checkCircle}>✓</span>
            </span>
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </div>
  );
}
