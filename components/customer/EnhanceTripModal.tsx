"use client";

import React, { useEffect, useState } from "react";
import { bookingsService, BookingExtra } from "@/services/bookings-service";
import Spinner from "@/components/customer/Spinner";
import styles from "./EnhanceTripModal.module.css";

interface EnhanceTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  onContinue: (selectedExtraIds?: string[]) => void;
  selectedExtras?: string[];
  onToggleExtra?: (id: string) => void;
}

export default function EnhanceTripModal({
  isOpen,
  onClose,
  onBack,
  onContinue,
  selectedExtras: externalSelectedExtras,
  onToggleExtra,
}: EnhanceTripModalProps) {
  const [internalSelectedExtras, setInternalSelectedExtras] = useState<string[]>([]);
  const [extras, setExtras] = useState<BookingExtra[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const selectedExtras = externalSelectedExtras !== undefined ? externalSelectedExtras : internalSelectedExtras;

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    bookingsService
      .getBookingExtras()
      .then((data) => {
        if (isMounted) {
          setExtras(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
        console.error("Failed to load extras:", err);
        if (isMounted) {
          setError("Failed to load extras. Please try again.");
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
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleExtra = (id: string) => {
    if (onToggleExtra) {
      onToggleExtra(id);
    } else {
      setInternalSelectedExtras((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    }
  };

  const formatPrice = (priceStr: string) => {
    const num = parseFloat(priceStr);
    if (isNaN(num)) return `₦${priceStr}`;
    return `₦${num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
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
            <h2 className={styles.title}>Enhance Your Trip</h2>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="1" y1="1" x2="11" y2="11" />
              <line x1="1" y1="11" x2="11" y2="1" />
            </svg>
          </button>
        </div>

        <p className={styles.description}>
          Add optional extras to make your journey smoother and more comfortable.
        </p>

        {loading ? (
          <div className={styles.centerContainer}>
            <Spinner />
            <p className={styles.loadingText}>Loading extras...</p>
          </div>
        ) : error ? (
          <div className={styles.errorBanner}>
            {error}
          </div>
        ) : (
          <div className={styles.extrasList}>
            {extras.map((item) => {
              const isChecked = selectedExtras.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`${styles.extraItem} ${isChecked ? styles.extraItemSelected : ""}`}
                  onClick={() => toggleExtra(item.id)}
                >
                  <input type="checkbox" checked={isChecked} readOnly />
                  <div className={styles.extraContent}>
                    <div className={styles.extraHeader}>
                      <span className={styles.extraTitle}>{item.name}</span>
                      <span className={styles.extraPrice}>
                        {formatPrice(item.price_per_booking)}
                      </span>
                    </div>
                    {item.description && (
                      <p className={styles.extraSub}>{item.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button
          type="button"
          className={styles.continueBtn}
          onClick={() => onContinue(selectedExtras)}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
