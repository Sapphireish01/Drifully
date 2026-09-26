"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { TransactionStatus } from "@/data/admin-payments";
import styles from "./payment-details.module.css";
import { paymentsService } from "@/services/payments-service";
import { bookingsService, BookingReceiptData } from "@/services/bookings-service";
import Spinner from "@/components/admin/Spinner";
import ReceiptModal from "@/components/admin/ReceiptModal";

function formatCurrency(val: any): string {
  if (val == null || val === "" || val === "N/A") return "₦0.00";
  const str = String(val).trim();
  if (str.startsWith("₦") || str.startsWith("$")) return str;
  const num = typeof val === "number" ? val : parseFloat(str.replace(/[^0-9.-]/g, ""));
  if (isNaN(num)) return str;
  return `₦${num.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(val: any): string {
  if (!val || val === "N/A" || val === "--") return "N/A";
  try {
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) + "  " + d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  } catch {}
  return String(val);
}

export default function PaymentDetailsPage({ params }: { params?: any }) {
  const router = useRouter();
  const routeParams = useParams();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const referenceParam = searchParams.get("reference");
  const routeId = (routeParams?.id as string) || (params as any)?.id || "";
  const lookupReference = referenceParam || routeId;

  const [tx, setTx] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [receiptData, setReceiptData] = useState<BookingReceiptData | null>(null);

  const isPayout =
    typeParam === "payout" ||
    Boolean(referenceParam) ||
    lookupReference?.toUpperCase().startsWith("PAYOUT-") ||
    Boolean(tx?.payout_id);

  useEffect(() => {
    if (!lookupReference) return;

    const fetchPayment = async () => {
      try {
        setLoading(true);
        if (typeParam === "payout" || Boolean(referenceParam) || lookupReference.toUpperCase().startsWith("PAYOUT-")) {
          const data = await paymentsService.getPayoutDetails(lookupReference);
          setTx(data);
        } else {
          try {
            const data = await paymentsService.getPaymentDetails(lookupReference);
            setTx(data);
          } catch (err) {
            // Fallback: attempt getPayoutDetails if payment details lookup fails
            const payoutData = await paymentsService.getPayoutDetails(lookupReference);
            setTx(payoutData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch payment details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [lookupReference, typeParam, referenceParam]);

  const handleMarkAsSuccessful = async () => {
    try {
      const targetId = tx?.payout_id || tx?.payment_information?.transaction_id || tx?.id || lookupReference;
      await paymentsService.markAsSuccessful(targetId);
      setTx((prev: any) => ({
        ...prev,
        status: "completed",
        status_display: "Completed",
        payment_details: prev?.payment_details
          ? { ...prev.payment_details, status: "Success" }
          : prev?.payment_details,
      }));
    } catch (error) {
      console.error("Failed to mark as successful:", error);
    }
  };

  const handleOpenReceipt = async () => {
    const bookingRef =
      tx?.payment_information?.booking_id ||
      tx?.bookingId ||
      tx?.booking_id ||
      tx?.booking_reference ||
      tx?.booking ||
      lookupReference;

    setIsReceiptOpen(true);
    setReceiptLoading(true);
    try {
      const data = await bookingsService.getBookingReceipt(bookingRef);
      setReceiptData(data);
    } catch (err) {
      console.error("Failed to load receipt:", err);
      // Fallback to synthesizing receipt data from current transaction details
      if (tx) {
        const rawAmount = tx?.payment_information?.amount ?? tx.amount ?? "0";
        const rawFees = tx?.payment_information?.fees ?? tx.fees;
        const rawTaxes = tx?.payment_information?.taxes ?? tx.taxes;

        setReceiptData({
          customer_name: tx?.customer_info?.name || tx.customerName || tx.customer_name,
          customer_email: tx?.customer_info?.email || tx.customerEmail || tx.customer_email,
          customer_phone: tx?.customer_info?.phone || tx.customerPhone || tx.customer_phone,
          date_created: tx?.customer_info?.date_created || tx.dateCreated || tx.created_at,
          booking_type: tx?.customer_info?.booking_type || tx.bookingType || tx.booking_type,
          transaction_id: tx?.payment_information?.transaction_id || tx.id || tx.transaction_id || lookupReference,
          booking_id: tx?.payment_information?.booking_id || tx.bookingId || tx.booking_id,
          amount: parseFloat(String(rawAmount).replace(/[^0-9.]/g, "")),
          fees: rawFees && rawFees !== "N/A" ? parseFloat(String(rawFees).replace(/[^0-9.]/g, "")) : null,
          taxes: rawTaxes && rawTaxes !== "N/A" ? parseFloat(String(rawTaxes).replace(/[^0-9.]/g, "")) : 0,
          payment_method: tx?.payment_details?.payment_method || tx.paymentMethod || tx.payment_method || "Stripe",
          reference_number: tx?.payment_details?.reference_number || tx.referenceNumber || tx.reference_number,
          paid_at: tx?.payment_timeline?.paid_at || tx.paymentReceived || tx.payment_received || tx.created_at,
          payable_type: "booking",
          amount_paid: parseFloat(String(rawAmount).replace(/[^0-9.]/g, "")),
        });
      }
    } finally {
      setReceiptLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100%', width: '100%', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size={40} />
      </div>
    );
  }

  if (!tx) {
    return <div style={{ padding: "24px" }}>Payment details not found.</div>;
  }

  const rawStatus = String(
    tx.payment_details?.status ||
    tx.status_display ||
    tx.status ||
    tx.transaction_status ||
    "Pending"
  );
  let mappedStatus = "Pending";
  const s = rawStatus.toLowerCase();
  if (s.includes("success") || s === "completed" || s === "paid") mappedStatus = "Completed";
  else if (s === "failed") mappedStatus = "Failed";
  else if (s === "reversed") mappedStatus = "Reversed";
  else if (s === "processing") mappedStatus = "Processing";

  const isPending = mappedStatus === "Pending" || mappedStatus === "Processing";

  // Display values
  const displayId =
    tx.payment_information?.transaction_id ||
    tx.payment_details?.reference_number ||
    tx.payout_id ||
    tx.id ||
    tx.transaction_id ||
    lookupReference;

  const headerDate = formatDate(
    tx.payment_timeline?.created_at ||
    tx.payment_details?.payment_initiated ||
    tx.paymentInitiated ||
    tx.created_at ||
    tx.payment_initiated
  );

  return (
    <div className={styles.page}>
      {/* ─── Action Bar ─── */}
      <div className={styles.actionBar}>
        <button className={styles.backBtn} onClick={() => router.back()} aria-label="Go back">
          <BackIcon />
        </button>
        <div className={styles.actionBtns}>
          {isPending && (
            <button className={styles.btnOutline} onClick={handleMarkAsSuccessful}>
              Mark As Successful
            </button>
          )}
          {!isPayout && (
            <button className={styles.btnFill} onClick={handleOpenReceipt}>
              Download Receipt
            </button>
          )}
        </div>
      </div>

      {/* ─── Header ─── */}
      <div className={styles.pageHeader}>
        <div className={styles.transactionIdRow}>
          <h1 className={styles.transactionId}>{displayId}</h1>
          <button className={styles.copyBtn} aria-label="Copy ID" onClick={() => navigator.clipboard.writeText(displayId)}>
            <CopyIcon />
          </button>
          <StatusBadge status={mappedStatus as TransactionStatus} />
        </div>
        <p className={styles.headerDate}>{headerDate}</p>
      </div>

      {/* ─── Two-Column Layout ─── */}
      <div className={styles.layout}>
        {/* Left: Info Cards */}
        <div className={styles.cardsCol}>
          {/* Customer / Driver Information */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{isPayout ? "Driver Information" : "Customer Information"}</h2>
            <div className={styles.grid3}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Name</span>
                <span className={styles.fieldValue}>
                  {isPayout
                    ? (tx.driver_details?.name || tx.driverName || "N/A")
                    : (tx.customer_info?.name || tx.customerName || tx.customer_name || "N/A")}
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Email</span>
                <span className={styles.fieldValue}>
                  {isPayout
                    ? (tx.driver_details?.email || "N/A")
                    : (tx.customer_info?.email || tx.customerEmail || tx.customer_email || "N/A")}
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Phone</span>
                <span className={styles.fieldValue}>
                  {isPayout
                    ? (tx.driver_details?.phone_number || "N/A")
                    : (tx.customer_info?.phone || tx.customerPhone || tx.customer_phone || "N/A")}
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Date Created</span>
                <span className={styles.fieldValue}>
                  {formatDate(tx.customer_info?.date_created || tx.dateCreated || tx.created_at)}
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{isPayout ? "Trip Status" : "Booking Type"}</span>
                <span className={styles.fieldValue}>
                  {isPayout
                    ? (tx.driver_details?.trip_status?.label || tx.driver_details?.trip_status?.value || "N/A")
                    : (tx.customer_info?.booking_type || tx.bookingType || tx.booking_type || "N/A")}
                </span>
              </div>
            </div>
          </div>

          {/* Payment / Payout Information */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{isPayout ? "Payout Information" : "Payment Information"}</h2>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{isPayout ? "Payout ID" : "Transaction ID"}</span>
                <span className={styles.fieldValue}>
                  {displayId}
                  <button className={styles.inlineCopyBtn} onClick={() => navigator.clipboard.writeText(displayId)} aria-label="Copy">
                    <CopySmIcon />
                  </button>
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{isPayout ? "Booking Reference" : "Booking ID"}</span>
                <span className={styles.fieldValue}>
                  {isPayout
                    ? (tx.booking_reference || "N/A")
                    : (tx.payment_information?.booking_id || tx.bookingId || tx.booking_id || "N/A")}
                  <button
                    className={styles.inlineCopyBtn}
                    onClick={() => navigator.clipboard.writeText(
                      isPayout
                        ? (tx.booking_reference || "")
                        : (tx.payment_information?.booking_id || tx.bookingId || tx.booking_id || "")
                    )}
                    aria-label="Copy"
                  >
                    <CopySmIcon />
                  </button>
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Amount</span>
                <span className={styles.fieldValue}>
                  {isPayout && tx.payment_details?.amount != null
                    ? formatCurrency(tx.payment_details.amount)
                    : formatCurrency(tx.payment_information?.amount ?? tx.amount)}
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>{isPayout ? "Commission Amount" : "Fees"}</span>
                <span className={styles.fieldValue}>
                  {isPayout
                    ? (tx.payment_details?.commission_amount != null
                        ? `${formatCurrency(tx.payment_details.commission_amount)}${tx.payment_details?.commission_rate ? ` (${tx.payment_details.commission_rate}%)` : ""}`
                        : "N/A")
                    : (tx.payment_information?.fees != null
                        ? (tx.payment_information.fees === "N/A" ? "N/A" : formatCurrency(tx.payment_information.fees))
                        : (tx.fees ? formatCurrency(tx.fees) : "N/A"))}
                </span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Taxes</span>
                <span className={styles.fieldValue}>
                  {isPayout
                    ? (tx.payment_details?.taxes != null ? formatCurrency(tx.payment_details.taxes) : "N/A")
                    : (tx.payment_information?.taxes != null
                        ? (tx.payment_information.taxes === "N/A" ? "N/A" : formatCurrency(tx.payment_information.taxes))
                        : (tx.taxes ? formatCurrency(tx.taxes) : "N/A"))}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Details / Bank Details */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{isPayout ? "Bank & Payment Details" : "Payment Details"}</h2>
            <div className={styles.grid2}>
              {isPayout ? (
                <>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Bank Name</span>
                    <span className={styles.fieldValue}>{tx.payment_details?.bank_name || "N/A"}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Account Number</span>
                    <span className={styles.fieldValue}>{tx.payment_details?.account_number || "N/A"}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Payout Initiated</span>
                    <span className={styles.fieldValue}>{formatDate(tx.created_at)}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Transaction Date</span>
                    <span className={styles.fieldValue}>{formatDate(tx.payment_details?.transaction_date)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Payment Method</span>
                    <span className={styles.fieldValue}>{tx.payment_details?.payment_method || tx.paymentMethod || tx.payment_method || "N/A"}</span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Reference Number</span>
                    <span className={styles.fieldValue}>
                      {tx.payment_details?.reference_number || tx.referenceNumber || tx.reference_number || "N/A"}
                      {(tx.payment_details?.reference_number || tx.referenceNumber || tx.reference_number) && (
                        <button
                          className={styles.inlineCopyBtn}
                          onClick={() => navigator.clipboard.writeText(tx.payment_details?.reference_number || tx.referenceNumber || tx.reference_number || "")}
                          aria-label="Copy"
                        >
                          <CopySmIcon />
                        </button>
                      )}
                    </span>
                  </div>
                  {tx.payment_details?.gateway && (
                    <div className={styles.field}>
                      <span className={styles.fieldLabel}>Gateway</span>
                      <span className={styles.fieldValue}>{tx.payment_details.gateway}</span>
                    </div>
                  )}
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Payment Initiated</span>
                    <span className={styles.fieldValue}>
                      {formatDate(tx.payment_details?.payment_initiated || tx.payment_timeline?.created_at || tx.paymentInitiated || tx.payment_initiated || tx.created_at)}
                    </span>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>Payment Received</span>
                    <span className={styles.fieldValue}>
                      {formatDate(tx.payment_timeline?.paid_at || tx.paymentReceived || tx.payment_received)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Status Timeline */}
        <div className={styles.statusCard}>
          <h2 className={styles.statusTitle}>{isPayout ? "Payout Status" : "Payment Status"}</h2>
          <div className={styles.timeline}>
            {/* Step 1: Initiated */}
            <div className={styles.timelineStep}>
              <div className={`${styles.stepIndicator} ${styles.stepIndicatorDone}`}>
                <CheckIcon />
              </div>
              <div className={styles.stepContent}>
                <p className={styles.stepLabel}>{isPayout ? "Payout Initiated" : "Payment Initiated"}</p>
                <p className={styles.stepDate}>
                  {formatDate(
                    tx.payment_timeline?.created_at ||
                    tx.payment_details?.payment_initiated ||
                    tx.created_at ||
                    tx.paymentInitiatedAt ||
                    tx.payment_initiated_at
                  )}
                </p>
              </div>
            </div>

            {/* Step 2: Completed */}
            <div className={styles.timelineStep}>
              <div
                className={`${styles.stepIndicator} ${
                  (tx.payment_timeline?.paid_at ||
                  tx.paymentCompletedAt ||
                  tx.payment_completed_at ||
                  tx.payment_details?.transaction_date ||
                  mappedStatus === "Completed")
                    ? styles.stepIndicatorDone
                    : ""
                }`}
              >
                {(tx.payment_timeline?.paid_at ||
                  tx.paymentCompletedAt ||
                  tx.payment_completed_at ||
                  tx.payment_details?.transaction_date ||
                  mappedStatus === "Completed") && <CheckIcon />}
              </div>
              <div className={styles.stepContent}>
                <p className={styles.stepLabel}>{isPayout ? "Payout Completed" : "Payment Completed"}</p>
                {(tx.payment_timeline?.paid_at ||
                  tx.payment_details?.transaction_date ||
                  tx.paymentCompletedAt ||
                  tx.payment_completed_at ||
                  (mappedStatus === "Completed" && (tx.payment_timeline?.updated_at || tx.updated_at))) && (
                  <p className={styles.stepDate}>
                    {formatDate(
                      tx.payment_timeline?.paid_at ||
                      tx.payment_details?.transaction_date ||
                      tx.paymentCompletedAt ||
                      tx.payment_completed_at ||
                      tx.payment_timeline?.updated_at ||
                      tx.updated_at
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        receiptData={receiptData}
        isLoading={receiptLoading}
      />
    </div>
  );
}

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: TransactionStatus }) {
  const map: Record<TransactionStatus, string> = {
    Pending: styles.badgePending,
    Completed: styles.badgeCompleted,
    Failed: styles.badgeFailed,
    Reversed: styles.badgeReversed,
    Processing: styles.badgeProcessing,
  };
  return (
    <span className={`${styles.badge} ${map[status]}`}>
      <span className={styles.badgeDot} />
      {status}
    </span>
  );
}

/* ─── Inline Icons ─── */
function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}
function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
function CopySmIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
