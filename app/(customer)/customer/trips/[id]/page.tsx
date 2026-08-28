"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { bookingsService, ExpandedTripData } from "@/services/bookings-service";
import Spinner from "@/components/customer/Spinner";
import RateTripModal from "@/components/customer/RateTripModal";
import GetHelpModal from "@/components/customer/GetHelpModal";
import CancelReservationModal from "@/components/customer/CancelReservationModal";
import ExtendRentalDateModal from "@/components/customer/ExtendRentalDateModal";
import ExtensionPriceBreakdownModal from "@/components/customer/ExtensionPriceBreakdownModal";
import PaymentMethodModal from "@/components/customer/PaymentMethodModal";
import ExtensionConfirmedModal from "@/components/customer/ExtensionConfirmedModal";
import styles from "./TripDetailsPage.module.css";

export default function TripDetailsPage() {
  const params = useParams();
  const bookingRef = (params.id as string) || "";

  const [tripData, setTripData] = useState<ExpandedTripData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Extend Rental Flow Steps: 0 (Closed), 1 (Date), 2 (Price Breakdown), 3 (Payment), 4 (Confirmed)
  const [extendStep, setExtendStep] = useState<number>(0);
  const [newReturnDate, setNewReturnDate] = useState<string>("30 Mar 2026");

  useEffect(() => {
    if (!bookingRef) return;
    let isMounted = true;
    setIsLoading(true);

    bookingsService
      .getExpandedTripDetail(bookingRef)
      .then((data) => {
        if (isMounted) {
          setTripData(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load trip detail:", err);
        if (isMounted) {
          setErrorMsg("Failed to load trip details. Showing summary.");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [bookingRef]);

  const vehicleInfo = tripData?.vehicle_info;
  const bookingInfo = tripData?.booking_info;
  const priceInfo = tripData?.price_info;
  const extrasInfo = tripData?.extras_info || [];

  const rawStatus = bookingInfo?.status || "Scheduled";
  const normalizedStatus: "Scheduled" | "Ongoing" | "Completed" =
    rawStatus.toLowerCase().includes("ongoing")
      ? "Ongoing"
      : rawStatus.toLowerCase().includes("complete")
      ? "Completed"
      : "Scheduled";

  const vehicleTitle = vehicleInfo
    ? `${vehicleInfo.brand || ""} ${vehicleInfo.model || ""}`.trim() || bookingInfo?.vehicle || "Vehicle"
    : bookingInfo?.vehicle || "Vehicle Details";

  const formatPrice = (val?: number | string) => {
    if (val === undefined || val === null) return "₦0";
    const num = typeof val === "number" ? val : parseFloat(String(val));
    if (isNaN(num)) return `₦${val}`;
    return `₦${num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <div className={styles.topHeader}>
        <div className={styles.leftTitleRow}>
          <Link href="/customer/trips" className={styles.backBtn} aria-label="Back to Trips">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </Link>
          <h1 className={styles.title}>{vehicleTitle}</h1>
        </div>

        <div className={styles.actionsRight}>
          {normalizedStatus === "Scheduled" && (
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => setIsCancelModalOpen(true)}
            >
              Cancel Reservation
            </button>
          )}

          {normalizedStatus === "Ongoing" && (
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => setExtendStep(1)}
            >
              Extend Rental Period
            </button>
          )}

          {normalizedStatus === "Completed" && (
            <>
              <button type="button" className={styles.rebookBtn}>
                Rebook Vehicle
              </button>
              <button
                type="button"
                className={styles.rateBtn}
                onClick={() => setIsRateModalOpen(true)}
              >
                Rate Your Trip
              </button>
            </>
          )}

          <button
            type="button"
            className={styles.supportBtn}
            onClick={() => setIsHelpModalOpen(true)}
            aria-label="Support"
          >
            <Image
              src="/customer app/icons/message-question.svg"
              alt="Get Help"
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
          <Spinner />
        </div>
      ) : (
        /* Main Detail Card */
        <div className={styles.card}>
          <div className={styles.vehicleHeader}>
            <div>
              <h3 className={styles.vehicleName}>{vehicleTitle}</h3>
              <span className={styles.serviceMode}>
                {bookingInfo?.drive_type || "Drive Yourself"}
              </span>
            </div>
            <span className={styles.arrowIcon}>›</span>
          </div>

          <div className={styles.sectionDivider}>Booking Summary</div>

          <div className={styles.datesRow}>
            <div>
              <span className={styles.label}>Booking Dates</span>
              <div className={styles.datesVal}>{bookingInfo?.date || "Dates N/A"}</div>
            </div>
            <span className={`${styles.statusBadge} ${styles[normalizedStatus.toLowerCase()]}`}>
              {normalizedStatus}
            </span>
          </div>

          <div className={styles.locationGroup}>
            <span className={styles.label}>Pick Up & Drop Off Location</span>
            <div className={styles.locationVal}>Murtala Muhammed International Airport Lagos</div>
          </div>

          <div className={styles.sectionDivider}>Extras</div>
          {extrasInfo.length > 0 ? (
            extrasInfo.map((extra, i) => (
              <div key={i} className={styles.priceRow}>
                <span>{extra.name}</span>
                <strong>{formatPrice(extra.line_total || extra.unit_price)}</strong>
              </div>
            ))
          ) : (
            <div className={styles.priceRow}>
              <span>No Extras</span>
              <strong>₦0</strong>
            </div>
          )}

          <div className={styles.sectionDivider}>Price Breakdown</div>
          <div className={styles.priceRow}>
            <span>Subtotal</span>
            <strong>{formatPrice(priceInfo?.subtotal)}</strong>
          </div>
          <div className={styles.priceRow}>
            <span>Extras</span>
            <strong>{formatPrice(priceInfo?.extras)}</strong>
          </div>
          <div className={styles.priceRow}>
            <span>Taxes</span>
            <strong>{formatPrice(priceInfo?.taxes)}</strong>
          </div>
          <div className={`${styles.priceRow} ${styles.totalRow}`}>
            <span>Total</span>
            <strong>{formatPrice(priceInfo?.total)}</strong>
          </div>

          <div className={styles.cancelPolicyBanner}>
            Free cancellation within 24 hours. After that, a cancellation fee applies.
          </div>
        </div>
      )}

      {/* Modals */}
      <RateTripModal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
      />

      <GetHelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      <CancelReservationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirmCancel={() => {
          setIsCancelModalOpen(false);
          alert("Reservation cancelled.");
        }}
      />

      {/* Extend Rental Flow Modals */}
      <ExtendRentalDateModal
        isOpen={extendStep === 1}
        onClose={() => setExtendStep(0)}
        onContinue={(date) => {
          setNewReturnDate(date);
          setExtendStep(2);
        }}
      />

      <ExtensionPriceBreakdownModal
        isOpen={extendStep === 2}
        onClose={() => setExtendStep(0)}
        onBack={() => setExtendStep(1)}
        onConfirm={() => setExtendStep(3)}
        newReturnDate={newReturnDate}
      />

      <PaymentMethodModal
        isOpen={extendStep === 3}
        onClose={() => setExtendStep(0)}
        onBack={() => setExtendStep(2)}
        onConfirm={() => setExtendStep(4)}
        bookingRef={bookingRef}
      />

      <ExtensionConfirmedModal
        isOpen={extendStep === 4}
        onClose={() => setExtendStep(0)}
        newReturnDate={newReturnDate}
      />
    </div>
  );
}