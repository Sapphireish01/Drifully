"use client";

import React, { useState } from "react";
import Image from "next/image";
import { vehiclesService } from "@/services/vehicles-service";
import styles from "./UploadDocumentsModal.module.css";

interface UploadDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  onContinue: () => void;
  bookingRef?: string;
}

export default function UploadDocumentsModal({
  isOpen,
  onClose,
  onBack,
  onContinue,
  bookingRef,
}: UploadDocumentsModalProps) {
  const [licenseFrontFile, setLicenseFrontFile] = useState<{ name: string; size: string; raw?: File } | null>(null);
  const [licenseBackFile, setLicenseBackFile] = useState<{ name: string; size: string; raw?: File } | null>(null);
  const [residencyFile, setResidencyFile] = useState<{ name: string; size: string; raw?: File } | null>(null);
  const [idType, setIdType] = useState<string>("PR");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFrontLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLicenseFrontFile({
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
        raw: file,
      });
    }
  };

  const handleBackLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLicenseBackFile({
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
        raw: file,
      });
    }
  };

  const handleResidencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResidencyFile({
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
        raw: file,
      });
    }
  };

  const isFormComplete = Boolean(licenseFrontFile && residencyFile);

  const handleContinueSubmit = async () => {
    if (!isFormComplete) return;

    if (bookingRef) {
      setIsUploading(true);
      try {
        if (residencyFile?.raw) {
          await vehiclesService.uploadIdentification(bookingRef, idType, residencyFile.raw);
        }
        if (licenseFrontFile?.raw) {
          await vehiclesService.uploadLicense(bookingRef, licenseFrontFile.raw, licenseBackFile?.raw);
        }
      } catch (err) {
        console.error("Document upload warning:", err);
      } finally {
        setIsUploading(false);
      }
    }

    onContinue();
  };

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
              <line x1="1" y1="1" x2="11" y2="1" />
            </svg>
          </button>
        </div>

        <p className={styles.description}>
          Provide your valid driver’s license and citizenship or permanent residency document to complete verification.
        </p>

        {/* Driver's License Section (Front & Back) */}
        <div className={styles.uploadSection}>
          <label className={styles.sectionLabel}>Upload Driver's License</label>
          <div className={styles.licenseGrid}>
            {/* Front Image */}
            <div>
              <div className={styles.subLabel}>Front Image *</div>
              {licenseFrontFile ? (
                <div className={styles.fileCard}>
                  <div className={styles.fileIcon}>
                    <Image src="/customer app/icons/pdf-file.svg" alt="PDF" width={28} height={28} />
                  </div>
                  <div className={styles.fileMeta}>
                    <span className={styles.fileName}>{licenseFrontFile.name}</span>
                    <span className={styles.fileStatus}>
                      {licenseFrontFile.size} • <span className={styles.completedText}>✔ Front</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => setLicenseFrontFile(null)}
                    aria-label="Remove front image"
                  >
                    <Image src="/customer app/icons/trash.svg" alt="Remove" width={18} height={18} />
                  </button>
                </div>
              ) : (
                <div className={styles.dropzone}>
                  <div className={styles.cloudIcon}>
                    <Image src="/customer app/icons/upload.svg" alt="Upload" width={24} height={24} />
                  </div>
                  <div className={styles.dropText}>
                    <span className={styles.dropTitle}>Front Photo</span>
                    <span className={styles.dropHint}>JPEG, PNG, PDF</span>
                  </div>
                  <label className={styles.browseBtn}>
                    Browse
                    <input type="file" accept="image/*,.pdf" onChange={handleFrontLicenseChange} className={styles.hiddenInput} />
                  </label>
                </div>
              )}
            </div>

            {/* Back Image */}
            <div>
              <div className={styles.subLabel}>Back Image (Optional)</div>
              {licenseBackFile ? (
                <div className={styles.fileCard}>
                  <div className={styles.fileIcon}>
                    <Image src="/customer app/icons/pdf-file.svg" alt="PDF" width={28} height={28} />
                  </div>
                  <div className={styles.fileMeta}>
                    <span className={styles.fileName}>{licenseBackFile.name}</span>
                    <span className={styles.fileStatus}>
                      {licenseBackFile.size} • <span className={styles.completedText}>✔ Back</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => setLicenseBackFile(null)}
                    aria-label="Remove back image"
                  >
                    <Image src="/customer app/icons/trash.svg" alt="Remove" width={18} height={18} />
                  </button>
                </div>
              ) : (
                <div className={styles.dropzone}>
                  <div className={styles.cloudIcon}>
                    <Image src="/customer app/icons/upload.svg" alt="Upload" width={24} height={24} />
                  </div>
                  <div className={styles.dropText}>
                    <span className={styles.dropTitle}>Back Photo</span>
                    <span className={styles.dropHint}>JPEG, PNG, PDF</span>
                  </div>
                  <label className={styles.browseBtn}>
                    Browse
                    <input type="file" accept="image/*,.pdf" onChange={handleBackLicenseChange} className={styles.hiddenInput} />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Identification Type & Document Section */}
        <div className={styles.uploadSection}>
          <label className={styles.sectionLabel}>Identification Type *</label>
          <select
            className={styles.selectInput}
            value={idType}
            onChange={(e) => setIdType(e.target.value)}
          >
            <option value="PR">Permanent Residency</option>
            <option value="Citizenship">Proof of citizenship</option>
          </select>
        </div>

        {/* Upload Proof of Identification */}
        <div className={styles.uploadSection}>
          <label className={styles.sectionLabel}>Upload Identification Document *</label>
          {residencyFile ? (
            <div className={styles.fileCard}>
              <div className={styles.fileIcon}>
                <Image src="/customer app/icons/pdf-file.svg" alt="PDF" width={28} height={28} />
              </div>
              <div className={styles.fileMeta}>
                <span className={styles.fileName}>{residencyFile.name}</span>
                <span className={styles.fileStatus}>
                  {residencyFile.size} • <span className={styles.completedText}>✔ Attached</span>
                </span>
              </div>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={() => setResidencyFile(null)}
                aria-label="Remove document"
              >
                <Image src="/customer app/icons/trash.svg" alt="Remove" width={18} height={18} />
              </button>
            </div>
          ) : (
            <div className={styles.dropzone}>
              <div className={styles.cloudIcon}>
                <Image src="/customer app/icons/upload.svg" alt="Upload" width={28} height={28} />
              </div>
              <div className={styles.dropText}>
                <span className={styles.dropTitle}>Choose a file or drag & drop it here.</span>
                <span className={styles.dropHint}>JPEG, PNG, PDF formats, up to 50 MB.</span>
              </div>
              <label className={styles.browseBtn}>
                Browse File
                <input type="file" accept="image/*,.pdf" onChange={handleResidencyChange} className={styles.hiddenInput} />
              </label>
            </div>
          )}
        </div>

        <p className={styles.disclaimerText}>Your information is secure and only used for verification</p>

        <button
          type="button"
          className={`${styles.continueBtn} ${isFormComplete && !isUploading ? styles.activeContinue : ""}`}
          onClick={handleContinueSubmit}
          disabled={!isFormComplete || isUploading}
        >
          {isUploading ? "Uploading Documents..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
