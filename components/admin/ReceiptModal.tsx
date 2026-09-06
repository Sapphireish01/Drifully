"use client";

import React from "react";
import { BookingReceiptData } from "@/services/bookings-service";
import styles from "./ReceiptModal.module.css";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: BookingReceiptData | null;
  isLoading?: boolean;
}

export default function ReceiptModal({
  isOpen,
  onClose,
  receiptData,
  isLoading = false,
}: ReceiptModalProps) {
  if (!isOpen) return null;

  const formatPrice = (val?: number | string | null) => {
    if (val === undefined || val === null || val === "") return "₦0.00";
    const num = typeof val === "number" ? val : parseFloat(String(val));
    if (isNaN(num)) return `₦${val}`;
    return `₦${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog">
        <div className={styles.header}>
          <h2 className={styles.title}>Official Booking Receipt</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {isLoading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
            Loading receipt details...
          </div>
        ) : !receiptData ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>
            Receipt information could not be retrieved.
          </div>
        ) : (
          <div className={styles.receiptPaper}>
            {/* Header */}
            <div className={styles.brandHeader}>
              <div>
                <div className={styles.brandLogo}>Drifully</div>
                <div className={styles.brandSub}>Car Rental & Chauffeur Services</div>
              </div>
              <div className={styles.receiptMeta}>
                <span className={styles.receiptBadge}>Paid</span>
                <div className={styles.receiptNumber}>
                  {receiptData.booking_id || receiptData.transaction_id || "RECEIPT"}
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Customer Information</div>
              <div className={styles.grid}>
                <div className={styles.gridItem}>
                  <span className={styles.label}>Name</span>
                  <span className={styles.value}>{receiptData.customer_name || "N/A"}</span>
                </div>
                <div className={styles.gridItem}>
                  <span className={styles.label}>Email</span>
                  <span className={styles.value}>{receiptData.customer_email || "N/A"}</span>
                </div>
                <div className={styles.gridItem}>
                  <span className={styles.label}>Phone</span>
                  <span className={styles.value}>{receiptData.customer_phone || "N/A"}</span>
                </div>
                <div className={styles.gridItem}>
                  <span className={styles.label}>Date Created</span>
                  <span className={styles.value}>{formatDate(receiptData.date_created)}</span>
                </div>
              </div>
            </div>

            {/* Booking & Transaction Information */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Transaction Details</div>
              <div className={styles.grid}>
                <div className={styles.gridItem}>
                  <span className={styles.label}>Booking ID</span>
                  <span className={styles.value}>{receiptData.booking_id || "N/A"}</span>
                </div>
                <div className={styles.gridItem}>
                  <span className={styles.label}>Transaction ID</span>
                  <span className={styles.value}>{receiptData.transaction_id || "N/A"}</span>
                </div>
                <div className={styles.gridItem}>
                  <span className={styles.label}>Booking Type</span>
                  <span className={styles.value}>{receiptData.booking_type || "Drive Yourself"}</span>
                </div>
                <div className={styles.gridItem}>
                  <span className={styles.label}>Payment Method</span>
                  <span className={styles.value} style={{ textTransform: "capitalize" }}>
                    {receiptData.payment_method || "Card"}
                  </span>
                </div>
                {receiptData.reference_number && (
                  <div className={styles.gridItem}>
                    <span className={styles.label}>Reference No.</span>
                    <span className={styles.value}>{receiptData.reference_number}</span>
                  </div>
                )}
                <div className={styles.gridItem}>
                  <span className={styles.label}>Paid At</span>
                  <span className={styles.value}>
                    {formatDate(receiptData.paid_at || receiptData.payment_received)}
                  </span>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Payment Summary</div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryRow}>
                  <span>Base Amount</span>
                  <strong>{formatPrice(receiptData.amount)}</strong>
                </div>
                {receiptData.fees !== null && receiptData.fees !== undefined && (
                  <div className={styles.summaryRow}>
                    <span>Fees</span>
                    <strong>{formatPrice(receiptData.fees)}</strong>
                  </div>
                )}
                {receiptData.taxes !== null && receiptData.taxes !== undefined && (
                  <div className={styles.summaryRow}>
                    <span>Taxes</span>
                    <strong>{formatPrice(receiptData.taxes)}</strong>
                  </div>
                )}
                <div className={styles.totalRow}>
                  <span>Total Amount Paid</span>
                  <strong className={styles.totalAmount}>
                    {formatPrice(receiptData.amount_paid ?? receiptData.amount)}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.footerActions}>
          <button type="button" className={styles.btnClose} onClick={onClose}>
            Close
          </button>
          {receiptData && (
            <button type="button" className={styles.btnPrint} onClick={handlePrint}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              Print / Save PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
