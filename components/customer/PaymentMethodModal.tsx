"use client";

import React, { useState } from "react";
import Image from "next/image";
import { paymentsService } from "@/services/payments-service";
import { bookingsService } from "@/services/bookings-service";
import { toastError } from "@/lib/error-handler";
import Spinner from "@/components/customer/Spinner";
import styles from "./PaymentMethodModal.module.css";

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  onConfirm: (result?: any) => void;
  bookingRef?: string;
  isExtension?: boolean;
  additionalAmount?: string | number;
  newDropoffDate?: string;
}

export default function PaymentMethodModal({
  isOpen,
  onClose,
  onBack,
  onConfirm,
  bookingRef,
  isExtension = false,
  additionalAmount,
  newDropoffDate,
}: PaymentMethodModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("paystack");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const methods = [
    {
      id: "paystack",
      label: "Pay with Paystack",
      disabled: false,
      icon: (
        <Image
          src="/customer app/icons/paypal.svg"
          alt="Paystack"
          width={22}
          height={22}
        />
      ),
    },
    {
      id: "stripe",
      label: "Pay with Stripe",
      disabled: false,
      icon: (
        <Image
          src="/customer app/icons/stripe.svg"
          alt="Stripe"
          width={22}
          height={22}
        />
      ),
    },
    // {
    //   id: "card",
    //   label: "Direct Card Payment",
    //   disabled: false,
    //   icon: (
    //     <Image
    //       src="/customer app/icons/card.svg"
    //       alt="Card"
    //       width={22}
    //       height={22}
    //     />
    //   ),
    // },
  ];

  const handlePayClick = async () => {
    if (!bookingRef) {
      onConfirm();
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      if (isExtension) {
        // Handling Booking Extension Payment
        if (selectedMethod === "paystack" && additionalAmount && newDropoffDate) {
          const res = await paymentsService.initiatePaystackExtension(
            bookingRef,
            additionalAmount,
            newDropoffDate
          );
          const redirectUrl = res?.data?.authorization_url || res?.authorization_url || res?.data?.url;
          if (redirectUrl) {
            window.location.href = redirectUrl;
            return;
          }
        } else if (selectedMethod === "stripe" && additionalAmount && newDropoffDate) {
          const res = await paymentsService.initiateStripeExtension(
            bookingRef,
            additionalAmount,
            newDropoffDate
          );
          const redirectUrl = res?.url || res?.data?.url;
          if (redirectUrl) {
            window.location.href = redirectUrl;
            return;
          }
        } else {
          // Direct Confirmation endpoint
          const res = await bookingsService.confirmBookingExtension(bookingRef, {
            new_dropoff_date: newDropoffDate || "",
            payment_method: selectedMethod,
          });
          onConfirm(res);
          return;
        }
      } else {
        // Standard Booking Payment
        if (selectedMethod === "paystack") {
          const res = await paymentsService.initiatePaystackPayment(bookingRef);
          const redirectUrl = res?.data?.authorization_url || res?.authorization_url || res?.data?.url;
          if (redirectUrl) {
            window.location.href = redirectUrl;
            return;
          }
        } else if (selectedMethod === "stripe") {
          const res = await paymentsService.initiateStripePayment(bookingRef);
          const redirectUrl = res?.url || res?.data?.url;
          if (redirectUrl) {
            window.location.href = redirectUrl;
            return;
          }
        }
      }

      onConfirm();
    } catch (err: any) {
      console.error("Payment initiation failed:", err);
      const msg = err?.response?.data?.detail || err?.response?.data?.message || err?.message || "Payment initiation failed.";
      toastError(err, msg);
      setErrorMsg(msg);
    } finally {
      setIsProcessing(false);
    }
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
            <h2 className={styles.title}>
              {isExtension ? "Pay for Extension" : "Choose a Payment Method"}
            </h2>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {errorMsg && <div className={styles.errorText}>{errorMsg}</div>}

        <div className={styles.methodsList}>
          {methods.map((method) => {
            const isSelected = selectedMethod === method.id;
            const isDisabled = method.disabled;

            return (
              <div
                key={method.id}
                className={`${styles.methodCard} ${isSelected ? styles.selectedCard : ""} ${isDisabled ? styles.disabledCard : ""}`}
                onClick={() => {
                  if (!isDisabled) setSelectedMethod(method.id);
                }}
              >
                <div className={styles.methodLeft}>
                  <div className={styles.iconBox}>{method.icon}</div>
                  <span className={styles.methodLabel}>
                    {method.label} {isDisabled && <small className={styles.comingSoon}>(Disabled)</small>}
                  </span>
                </div>
                <span className={styles.arrowIcon}>›</span>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className={styles.confirmBtn}
          onClick={handlePayClick}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Confirm & Pay"}
        </button>
      </div>
    </div>
  );
}
