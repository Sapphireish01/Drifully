"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { bookingsService, RebookCheckDatesResponse, RebookConfirmResponse } from "@/services/bookings-service";
import Spinner from "@/components/customer/Spinner";
import styles from "./RebookVehicleModal.module.css";

interface RebookVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingRef: string;
  vehicleTitle?: string;
  initialDriveType?: string;
}

export default function RebookVehicleModal({
  isOpen,
  onClose,
  bookingRef,
  vehicleTitle = "Vehicle",
  initialDriveType = "Drive Yourself",
}: RebookVehicleModalProps) {
  const router = useRouter();

  // Step 1: Form / Date Check; Step 2: Confirmed Success
  const [step, setStep] = useState<"form" | "confirmed">("form");

  // Form states
  const [pickupDate, setPickupDate] = useState<string>("");
  const [dropoffDate, setDropoffDate] = useState<string>("");
  const [driveType, setDriveType] = useState<string>(
    initialDriveType?.toLowerCase().includes("chauffeur") ? "chauffeur" : "drive_yourself"
  );

  // Price & Availability Check state
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [checkResult, setCheckResult] = useState<RebookCheckDatesResponse | null>(null);
  const [checkError, setCheckError] = useState<string | null>(null);

  // Confirm state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedData, setConfirmedData] = useState<RebookConfirmResponse | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep("form");
      setCheckResult(null);
      setCheckError(null);
      setSubmitError(null);
      setConfirmedData(null);

      // Default dates to next week
      const today = new Date();
      const nextWeekStart = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const nextWeekEnd = new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000);

      const startStr = nextWeekStart.toISOString().split("T")[0];
      const endStr = nextWeekEnd.toISOString().split("T")[0];

      setPickupDate(startStr);
      setDropoffDate(endStr);
      setDriveType(initialDriveType?.toLowerCase().includes("chauffeur") ? "chauffeur" : "drive_yourself");
    }
  }, [isOpen, initialDriveType]);

  // Automatically check availability when both dates are provided
  useEffect(() => {
    if (!isOpen || !bookingRef || !pickupDate || !dropoffDate) return;

    if (new Date(pickupDate) > new Date(dropoffDate)) {
      setCheckError("Drop-off date must be after pick-up date");
      setCheckResult(null);
      return;
    }

    let isCurrent = true;
    setIsChecking(true);
    setCheckError(null);

    bookingsService
      .checkRebookDates(bookingRef, { pickup_date: pickupDate, dropoff_date: dropoffDate })
      .then((res) => {
        if (!isCurrent) return;
        setCheckResult(res);
        if (!res.available) {
          setCheckError(res.message || "This vehicle is not available for the selected dates.");
        }
      })
      .catch((err) => {
        if (!isCurrent) return;
        console.error("Date check failed:", err);
        setCheckError("Unable to verify vehicle availability for these dates.");
      })
      .finally(() => {
        if (isCurrent) setIsChecking(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [isOpen, bookingRef, pickupDate, dropoffDate]);

  if (!isOpen) return null;

  const handleConfirmRebooking = async () => {
    if (!pickupDate || !dropoffDate) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await bookingsService.confirmRebook(bookingRef, {
        pickup_date: pickupDate,
        dropoff_date: dropoffDate,
        drive_type: driveType,
      });
      setConfirmedData(result);
      setStep("confirmed");
    } catch (err: any) {
      console.error("Rebooking confirmation failed:", err);
      setSubmitError(err?.response?.data?.message || err?.message || "Failed to confirm rebooking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount?: string | number) => {
    if (amount === undefined || amount === null) return "₦0";
    const num = typeof amount === "number" ? amount : parseFloat(String(amount));
    if (isNaN(num)) return `₦${amount}`;
    return `₦${num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog">
        {step === "form" ? (
          <>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.titleGroup}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 4v6h6M23 20v-6h-6" />
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                </svg>
                <h2 className={styles.title}>Rebook Vehicle</h2>
              </div>
              <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
                ✕
              </button>
            </div>

            <div className={styles.body}>
              {/* Vehicle Banner */}
              <div className={styles.vehicleBanner}>
                <div>
                  <span className={styles.bannerLabel}>Vehicle</span>
                  <h3 className={styles.vehicleName}>{vehicleTitle}</h3>
                </div>
                <span className={styles.bookingRefBadge}>Ref: {bookingRef}</span>
              </div>

              {/* Date Inputs */}
              <div className={styles.datesGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Pick-up Date</label>
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Drop-off Date</label>
                  <input
                    type="date"
                    className={styles.dateInput}
                    value={dropoffDate}
                    onChange={(e) => setDropoffDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Drive Mode Selection */}
              <div className={styles.inputGroup}>
                <label className={styles.label}>Drive Mode</label>
                <div className={styles.modeToggle}>
                  <button
                    type="button"
                    className={`${styles.modeBtn} ${driveType === "drive_yourself" ? styles.modeBtnActive : ""}`}
                    onClick={() => setDriveType("drive_yourself")}
                  >
                    Drive Yourself
                  </button>
                  <button
                    type="button"
                    className={`${styles.modeBtn} ${driveType === "chauffeur" ? styles.modeBtnActive : ""}`}
                    onClick={() => setDriveType("chauffeur")}
                  >
                    Chauffeur Service
                  </button>
                </div>
              </div>

              {/* Status / Availability Banner */}
              {isChecking ? (
                <div className={styles.checkingBanner}>
                  <Spinner />
                  <span>Checking vehicle availability...</span>
                </div>
              ) : checkError ? (
                <div className={styles.errorBanner}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{checkError}</span>
                </div>
              ) : checkResult?.available ? (
                <div className={styles.availableBanner}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" fill="#16a34a" />
                    <path d="M5 8l2 2 4-4" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Vehicle is available for selected dates ({checkResult.rental_days} days)</span>
                </div>
              ) : null}

              {/* Price Breakdown */}
              {checkResult?.available && (
                <div className={styles.priceBreakdown}>
                  <h4 className={styles.priceHeading}>Estimated Pricing</h4>
                  <div className={styles.priceRow}>
                    <span>Daily Rate</span>
                    <span>{formatCurrency(checkResult.daily_rate)} / day</span>
                  </div>
                  <div className={styles.priceRow}>
                    <span>Subtotal ({checkResult.rental_days || 1} days)</span>
                    <span>{formatCurrency(checkResult.subtotal)}</span>
                  </div>
                  <div className={styles.priceRow}>
                    <span>Taxes & Fees</span>
                    <span>{formatCurrency(checkResult.tax_amount)}</span>
                  </div>
                  <div className={`${styles.priceRow} ${styles.totalRow}`}>
                    <strong>Total Amount</strong>
                    <strong className={styles.totalVal}>{formatCurrency(checkResult.total_amount)}</strong>
                  </div>
                </div>
              )}

              {submitError && (
                <div className={styles.errorBanner}>
                  <span>{submitError}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={styles.footer}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className={styles.submitBtn}
                disabled={isChecking || isSubmitting || !checkResult?.available}
                onClick={handleConfirmRebooking}
              >
                {isSubmitting ? "Creating Rebooking..." : "Confirm Rebooking"}
              </button>
            </div>
          </>
        ) : (
          /* Step 2: Confirmed Success */
          <div className={styles.successView}>
            <div className={styles.successIconWrap}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h2 className={styles.successTitle}>Rebooking Successful!</h2>
            <p className={styles.successDesc}>
              Your reservation has been created with reference:
            </p>

            <div className={styles.refBox}>
              <span className={styles.refCode}>
                {confirmedData?.reference || confirmedData?.id || "BK-REBOOK"}
              </span>
            </div>

            <div className={styles.summaryBox}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Dates</span>
                <strong>{pickupDate} → {dropoffDate}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Total</span>
                <strong>{formatCurrency(confirmedData?.total_amount || checkResult?.total_amount)}</strong>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Mode</span>
                <strong>{driveType === "chauffeur" ? "Chauffeur Service" : "Drive Yourself"}</strong>
              </div>
            </div>

            <div className={styles.successActions}>
              <button
                type="button"
                className={styles.viewTripBtn}
                onClick={() => {
                  onClose();
                  const targetRef = confirmedData?.reference || confirmedData?.id;
                  if (targetRef) {
                    router.push(`/customer/trips/${targetRef}`);
                  } else {
                    router.push("/customer/trips");
                  }
                }}
              >
                View Booking Details
              </button>

              <button
                type="button"
                className={styles.doneBtn}
                onClick={() => {
                  onClose();
                  router.push("/customer/trips");
                }}
              >
                Back to Trips
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
