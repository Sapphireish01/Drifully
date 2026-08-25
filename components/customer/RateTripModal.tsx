"use client";

import React, { useState } from "react";
import styles from "./RateTripModal.module.css";

interface RateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (rating: number, feedback: string) => void;
}

export default function RateTripModal({
  isOpen,
  onClose,
  onSubmit,
}: RateTripModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (rating > 0) {
      if (onSubmit) onSubmit(rating, feedback);
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog">
        <div className={styles.header}>
          <h2 className={styles.title}>Rate Your Trip</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="1" y1="11" x2="11" y2="1" />
            </svg>
          </button>
        </div>

        {/* Interactive Star Rating */}
        <div className={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`${styles.starBtn} ${star <= rating ? styles.filledStar : ""}`}
              onClick={() => setRating(star)}
            >
              ★
            </button>
          ))}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>We would love your feedback</label>
          <div className={styles.textareaWrap}>
            <textarea
              className={styles.textarea}
              placeholder="Tell us how to serve you better"
              value={feedback}
              maxLength={200}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <span className={styles.charCounter}>{feedback.length}/200</span>
          </div>
        </div>

        <button
          type="button"
          className={`${styles.submitBtn} ${rating > 0 ? styles.activeSubmit : ""}`}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
