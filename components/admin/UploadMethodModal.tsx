"use client";

import styles from "./UploadMethodModal.module.css";

interface UploadMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectManual: () => void;
  onSelectBulk: () => void;
}

export default function UploadMethodModal({
  isOpen,
  onClose,
  onSelectManual,
  onSelectBulk,
}: UploadMethodModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Choose Upload Method</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <div className={styles.options}>
          <button className={styles.option} onClick={onSelectManual}>
            <span className={styles.optionText}>Manual Upload</span>
            <ChevronRightIcon />
          </button>

          <button className={styles.option} onClick={onSelectBulk}>
            <span className={styles.optionText}>Bulk Upload</span>
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
      <circle cx="12" cy="12" r="10" strokeOpacity={0.2} />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
