"use client";

import React from "react";
import styles from "./CancelReservationModal.module.css";

interface CancelReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: () => void;
}

export default function CancelReservationModal({
  isOpen,
  onClose,
  onConfirmCancel,
}: CancelReservationModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog">
        <div className={styles.header}>
          <h2 className={styles.title}>Cancel Reservation</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="1" y1="11" x2="11" y2="1" />
            </svg>
          </button>
        </div>

        <p className={styles.description}>
          Are you sure you want to cancel this reservation? Any eligible <strong>refund</strong> will be processed within <strong>24–72 hours</strong>.
        </p>

        <div className={styles.warningBanner}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c2410c" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>The 24-hour free cancellation period has elapsed, and a cancellation fee will apply</span>
        </div>

        <div className={styles.actionsRow}>
          <button type="button" className={styles.confirmCancelBtn} onClick={onConfirmCancel}>
            Cancel Reservation
          </button>
          <button type="button" className={styles.keepBtn} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
