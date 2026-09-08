"use client";

import React from "react";
import Link from "next/link";
import styles from "./BookingConfirmedModal.module.css";
import { Vehicle } from "@/data/vehicles";

interface BookingConfirmedModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: Vehicle | null;
  pickupDate?: string;
  dropOffDate?: string;
  selectedMode?: "self" | "chauffeur";
  bookingReference?: string;
}

export default function BookingConfirmedModal({
  isOpen,
  onClose,
  vehicle,
  pickupDate,
  dropOffDate,
  selectedMode = "self",
  bookingReference,
}: BookingConfirmedModalProps) {
  if (!isOpen) return null;

  const tripHref = bookingReference ? `/customer/trips/${bookingReference}` : "/customer/trips";

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog">
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="1" y1="1" x2="11" y2="11" />
            <line x1="1" y1="1" x2="11" y2="1" />
          </svg>
        </button>

        <div className={styles.content}>
          <div className={styles.checkCircle}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h2 className={styles.title}>Booking Confirmed</h2>
          <p className={styles.subtitle}>Your vehicle has been successfully reserved for your selected dates.</p>

          <div className={styles.summaryCard}>
            {bookingReference && (
              <div className={styles.summaryRow}>
                <span className={styles.label}>Booking Reference</span>
                <span className={styles.val} style={{ fontWeight: 700, color: "#16a34a" }}>{bookingReference}</span>
              </div>
            )}
            <div className={styles.summaryRow}>
              <span className={styles.modeBadge}>
                {selectedMode === "self" ? "Drive Yourself" : "Chauffeur Service"}
              </span>
              <strong className={styles.vehicleTitle}>{vehicle?.name || "Drifully Luxury Vehicle"}</strong>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.label}>Reserved For</span>
              <span className={styles.val}>{pickupDate || "Scheduled Date"} {dropOffDate ? `– ${dropOffDate}` : ""}</span>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.label}>Pick Up & Drop Off Location</span>
              <span className={styles.val}>Murtala Muhammed Airport Lagos</span>
            </div>
          </div>

          <div className={styles.btnRow}>
            <button type="button" className={styles.homeBtn} onClick={onClose}>
              Home
            </button>
            <Link href={tripHref} className={styles.viewBookingBtn} onClick={onClose}>
              View Booking
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
