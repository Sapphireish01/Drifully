"use client";

import React, { useState } from "react";
import Image from "next/image";
import Spinner from "@/components/customer/Spinner";
import styles from "./RentalModeModal.module.css";

interface RentalModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode?: (mode: "self" | "chauffeur") => void | Promise<void>;
  isLoading?: boolean;
}

export default function RentalModeModal({
  isOpen,
  onClose,
  onSelectMode,
  isLoading = false,
}: RentalModeModalProps) {
  const [selectedMode, setSelectedMode] = useState<"self" | "chauffeur">("self");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSelectCard = async (mode: "self" | "chauffeur") => {
    if (isProcessing || isLoading) return;
    setSelectedMode(mode);
    if (onSelectMode) {
      setIsProcessing(true);
      try {
        await onSelectMode(mode);
      } finally {
        setIsProcessing(false);
      }
    } else {
      onClose();
    }
  };

  const showLoading = isProcessing || isLoading;

  return (
    <div className={styles.backdrop} onClick={showLoading ? undefined : onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rental-mode-heading"
      >
        {showLoading && (
          <div className={styles.overlaySpinner}>
            <Spinner label="Processing..." />
          </div>
        )}

        <div className={styles.header}>
          <h2 id="rental-mode-heading" className={styles.title}>
            Start Your Journey
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
            disabled={showLoading}
          >
            <svg
              width="6"
              height="6"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="1" y1="11" x2="11" y2="1" />
            </svg>
          </button>
        </div>

        <p className={styles.subtitle}>How would you like to rent this vehicle?</p>

        <div className={styles.optionsGrid}>
          {/* Drive Yourself Column */}
          <div className={styles.optionCol}>
            <div
              className={`${styles.optionCard} ${selectedMode === "self" ? styles.selectedCard : ""
                } ${showLoading ? styles.disabledCard : ""}`}
              onClick={() => handleSelectCard("self")}
            >
              <div className={styles.cardTop}>
                <div className={styles.iconBox}>
                  <Image
                    src="/customer app/icons/driveyourself.png"
                    alt="Drive Yourself"
                    width={32}
                    height={32}
                  />
                </div>
                <div className={styles.cardText}>
                  <h3 className={styles.cardTitle}>Drive Yourself</h3>
                  <p className={styles.cardDesc}>
                    Drive the vehicle yourself, control your trip
                  </p>
                </div>
              </div>
            </div>
            <p className={styles.noteText}>Requires a valid drivers license</p>
          </div>

          {/* Chauffeur Service Column */}
          <div className={styles.optionCol}>
            <div
              className={`${styles.optionCard} ${selectedMode === "chauffeur" ? styles.selectedCard : ""
                } ${showLoading ? styles.disabledCard : ""}`}
              onClick={() => handleSelectCard("chauffeur")}
            >
              <div className={styles.cardTop}>
                <div className={styles.iconBox}>
                  <Image
                    src="/customer app/icons/chauffer service.svg"
                    alt="Chauffeur Service"
                    width={28}
                    height={28}
                  />
                </div>
                <div className={styles.cardText}>
                  <h3 className={styles.cardTitle}>Chauffeur Service</h3>
                  <p className={styles.cardDesc}>
                    Sit back and let a driver handle the journey
                  </p>
                </div>
              </div>
            </div>
            <p className={styles.noteText}>Driver fees will apply</p>
          </div>
        </div>
      </div>
    </div>
  );
}
