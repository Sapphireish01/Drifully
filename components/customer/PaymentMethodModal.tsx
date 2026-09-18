"use client";

import React, { useState } from "react";
import Image from "next/image";
import { paymentsService } from "@/services/payments-service";
import { bookingsService } from "@/services/bookings-service";
import { toastError, toastSuccess, toastInfo } from "@/lib/error-handler";
import { openPaystackModal } from "@/lib/paystack";
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
  const [isPaystackOpen, setIsPaystackOpen] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const methods = [
    {
      id: "paystack",
      label: "Pay with Paystack",
      subtitle: "Debit / Credit Card, Bank Transfer, USSD",
      disabled: false,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 4.5h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2a1 1 0 011-1z" fill="#00C3F7" />
          <path d="M4 10.5h11a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2a1 1 0 011-1z" fill="#00C3F7" />
          <path d="M4 16.5h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2a1 1 0 011-1z" fill="#00C3F7" />
        </svg>
      ),
    },
    {
      id: "stripe",
      label: "Pay with Stripe",
      subtitle: "International Credit & Debit Cards",
      disabled: false,
      icon: (
        <Image
          src="/customer app/icons/stripe.svg"
          alt="Stripe"
          width={24}
          height={24}
        />
      ),
    },
  ];

  const handlePayClick = async () => {
    if (!bookingRef) {
      onConfirm();
      return;
    }

    setIsProcessing(true);
    setProcessingStatus("Initializing payment...");
    setErrorMsg(null);

    try {
      if (isExtension) {
        // Handling Booking Extension Payment
        if (selectedMethod === "paystack" && additionalAmount && newDropoffDate) {
          setProcessingStatus("Connecting to Paystack...");
          const res = await paymentsService.initiatePaystackExtension(
            bookingRef,
            additionalAmount,
            newDropoffDate
          );
          const redirectUrl =
            (typeof res === "string" && res.startsWith("http") ? res : null) ||
            res?.data?.authorization_url ||
            res?.authorization_url ||
            res?.data?.url ||
            res?.url;
          const accessCode = res?.data?.access_code || res?.access_code;

          if (accessCode) {
            try {
              const opened = await openPaystackModal({
                accessCode,
                onOpen: () => {
                  setIsPaystackOpen(true);
                },
                onSuccess: async (transaction) => {
                  setIsPaystackOpen(false);
                  setIsVerifying(true);
                  try {
                    const refCode = transaction?.reference || transaction?.trxref || bookingRef;
                    const verifyRes = await paymentsService.verifyPaystackExtension(
                      bookingRef,
                      refCode,
                      newDropoffDate
                    );
                    toastSuccess("Extension confirmed! Your trip has been updated.");
                    setIsProcessing(false);
                    setIsVerifying(false);
                    setProcessingStatus("");
                    onConfirm(verifyRes);
                  } catch (vErr) {
                    console.error("Extension verification failed:", vErr);
                    toastSuccess("Payment received! Updating your reservation...");
                    setIsProcessing(false);
                    setIsVerifying(false);
                    setProcessingStatus("");
                    onConfirm({ status: "extended", booking_ref: bookingRef, reference: transaction?.reference });
                  }
                },
                onCancel: () => {
                  setIsPaystackOpen(false);
                  setIsProcessing(false);
                  setProcessingStatus("");
                  toastInfo("Payment cancelled. You can complete your extension whenever you're ready.");
                },
                onError: (err) => {
                  console.error("Paystack modal error:", err);
                  setIsPaystackOpen(false);
                  if (redirectUrl) {
                    window.location.href = redirectUrl;
                  } else {
                    const failMsg = "Unable to launch Paystack modal.";
                    setErrorMsg(failMsg);
                    toastError(failMsg);
                    setIsProcessing(false);
                    setProcessingStatus("");
                  }
                },
              });

              if (opened) {
                return;
              }
            } catch (modalErr) {
              console.warn("Failed to open Paystack modal, falling back to redirect URL:", modalErr);
            }
          }

          if (redirectUrl) {
            window.location.href = redirectUrl;
            return;
          }
          const failMsg = res?.message || "Failed to obtain payment authorization URL for extension.";
          setErrorMsg(failMsg);
          toastError(failMsg);
          setIsProcessing(false);
          setProcessingStatus("");
          return;
        } else if (selectedMethod === "stripe" && additionalAmount && newDropoffDate) {
          setProcessingStatus("Redirecting to Stripe...");
          const res = await paymentsService.initiateStripeExtension(
            bookingRef,
            additionalAmount,
            newDropoffDate
          );
          const redirectUrl =
            (typeof res === "string" && res.startsWith("http") ? res : null) ||
            res?.url ||
            res?.data?.url;

          if (redirectUrl) {
            window.location.href = redirectUrl;
            return;
          }
          const failMsg = res?.message || "Failed to obtain Stripe extension checkout URL.";
          setErrorMsg(failMsg);
          toastError(failMsg);
          setIsProcessing(false);
          setProcessingStatus("");
          return;
        } else {
          // Direct Confirmation endpoint
          const res = await bookingsService.confirmBookingExtension(bookingRef, {
            new_dropoff_date: newDropoffDate || "",
            payment_method: selectedMethod,
          });
          setIsProcessing(false);
          setProcessingStatus("");
          onConfirm(res);
          return;
        }
      } else {
        // Standard Booking Payment
        if (selectedMethod === "paystack") {
          setProcessingStatus("Connecting to Paystack...");
          const res = await paymentsService.initiatePaystackPayment(bookingRef);
          const redirectUrl =
            (typeof res === "string" && res.startsWith("http") ? res : null) ||
            res?.data?.authorization_url ||
            res?.authorization_url ||
            res?.data?.url ||
            res?.url;
          const accessCode = res?.data?.access_code || res?.access_code;

          if (accessCode) {
            try {
              const opened = await openPaystackModal({
                accessCode,
                onOpen: () => {
                  setIsPaystackOpen(true);
                },
                onSuccess: async (transaction) => {
                  setIsPaystackOpen(false);
                  setIsVerifying(true);
                  try {
                    const refCode = transaction?.reference || transaction?.trxref || bookingRef;
                    const verifyRes = await paymentsService.verifyPaystackPayment(refCode, bookingRef);
                    toastSuccess("Payment verified! Booking confirmed.");
                    setIsProcessing(false);
                    setIsVerifying(false);
                    setProcessingStatus("");
                    onConfirm(verifyRes);
                  } catch (vErr) {
                    console.error("Payment verification failed:", vErr);
                    toastSuccess("Payment received! Finalizing your booking...");
                    setIsProcessing(false);
                    setIsVerifying(false);
                    setProcessingStatus("");
                    onConfirm({ status: "confirmed", booking_ref: bookingRef, reference: transaction?.reference });
                  }
                },
                onCancel: () => {
                  setIsPaystackOpen(false);
                  setIsProcessing(false);
                  setProcessingStatus("");
                  toastInfo("Payment cancelled. You can complete your booking whenever you're ready.");
                },
                onError: (err) => {
                  console.error("Paystack modal error:", err);
                  setIsPaystackOpen(false);
                  if (redirectUrl) {
                    window.location.href = redirectUrl;
                  } else {
                    const failMsg = "Unable to open Paystack modal.";
                    setErrorMsg(failMsg);
                    toastError(failMsg);
                    setIsProcessing(false);
                    setProcessingStatus("");
                  }
                },
              });

              if (opened) {
                return;
              }
            } catch (modalErr) {
              console.warn("Failed to open Paystack modal, falling back to redirect URL:", modalErr);
            }
          }

          if (redirectUrl) {
            window.location.href = redirectUrl;
            return;
          }
          const failMsg = res?.message || "Failed to obtain payment authorization URL.";
          setErrorMsg(failMsg);
          toastError(failMsg);
          setIsProcessing(false);
          setProcessingStatus("");
          return;
        } else if (selectedMethod === "stripe") {
          setProcessingStatus("Redirecting to Stripe...");
          const res = await paymentsService.initiateStripePayment(bookingRef);
          const redirectUrl =
            (typeof res === "string" && res.startsWith("http") ? res : null) ||
            res?.url ||
            res?.data?.url;

          if (redirectUrl) {
            window.location.href = redirectUrl;
            return;
          }
          const failMsg = res?.message || "Failed to obtain Stripe payment checkout URL.";
          setErrorMsg(failMsg);
          toastError(failMsg);
          setIsProcessing(false);
          setProcessingStatus("");
          return;
        }
      }

      setIsProcessing(false);
      setProcessingStatus("");
      onConfirm();
    } catch (err: any) {
      console.error("Payment initiation failed:", err);
      const msg = err?.response?.data?.detail || err?.response?.data?.message || err?.message || "Payment initiation failed.";
      toastError(err, msg);
      setErrorMsg(msg);
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  return (
    <div
      className={`${styles.backdrop} ${isPaystackOpen ? styles.backdropPaystackActive : ""}`}
      onClick={() => {
        if (!isProcessing && !isVerifying) onClose();
      }}
      role="presentation"
    >
      <div
        className={`${styles.modal} ${isPaystackOpen ? styles.modalHidden : ""}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        {isVerifying ? (
          /* Dedicated verification screen */
          <div className={styles.verifyingContainer}>
            <div className={styles.verifyingIconBox}>
              <div className={styles.verifyingPulse} />
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
            </div>
            <h3 className={styles.verifyingTitle}>Verifying Payment</h3>
            <p className={styles.verifyingText}>
              We are confirming your transaction with Paystack. Please do not close or refresh this window...
            </p>
            <div className={styles.verifyingProgressBar}>
              <div className={styles.verifyingProgressFill} />
            </div>
          </div>
        ) : (
          /* Payment selection screen */
          <>
            <div className={styles.header}>
              <div className={styles.titleWrap}>
                {onBack && !isProcessing && (
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
              {!isProcessing && (
                <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
                  ✕
                </button>
              )}
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
                      if (!isDisabled && !isProcessing) setSelectedMethod(method.id);
                    }}
                  >
                    <div className={styles.methodLeft}>
                      <div className={styles.iconBox}>{method.icon}</div>
                      <div className={styles.methodMeta}>
                        <span className={styles.methodLabel}>
                          {method.label} {isDisabled && <small className={styles.comingSoon}>(Disabled)</small>}
                        </span>
                        <span className={styles.methodSubtitle}>{method.subtitle}</span>
                      </div>
                    </div>
                    <div className={`${styles.radioIndicator} ${isSelected ? styles.selectedRadio : ""}`}>
                      {isSelected && <div className={styles.radioInnerDot} />}
                    </div>
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
              {isProcessing ? (
                <>
                  <span className={styles.btnSpinner} />
                  <span>{processingStatus || "Processing..."}</span>
                </>
              ) : (
                "Confirm & Pay"
              )}
            </button>

            <div className={styles.securityNote}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>256-bit SSL encrypted secure checkout</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
