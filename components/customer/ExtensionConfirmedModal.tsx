"use client";

import React from "react";
import Link from "next/link";
import styles from "./ExtensionConfirmedModal.module.css";

interface ExtensionConfirmedModalProps {
  isOpen: boolean;
  onClose: () => void;
  newReturnDate: string;
}

export default function ExtensionConfirmedModal({
  isOpen,
  onClose,
  newReturnDate,
}: ExtensionConfirmedModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog">
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="1" y1="1" x2="11" y2="11" />
            <line x1="1" y1="11" x2="11" y2="1" />
          </svg>
        </button>

        <div className={styles.content}>
          <div className={styles.checkCircle}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h2 className={styles.title}>Extension Confirmed</h2>
          <p className={styles.subtitle}>Your new return time has been updated successfully</p>

          <div className={styles.summaryCard}>
            <div className={styles.summaryRow}>
              <span className={styles.label}>New Return Date</span>
              <strong className={styles.val}>{newReturnDate || "30 Mar 2025"}</strong>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.label}>Drop Off Location</span>
              <strong className={styles.val}>Murtala Muhammed Airport Lagos</strong>
            </div>
          </div>

          <div className={styles.btnRow}>
            <button type="button" className={styles.homeBtn} onClick={onClose}>
              Home
            </button>
            <Link href="/customer/trips" className={styles.viewBookingBtn} onClick={onClose}>
              View Booking
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
