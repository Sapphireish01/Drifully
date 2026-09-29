"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { bookingsService, BookingSummaryData } from "@/services/bookings-service";
import Spinner from "@/components/customer/Spinner";
import styles from "./ReviewBookingModal.module.css";
import { Vehicle } from "@/data/vehicles";

interface ReviewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  onConfirm: () => void;
  onEditDates?: () => void;
  vehicle: Vehicle;
  pickupDate: string;
  dropOffDate: string;
  selectedMode: "self" | "chauffeur";
  bookingRef?: string;
}

export default function ReviewBookingModal({
  isOpen,
  onClose,
  onBack,
  onConfirm,
  onEditDates,
  vehicle,
  pickupDate,
  dropOffDate,
  selectedMode,
  bookingRef,
}: ReviewBookingModalProps) {
  const [summaryData, setSummaryData] = useState<BookingSummaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !bookingRef) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    bookingsService
      .getBookingSummary(bookingRef)
      .then((data) => {
        if (isMounted) {
          setSummaryData(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load booking summary:", err);
        if (isMounted) {
          setError("Failed to load summary details.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, bookingRef]);

  if (!isOpen) return null;

  const formatPriceVal = (val?: number | string) => {
    if (val === undefined || val === null) return "₦0";
    const num = typeof val === "number" ? val : parseFloat(String(val));
    if (isNaN(num)) return `₦${val}`;
    return `₦${num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const userDatesDisplay = pickupDate && dropOffDate
    ? `${formatDateDisplay(pickupDate)} – ${formatDateDisplay(dropOffDate)}`
    : pickupDate
    ? formatDateDisplay(pickupDate)
    : "";

  const displayDates = userDatesDisplay || summaryData?.booking_info?.date || "30 Mar 2026 – 11 May 2026";

  const bookingInfo = summaryData?.booking_info;
  const priceInfo = summaryData?.price_info;
  const extrasInfo = summaryData?.extras_info || [];

  const subtotalVal = priceInfo?.subtotal ?? summaryData?.subtotal;
  const extrasVal = priceInfo?.extras ?? summaryData?.extras_total;
  const taxVal = priceInfo?.taxes ?? summaryData?.tax_amount;
  const totalVal = priceInfo?.total ?? summaryData?.total_amount;

  const rawExtrasList = (extrasInfo && extrasInfo.length > 0)
    ? extrasInfo
    : (summaryData?.booking_extras || []);

  const extrasList = rawExtrasList.map((item) => ({
    name: item.name || item.extra?.name || "Extra Item",
    price: item.line_total || item.unit_price_snapshot || item.unit_price || item.extra?.price_per_booking || "0"
  }));

  const vehicleName = bookingInfo?.vehicle || (typeof summaryData?.vehicle === "object" && summaryData?.vehicle?.model ? `${summaryData.vehicle.model}` : vehicle.name);
  const driveType = bookingInfo?.drive_type || (summaryData?.drive_type === "self_drive" || selectedMode === "self" ? "Drive Yourself" : "Chauffeur Service");

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

        {loading ? (
          <div className={styles.nonSelectedText}>
            <Spinner />
            <p style={{ marginTop: 8 }}>Loading summary...</p>
          </div>
        ) : (
          <>
            <div className={styles.vehicleHeader}>
              <div>
                <h3 className={styles.vehicleName}>{vehicleName}</h3>
                <span className={styles.serviceMode}>{driveType}</span>
              </div>
              <span className={styles.arrowIcon}>›</span>
            </div>

            <div className={styles.sectionDivider}>Booking Summary</div>

            <div className={styles.datesRow}>
              <div>
                <span className={styles.label}>Booking Dates</span>
                <div className={styles.datesVal}>{displayDates}</div>
              </div>
              {onEditDates && (
                <button type="button" className={styles.editBtn} onClick={onEditDates}>
                  <span>Edit</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              )}
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
            {extrasList.length > 0 ? (
              extrasList.map((item, idx) => (
                <div key={idx} className={styles.priceRow}>
                  <span>{item.name}</span>
                  <strong>{formatPriceVal(item.price)}</strong>
                </div>
              ))
            ) : (
              <div className={styles.nonSelectedText}>No extras selected</div>
            )}

            <div className={styles.sectionDivider}>Price Breakdown</div>

            <div className={styles.priceRow}>
              <span>Subtotal</span>
              <strong>{formatPriceVal(subtotalVal)}</strong>
            </div>
            <div className={styles.priceRow}>
              <span>Extras</span>
              <strong>{formatPriceVal(extrasVal)}</strong>
            </div>
            <div className={styles.priceRow}>
              <span>Taxes</span>
              <strong>{formatPriceVal(taxVal)}</strong>
            </div>
            <div className={`${styles.priceRow} ${styles.totalRow}`}>
              <span>Total</span>
              <strong>{formatPriceVal(totalVal)}</strong>
            </div>
          </>
        )}

        <button type="button" className={styles.confirmBtn} onClick={onConfirm}>
          Confirm & Pay
        </button>
      </div>
    </div>
  );
}
