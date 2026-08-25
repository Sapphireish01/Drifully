"use client";

import React from "react";
import Image from "next/image";
import styles from "./ReviewBookingModal.module.css";
import { Vehicle } from "@/data/vehicles";

interface ReviewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  onConfirm: () => void;
  vehicle: Vehicle;
  pickupDate: string;
  dropOffDate: string;
  selectedMode: "self" | "chauffeur";
}

export default function ReviewBookingModal({
  isOpen,
  onClose,
  onBack,
  onConfirm,
  vehicle,
  pickupDate,
  dropOffDate,
  selectedMode,
}: ReviewBookingModalProps) {
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
            <h2 className={styles.title}>Review Your Booking</h2>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="1" y1="11" x2="11" y2="1" />
            </svg>
          </button>
        </div>

        <div className={styles.infoBanner}>
          This reservation will be held for 24 hours. Please complete your payment within this time to secure your booking.
        </div>

        <div className={styles.vehicleHeader}>
          <div>
            <h3 className={styles.vehicleName}>{vehicle.name}</h3>
            <span className={styles.serviceMode}>
              {selectedMode === "self" ? "Drive Yourself" : "Chauffeur Service"}
            </span>
          </div>
          <span className={styles.arrowIcon}>›</span>
        </div>

        <div className={styles.sectionDivider}>Booking Summary</div>

        <div className={styles.datesRow}>
          <div>
            <span className={styles.label}>Booking Dates</span>
            <div className={styles.datesVal}>{pickupDate || "30 Mar 2026"} – {dropOffDate || "11 May 2026"}</div>
          </div>
          <button type="button" className={styles.editBtn}>
            <span>Edit</span>
            <Image src="/icons/edit.png" alt="Edit" width={14} height={14} />
          </button>
        </div>

        {selectedMode === "chauffeur" && (
          <div className={styles.driverBanner}>
            Your driver will be available from 8am – 6pm
          </div>
        )}

        <div className={styles.locationGroup}>
          <span className={styles.label}>Pick Up & Drop Off Location</span>
          <div className={styles.locationVal}>Murtala Muhammed International Airport Lagos</div>
        </div>

        <div className={styles.sectionDivider}>Extras</div>
        <div className={styles.priceRow}>
          <span>Extra Fuel</span>
          <strong>N10,000</strong>
        </div>
        <div className={styles.priceRow}>
          <span>Child Seat (2)</span>
          <strong>N20,000</strong>
        </div>

        <div className={styles.sectionDivider}>Price Breakdown</div>

        <div className={styles.priceRow}>
          <span>Subtotal</span>
          <strong>N10,000</strong>
        </div>
        <div className={styles.priceRow}>
          <span>Extras</span>
          <strong>N30,000</strong>
        </div>
        <div className={styles.priceRow}>
          <span>Taxes</span>
          <strong>N10,000</strong>
        </div>

        <button type="button" className={styles.confirmBtn} onClick={onConfirm}>
          Confirm & Pay
        </button>
      </div>
    </div>
  );
}
