"use client";

import React, { useEffect, useState } from "react";
import { bookingsService, BookingExtensionQuote } from "@/services/bookings-service";
import Spinner from "@/components/customer/Spinner";
import styles from "./ExtensionPriceBreakdownModal.module.css";

interface ExtensionPriceBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  onConfirm: (quote: BookingExtensionQuote) => void;
  bookingRef: string;
  newReturnDate: string;
}

export default function ExtensionPriceBreakdownModal({
  isOpen,
  onClose,
  onBack,
  onConfirm,
  bookingRef,
  newReturnDate,
}: ExtensionPriceBreakdownModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [quote, setQuote] = useState<BookingExtensionQuote | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !bookingRef || !newReturnDate) return;

    let isMounted = true;
    setIsLoading(true);
    setErrorMsg(null);

    // Format newReturnDate to YYYY-MM-DD if needed
    let formattedDate = newReturnDate;
    const parsed = new Date(newReturnDate);
    if (!isNaN(parsed.getTime()) && !/^\d{4}-\d{2}-\d{2}$/.test(newReturnDate)) {
      formattedDate = parsed.toISOString().split("T")[0];
    }

    bookingsService
      .initiateBookingExtension(bookingRef, formattedDate)
      .then((data) => {
        if (!isMounted) return;
        setQuote(data);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        console.error("Failed to fetch extension breakdown:", err);
        const backendMessage =
          err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Failed to calculate extension pricing. Only confirmed or active bookings can be extended.";
        setErrorMsg(backendMessage);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, bookingRef, newReturnDate]);

  if (!isOpen) return null;

  const formatPrice = (val?: number | string) => {
    if (val === undefined || val === null) return "₦0";
    const num = typeof val === "number" ? val : parseFloat(String(val));
    if (isNaN(num)) return `₦${val}`;
    return `₦${num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
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
            <h2 className={styles.title}>Extension Price Breakdown</h2>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <p className={styles.subtitle}>A detailed summary of your booking extension charges.</p>

        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
            <Spinner />
          </div>
        ) : errorMsg ? (
          <div style={{ padding: "20px 0", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "12px 16px", color: "#991b1b", fontSize: "13px" }}>
              {errorMsg}
            </div>
            {onBack && (
              <button
                type="button"
                className={styles.confirmBtn}
                style={{ background: "#475569" }}
                onClick={onBack}
              >
                Choose Another Date
              </button>
            )}
          </div>
        ) : (
          <>
            <div className={styles.summaryCard}>
              <div className={styles.priceRow}>
                <span>Current Drop-off Date</span>
                <strong>{quote?.previous_dropoff_date || "—"}</strong>
              </div>
              <div className={styles.priceRow}>
                <span>New Drop-off Date</span>
                <strong>{quote?.new_dropoff_date || newReturnDate}</strong>
              </div>
              <div className={styles.priceRow}>
                <span>Additional Duration</span>
                <strong>{quote?.additional_days || 1} day(s)</strong>
              </div>
              <div className={styles.priceRow}>
                <span>Daily Rate</span>
                <strong>{formatPrice(quote?.daily_rate)} / day</strong>
              </div>
              <div className={styles.priceRow}>
                <span>Taxes</span>
                <strong>{formatPrice(quote?.tax_amount)}</strong>
              </div>
              <div className={`${styles.priceRow} ${styles.totalRow}`}>
                <span>Total Additional Amount</span>
                <strong>{formatPrice(quote?.additional_amount)}</strong>
              </div>
            </div>

            <button
              type="button"
              className={styles.confirmBtn}
              onClick={() => {
                if (quote) onConfirm(quote);
              }}
            >
              Confirm Extension & Pay
            </button>
          </>
        )}
      </div>
    </div>
  );
}
