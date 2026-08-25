"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./DeactivateAccountModal.module.css";

interface DeactivateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeactivateAccountModal({
  isOpen,
  onClose,
}: DeactivateAccountModalProps) {
  const [hasActiveBookings, setHasActiveBookings] = useState(false);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog">
        <div className={styles.header}>
          <h2 className={styles.title}>Deactivate Account?</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="1" y1="11" x2="11" y2="1" />
            </svg>
          </button>
        </div>

        <p className={styles.subtitle}>
          Are you sure you want to <strong>deactivate</strong> this account, you will no longer have access to Drifully
        </p>

        {hasActiveBookings ? (
          <div className={styles.errorBanner}>
            <span className={styles.alertIcon}>⚠️</span>
            <span>We cannot deactivate your account at the moment, you still have active bookings. Please complete bookings to proceed.</span>
          </div>
        ) : (
          <div className={styles.warningBanner}>
            <span className={styles.alertIcon}>⚠️</span>
            <span>Active bookings must be completed before deactivation.</span>
          </div>
        )}

        {hasActiveBookings ? (
          <Link href="/customer/trips" className={styles.backBookingsBtn} onClick={onClose}>
            Back to Bookings
          </Link>
        ) : (
          <button
            type="button"
            className={styles.deactivateBtn}
            onClick={() => setHasActiveBookings(true)}
          >
            Deactivate
          </button>
        )}
      </div>
    </div>
  );
}
