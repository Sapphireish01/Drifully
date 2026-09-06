"use client";

import React from "react";
import Link from "next/link";
import styles from "./ExtensionConfirmedModal.module.css";

interface ExtensionConfirmedModalProps {
  isOpen: boolean;
  onClose: () => void;
  newReturnDate: string;
  confirmationData?: any;
}

export default function ExtensionConfirmedModal({
  isOpen,
  onClose,
  newReturnDate,
  confirmationData,
}: ExtensionConfirmedModalProps) {
  if (!isOpen) return null;

  const extRef = confirmationData?.reference || confirmationData?.id || "";

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog">
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className={styles.content}>
          <div className={styles.checkCircle}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h2 className={styles.title}>Extension Confirmed</h2>
          <p className={styles.subtitle}>Your rental period has been updated successfully</p>

          {extRef && (
            <div style={{ background: "#f8fafc", border: "1px dashed #0f172a", borderRadius: "8px", padding: "8px 16px", marginBottom: "12px", fontSize: "14px", fontWeight: 700 }}>
              Ref: {extRef}
            </div>
          )}

          <div className={styles.summaryCard}>
            <div className={styles.summaryRow}>
              <span className={styles.label}>New Return Date</span>
              <strong className={styles.val}>{confirmationData?.new_dropoff_date || newReturnDate}</strong>
            </div>

            {confirmationData?.additional_days && (
              <div className={styles.summaryRow}>
                <span className={styles.label}>Extended Days</span>
                <strong className={styles.val}>{confirmationData.additional_days} day(s)</strong>
              </div>
            )}

            <div className={styles.summaryRow}>
              <span className={styles.label}>Drop Off Location</span>
              <strong className={styles.val}>Murtala Muhammed Airport Lagos</strong>
            </div>
          </div>

          <div className={styles.btnRow}>
            <button type="button" className={styles.homeBtn} onClick={onClose}>
              Done
            </button>
            <Link href="/customer/trips" className={styles.viewBookingBtn} onClick={onClose}>
              View All Trips
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
