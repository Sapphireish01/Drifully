"use client";

import React, { useState, useRef } from "react";
import styles from "./OtpVerificationModal.module.css";

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export default function OtpVerificationModal({
  isOpen,
  onClose,
  onVerified,
}: OtpVerificationModalProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerified, setIsVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (!isOpen) return null;

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    // Auto focus next box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if filled
    if (newDigits.every((d) => d !== "")) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (isVerified) {
      onVerified();
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog">
        <div className={styles.header}>
          <h2 className={styles.title}>OTP Verification</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="1" y1="11" x2="11" y2="1" />
            </svg>
          </button>
        </div>

        <p className={styles.subtitle}>We sent a six digit code to your email address and phone number</p>

        {/* 6 Digit OTP Inputs */}
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

        <div className={styles.timerRow}>
          Code expires in <strong>1:24s</strong>
        </div>

        <button
          type="button"
          className={`${styles.verifyBtn} ${isVerified ? styles.activeVerify : ""}`}
          onClick={handleVerify}
        >
          {isVerified ? (
            <span className={styles.verifiedText}>
              Updated Successfully
              <span className={styles.checkCircle}>✓</span>
            </span>
          ) : (
            "Verify Code"
          )}
        </button>
      </div>
    </div>
  );
}
