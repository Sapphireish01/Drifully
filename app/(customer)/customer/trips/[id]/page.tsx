"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import RateTripModal from "@/components/customer/RateTripModal";
import GetHelpModal from "@/components/customer/GetHelpModal";
import CancelReservationModal from "@/components/customer/CancelReservationModal";
import ExtendRentalDateModal from "@/components/customer/ExtendRentalDateModal";
import ExtensionPriceBreakdownModal from "@/components/customer/ExtensionPriceBreakdownModal";
import PaymentMethodModal from "@/components/customer/PaymentMethodModal";
import ExtensionConfirmedModal from "@/components/customer/ExtensionConfirmedModal";
import styles from "./TripDetailsPage.module.css";

export default function TripDetailsPage() {
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Extend Rental Flow Steps: 0 (Closed), 1 (Date), 2 (Price Breakdown), 3 (Payment), 4 (Confirmed)
  const [extendStep, setExtendStep] = useState<number>(0);
  const [newReturnDate, setNewReturnDate] = useState<string>("30 Mar 2026");

  const [status, setStatus] = useState<"Scheduled" | "Ongoing" | "Completed">("Ongoing");

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
          <h1 className={styles.title}>Toyota Highlander 2026</h1>
        </div>

        <div className={styles.actionsRight}>
          {status === "Scheduled" && (
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => setIsCancelModalOpen(true)}
            >
              Cancel Reservation
            </button>
          )}

          {status === "Ongoing" && (
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => setExtendStep(1)}
            >
              Extend Rental Period
            </button>
          )}

          {status === "Completed" && (
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

      {/* Main Detail Card */}
      <div className={styles.card}>
        <div className={styles.vehicleHeader}>
          <div>
            <h3 className={styles.vehicleName}>Toyota Corolla 2026</h3>
            <span className={styles.serviceMode}>Drive Yourself</span>
          </div>
          <span className={styles.arrowIcon}>›</span>
        </div>

        <div className={styles.sectionDivider}>Booking Summary</div>

        <div className={styles.datesRow}>
          <div>
            <span className={styles.label}>Booking Dates</span>
            <div className={styles.datesVal}>30 Mar 2025 – 11 May 2025</div>
          </div>
          <span className={`${styles.statusBadge} ${styles[status.toLowerCase()]}`}>
            {status}
          </span>
        </div>

        <div className={styles.locationGroup}>
          <span className={styles.label}>Pick Up & Drop Off Location</span>
          <div className={styles.locationVal}>Murtala Muhammed Airport</div>
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
        <div className={`${styles.priceRow} ${styles.totalRow}`}>
          <span>Total</span>
          <strong>N150,000.</strong>
        </div>

        <div className={styles.cancelPolicyBanner}>
          Free cancellation within 24 hours. After that, a cancellation fee applies.
        </div>
      </div>

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
      />

      <ExtensionConfirmedModal
        isOpen={extendStep === 4}
        onClose={() => setExtendStep(0)}
        newReturnDate={newReturnDate}
      />
    </div>
  );
}