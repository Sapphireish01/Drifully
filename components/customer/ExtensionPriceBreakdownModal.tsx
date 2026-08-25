"use client";

import React from "react";
import styles from "./ExtensionPriceBreakdownModal.module.css";

interface ExtensionPriceBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  onConfirm: () => void;
  newReturnDate: string;
}

export default function ExtensionPriceBreakdownModal({
  isOpen,
  onClose,
  onBack,
  onConfirm,
  newReturnDate,
}: ExtensionPriceBreakdownModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog">
        <div className={styles.header}>
          <div className={styles.titleWrap}>
            {onBack && (
              <button type="button" className={styles.backBtn} onClick={onBack} aria-label="Back">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h2 className={styles.title}>Price Breakdown</h2>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="1" y1="11" x2="11" y2="1" />
            </svg>
          </button>
        </div>

        <p className={styles.subtitle}>A detailed summary of your booking costs and charges.</p>

        <div className={styles.summaryCard}>
          <div className={styles.priceRow}>
            <span>New Return Date</span>
            <strong>{newReturnDate || "30 Mar 2026"}</strong>
          </div>
          <div className={styles.priceRow}>
            <span>Additional Time</span>
            <strong>N30,000</strong>
          </div>
          <div className={styles.priceRow}>
            <span>Taxes</span>
            <strong>N30,000</strong>
          </div>
          <div className={`${styles.priceRow} ${styles.totalRow}`}>
            <span>Total Additional Amount</span>
            <strong>N150,000.</strong>
          </div>
        </div>

        <button type="button" className={styles.confirmBtn} onClick={onConfirm}>
          Confirm Extension & Pay
        </button>
      </div>
    </div>
  );
}
