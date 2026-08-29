"use client";

import React, { useState } from "react";
import Image from "next/image";
import { paymentsService } from "@/services/payments-service";
import Spinner from "@/components/customer/Spinner";
import styles from "./PaymentMethodModal.module.css";

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  onConfirm: () => void;
  bookingRef?: string;
}

export default function PaymentMethodModal({
  isOpen,
  onClose,
  onBack,
  onConfirm,
  bookingRef,
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
    //   label: "Pay with Card",
    //   disabled: true,
    //   icon: (
    //     <Image
    //       src="/customer app/icons/card.svg"
    //       alt="Card"
    //       width={22}
    //       height={22}
    //     />
    //   ),
    // },
    // {
    //   id: "transfer",
    //   label: "Pay with Bank Transfer",
    //   disabled: true,
    //   icon: (
    //     <Image
    //       src="/customer app/icons/bank.svg"
    //       alt="Bank Transfer"
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
      onConfirm();
    } catch (err: any) {
      console.error("Payment initiation failed:", err);
      setErrorMsg("Failed to initiate payment checkout. Please try again.");
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
            <h2 className={styles.title}>Choose a Payment Method</h2>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="1" y1="11" x2="11" y2="1" />
            </svg>
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
          {isProcessing ? "Redirecting to Payment..." : "Confirm & Pay"}
        </button>
      </div>
    </div>
  );
}
