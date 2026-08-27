"use client";

import React, { useState } from "react";
import styles from "./EnhanceTripModal.module.css";

interface EnhanceTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  onContinue: () => void;
}

export default function EnhanceTripModal({
  isOpen,
  onClose,
  onBack,
  onContinue,
}: EnhanceTripModalProps) {
  const [selectedExtras, setSelectedExtras] = useState<string[]>(["family"]);

  if (!isOpen) return null;

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

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
            <h2 className={styles.title}>Enhance Your Trip</h2>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="1" y1="11" x2="11" y2="1" />
            </svg>
          </button>
        </div>

        <p className={styles.description}>
          Add optional extras to make your journey smoother and more comfortable.
        </p>

        <div className={styles.infoBanner}>
          This booking includes 132 km of mileage. Additional mileage will attract extra charges.
        </div>

        <div className={styles.extrasList}>
          {/* Bundles */}
          <div className={styles.extraItem} onClick={() => toggleExtra("family")}>
            <input type="checkbox" checked={selectedExtras.includes("family")} readOnly />
            <div className={styles.extraContent}>
              <div className={styles.extraHeader}>
                <span className={styles.extraTitle}>Family Bundle</span>
                <span className={styles.extraPrice}>₦20,000–₦25,000<small>/day</small></span>
              </div>
              <p className={styles.extraSub}>• Child Seat (1) &nbsp;• Stroller</p>
            </div>
          </div>

          <div className={styles.extraItem} onClick={() => toggleExtra("convenience")}>
            <input type="checkbox" checked={selectedExtras.includes("convenience")} readOnly />
            <div className={styles.extraContent}>
              <div className={styles.extraHeader}>
                <span className={styles.extraTitle}>Convenience Bundle</span>
                <span className={styles.extraPrice}>₦15,000</span>
              </div>
              <p className={styles.extraSub}>• Charger &nbsp;• GPS &nbsp;• Mount</p>
            </div>
          </div>

          <div className={styles.extraItem} onClick={() => toggleExtra("vacation")}>
            <input type="checkbox" checked={selectedExtras.includes("vacation")} readOnly />
            <div className={styles.extraContent}>
              <div className={styles.extraHeader}>
                <span className={styles.extraTitle}>Vacation Bundle</span>
                <span className={styles.extraPrice}>₦30,000 – ₦40,000</span>
              </div>
              <p className={styles.extraSub}>• Umbrella &nbsp;• Chairs &nbsp;• Cooler</p>
            </div>
          </div>

          <div className={styles.extraItem} onClick={() => toggleExtra("business")}>
            <input type="checkbox" checked={selectedExtras.includes("business")} readOnly />
            <div className={styles.extraContent}>
              <div className={styles.extraHeader}>
                <span className={styles.extraTitle}>Business Bundle</span>
                <span className={styles.extraPrice}>₦20,000 – ₦30,000<small>/day</small></span>
              </div>
              <p className={styles.extraSub}>• WiFi &nbsp;• Charger &nbsp;• Mount</p>
            </div>
          </div>

          {/* Additional Services */}
          <h3 className={styles.sectionHeading}>Additional Services</h3>

          <div className={styles.extraItem} onClick={() => toggleExtra("airport")}>
            <input type="checkbox" checked={selectedExtras.includes("airport")} readOnly />
            <div className={styles.extraContent}>
              <div className={styles.extraHeader}>
                <span className={styles.extraTitle}>Airport Assistance</span>
                <span className={styles.extraPrice}>₦100,000</span>
              </div>
            </div>
          </div>

          <div className={styles.extraItem} onClick={() => toggleExtra("fuel")}>
            <input type="checkbox" checked={selectedExtras.includes("fuel")} readOnly />
            <div className={styles.extraContent}>
              <div className={styles.extraHeader}>
                <span className={styles.extraTitle}>Pre-paid Fuel</span>
                <span className={styles.extraPrice}>₦70,000</span>
              </div>
            </div>
          </div>

          <div className={styles.extraItem} onClick={() => toggleExtra("mileage")}>
            <input type="checkbox" checked={selectedExtras.includes("mileage")} readOnly />
            <div className={styles.extraContent}>
              <div className={styles.extraHeader}>
                <span className={styles.extraTitle}>Additional Mileage</span>
                <span className={styles.extraPrice}>₦70,000<small>/per 10km</small></span>
              </div>
            </div>
          </div>
        </div>

        <button type="button" className={styles.continueBtn} onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}
