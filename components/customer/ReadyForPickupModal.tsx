"use client";

import React, { useState } from "react";
import styles from "./ReadyForPickupModal.module.css";

interface ReadyForPickupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function ReadyForPickupModal({
  isOpen,
  onClose,
  onSubmit,
}: ReadyForPickupModalProps) {
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile({
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
      });
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog">
        <div className={styles.header}>
          <h2 className={styles.title}>Your Vehicle Is Ready For Pickup</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="1" y1="11" x2="11" y2="1" />
            </svg>
          </button>
        </div>

        <p className={styles.subtitle}>Use this six digit code to confirm your identity and pick up your vehicle</p>

        {/* 6 Digit Pickup Code Boxes */}
        <div className={styles.codeRow}>
          {["4", "4", "4", "4", "4", "4"].map((num, idx) => (
            <div key={idx} className={styles.codeBox}>
              {num}
            </div>
          ))}
        </div>

        <div className={styles.uploadSection}>
          <label className={styles.uploadLabel}>Please upload images or a video of the vehicle</label>

          {uploadedFile ? (
            <div className={styles.fileCard}>
              <div className={styles.fileIcon}>MP4</div>
              <div className={styles.fileMeta}>
                <span className={styles.fileName}>{uploadedFile.name}</span>
                <span className={styles.fileStatus}>
                  0 KB of 120 KB • <span className={styles.completedText}>✔ Completed</span>
                </span>
              </div>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={() => setUploadedFile(null)}
              >
                🗑
              </button>
            </div>
          ) : (
            <div className={styles.dropzone}>
              <div className={styles.cloudIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M7 16a4 4 0 01-.88-7.9 5 5 0 019.76-1.55 4 4 0 011.89 7.74M12 12v9m0-9l-3 3m3-3l3 3" />
                </svg>
              </div>
              <div className={styles.dropText}>
                <span className={styles.dropTitle}>Choose a file or drag & drop it here.</span>
                <span className={styles.dropHint}>JPEG, PNG, PDF, and MP4 formats, up to 50 MB.</span>
              </div>
              <label className={styles.browseBtn}>
                Browse File
                <input type="file" onChange={handleFileChange} className={styles.hiddenInput} />
              </label>
            </div>
          )}
        </div>

        <button
          type="button"
          className={`${styles.submitBtn} ${uploadedFile ? styles.activeSubmit : ""}`}
          onClick={() => {
            if (uploadedFile) onSubmit();
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
