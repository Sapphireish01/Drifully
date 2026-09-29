"use client";

import React from "react";
import styles from "./LogoutConfirmationModal.module.css";

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
}

export default function LogoutConfirmationModal({
  isOpen,
  onClose,
  onConfirmLogout,
}: LogoutConfirmationModalProps) {
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
          <h2 className={styles.title}>Logout?</h2>
          <p className={styles.subtitle}>Are you sure you want to logout from this account?</p>

          <div className={styles.btnRow}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="button" className={styles.logoutBtn} onClick={onConfirmLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
