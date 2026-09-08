"use client";

import React, { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { bookingsService, ExpandedTripData, BookingSummaryData } from "@/services/bookings-service";
import Spinner from "@/components/customer/Spinner";
import styles from "./BookingConfirmed.module.css";

function BookingConfirmedContent() {
  const searchParams = useSearchParams();
  const bookingRef =
    searchParams.get("booking_ref") ||
    searchParams.get("booking_reference") ||
    searchParams.get("reference") ||
    searchParams.get("id") ||
    "";

  const [tripData, setTripData] = useState<ExpandedTripData | null>(null);
  const [summaryData, setSummaryData] = useState<BookingSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(bookingRef));
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!bookingRef) return;

    let isMounted = true;
    setIsLoading(true);

    // Attempt to fetch detailed trip information first
    bookingsService
      .getExpandedTripDetail(bookingRef)
      .then((data) => {
        if (isMounted && data) {
          setTripData(data);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch expanded trip, trying booking summary:", err);
        // Fallback to summary
        return bookingsService
          .getBookingSummary(bookingRef)
          .then((summary) => {
            if (isMounted && summary) {
              setSummaryData(summary);
            }
          })
          .catch((summaryErr) => {
            console.error("Failed to fetch booking details:", summaryErr);
          });
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [bookingRef]);

  const handleCopyRef = () => {
    if (!bookingRef) return;
    navigator.clipboard.writeText(bookingRef);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const vehicleInfo = tripData?.vehicle_info;
  const bookingInfo = tripData?.booking_info;
  const priceInfo = tripData?.price_info;

  const vehicleName =
    (vehicleInfo?.brand && vehicleInfo?.model
      ? `${vehicleInfo.brand} ${vehicleInfo.model}`.trim()
      : bookingInfo?.vehicle) ||
    (typeof summaryData?.vehicle === "object" && summaryData?.vehicle?.model
      ? `${summaryData.vehicle.brand || ""} ${summaryData.vehicle.model}`.trim()
      : "") ||
    "Drifully Luxury Vehicle";

  const vehicleImage =
    vehicleInfo?.images?.[0]?.image || "/images/hero-img.png";

  const rawDriveType =
    bookingInfo?.drive_type || summaryData?.drive_type || summaryData?.booking_info?.drive_type || "";
  const isChauffeur = rawDriveType.toLowerCase().includes("chauffeur");
  const driveModeLabel = isChauffeur ? "Chauffeur Service" : "Drive Yourself";

  const dateSchedule =
    bookingInfo?.date ||
    (summaryData?.pickup_date && summaryData?.dropoff_date
      ? `${summaryData.pickup_date} → ${summaryData.dropoff_date}`
      : "Selected Dates Scheduled");

  const formattedTotal =
    priceInfo?.total !== undefined
      ? `₦${Number(priceInfo.total).toLocaleString("en-US")}`
      : summaryData?.total_amount !== undefined
        ? `₦${Number(summaryData.total_amount).toLocaleString("en-US")}`
        : "Confirmed";

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <Spinner size={36} />
        <p>Loading your booking confirmation...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.checkCircle}>
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className={styles.title}>Booking Confirmed!</h1>
        <p className={styles.subtitle}>
          Your payment was successful and your reservation has been confirmed. You will receive an email confirmation shortly.
        </p>

        {bookingRef && (
          <div className={styles.refBadgeWrapper}>
            <span className={styles.refLabel}>Booking Reference:</span>
            <span className={styles.refCode}>{bookingRef}</span>
            <button
              type="button"
              className={styles.copyBtn}
              onClick={handleCopyRef}
              title="Copy Reference"
              aria-label="Copy reference"
            >
              {copied ? (
                <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600 }}>Copied!</span>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
          </div>
        )}

        <div className={styles.summaryCard}>
          <div className={styles.vehicleRow}>
            <div className={styles.vehicleInfo}>
              <span className={styles.modeBadge}>{driveModeLabel}</span>
              <div className={styles.vehicleTitle}>{vehicleName}</div>
            </div>
            <div className={styles.vehicleThumb}>
              <Image
                src={vehicleImage}
                alt={vehicleName}
                fill
                style={{ objectFit: "cover" }}
                sizes="70px"
              />
            </div>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.label}>Rental Schedule</span>
              <span className={styles.val}>{dateSchedule}</span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.label}>Payment Status</span>
              <span className={`${styles.val} ${styles.statusPaid}`}>Paid & Confirmed</span>
            </div>

            <div className={styles.detailItemFull}>
              <span className={styles.label}>Pickup & Dropoff Location</span>
              <span className={styles.val}>Murtala Muhammed Airport, Lagos</span>
            </div>
          </div>
        </div>

        <div className={styles.btnRow}>
          <Link href="/customer" className={styles.homeBtn}>
            Back to Home
          </Link>
          <Link
            href={bookingRef ? `/customer/trips/${bookingRef}` : "/customer/trips"}
            className={styles.viewTripBtn}
          >
            View Trip Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BookingConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.loadingWrapper}>
          <Spinner size={36} />
          <p>Loading booking confirmation...</p>
        </div>
      }
    >
      <BookingConfirmedContent />
    </Suspense>
  );
}
