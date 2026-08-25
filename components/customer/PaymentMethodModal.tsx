"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./PaymentMethodModal.module.css";

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  onConfirm: () => void;
}

export default function PaymentMethodModal({
  isOpen,
  onClose,
  onBack,
  onConfirm,
}: PaymentMethodModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("card");

  if (!isOpen) return null;

  const methods = [
    {
      id: "card",
      label: "Pay with Card",
      icon: (
        <Image
          src="/customer app/icons/card.svg"
          alt="Card"
          width={22}
          height={22}
        />
      ),
    },
    {
      id: "transfer",
      label: "Pay with Bank Transfer",
      icon: (
        <Image
          src="/customer app/icons/bank.svg"
          alt="Bank Transfer"
          width={22}
          height={22}
        />
      ),
    },
    {
      id: "paypal",
      label: "Pay with PayPal",
      icon: (
        <Image
          src="/customer app/icons/paypal.svg"
          alt="PayPal"
          width={22}
          height={22}
        />
      ),
    },
    {
      id: "stripe",
      label: "Pay with Stripe",
      icon: (
        <Image
          src="/customer app/icons/stripe.svg"
          alt="Stripe"
          width={22}
          height={22}
        />
      ),
    },
  ];

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

        <div className={styles.methodsList}>
          {methods.map((method) => (
            <div
              key={method.id}
              className={`${styles.methodCard} ${
                selectedMethod === method.id ? styles.selectedCard : ""
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className={styles.methodLeft}>
                <div className={styles.iconBox}>{method.icon}</div>
                <span className={styles.methodLabel}>{method.label}</span>
              </div>
              <span className={styles.arrowIcon}>›</span>
            </div>
          ))}
        </div>

        <button type="button" className={styles.confirmBtn} onClick={onConfirm}>
          Confirm & Pay
        </button>
      </div>
    </div>
  );
}
