"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./UploadDocumentsModal.module.css";

interface UploadDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  onContinue: () => void;
}

export default function UploadDocumentsModal({
  isOpen,
  onClose,
  onBack,
  onContinue,
}: UploadDocumentsModalProps) {
  const [licenseFile, setLicenseFile] = useState<{ name: string; size: string } | null>(null);
  const [residencyFile, setResidencyFile] = useState<{ name: string; size: string } | null>(null);

  if (!isOpen) return null;

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLicenseFile({
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
      });
    }
  };

  const handleResidencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResidencyFile({
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
      });
    }
  };

  const isFormComplete = Boolean(licenseFile && residencyFile);

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.header}>
          <div className={styles.titleWrap}>
            {onBack && (
              <button type="button" className={styles.backBtn} onClick={onBack} aria-label="Go back">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h2 className={styles.title}>Upload Your Documents</h2>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="1" y1="11" x2="11" y2="1" />
            </svg>
          </button>
        </div>

        <p className={styles.description}>
          Provide your valid driver’s license and citizenship or permanent residency document to complete verification.
        </p>

        {/* Upload Driver's License */}
        <div className={styles.uploadSection}>
          <label className={styles.sectionLabel}>Upload Drivers License</label>
          {licenseFile ? (
            <div className={styles.fileCard}>
              <div className={styles.fileIcon}>PDF</div>
              <div className={styles.fileMeta}>
                <span className={styles.fileName}>{licenseFile.name}</span>
                <span className={styles.fileStatus}>
                  0 KB of 120 KB • <span className={styles.completedText}>✔ Completed</span>
                </span>
              </div>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={() => setLicenseFile(null)}
                aria-label="Remove file"
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
                <input type="file" onChange={handleLicenseChange} className={styles.hiddenInput} />
              </label>
            </div>
          )}
        </div>

        {/* Upload Permanent Residency or Citizenship */}
        <div className={styles.uploadSection}>
          <label className={styles.sectionLabel}>Upload Permanent Residency or Citizenship Status</label>
          {residencyFile ? (
            <div className={styles.fileCard}>
              <div className={styles.fileIcon}>PDF</div>
              <div className={styles.fileMeta}>
                <span className={styles.fileName}>{residencyFile.name}</span>
                <span className={styles.fileStatus}>
                  0 KB of 120 KB • <span className={styles.completedText}>✔ Completed</span>
                </span>
              </div>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={() => setResidencyFile(null)}
                aria-label="Remove file"
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
                <input type="file" onChange={handleResidencyChange} className={styles.hiddenInput} />
              </label>
            </div>
          )}
        </div>

        <p className={styles.disclaimerText}>Your information is secure and only used for verification</p>

        <button
          type="button"
          className={`${styles.continueBtn} ${isFormComplete ? styles.activeContinue : ""}`}
          onClick={() => {
            if (isFormComplete) onContinue();
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
