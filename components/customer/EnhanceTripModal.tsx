"use client";

import React, { useEffect, useState, useMemo } from "react";
import { bookingsService, BookingExtraItem, AddExtraPayloadItem } from "@/services/bookings-service";
import Spinner from "@/components/customer/Spinner";
import styles from "./EnhanceTripModal.module.css";

interface EnhanceTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  onContinue: (extrasPayload: AddExtraPayloadItem[], extraIds: string[]) => void;
  selectedExtras?: string[];
  initialQuantities?: Record<string, number>;
}

export default function EnhanceTripModal({
  isOpen,
  onClose,
  onBack,
  onContinue,
  selectedExtras: externalSelectedExtras,
  initialQuantities = {},
}: EnhanceTripModalProps) {
  const [quantifiedExtras, setQuantifiedExtras] = useState<BookingExtraItem[]>([]);
  const [unquantifiedExtras, setUnquantifiedExtras] = useState<BookingExtraItem[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>(initialQuantities);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    bookingsService
      .getBookingExtras()
      .then((data) => {
        if (isMounted) {
          const qExtras = Array.isArray(data?.quantified_extras) ? data.quantified_extras : [];
          const uExtras = Array.isArray(data?.unquantified_extras) ? data.unquantified_extras : [];
          setQuantifiedExtras(qExtras);
          setUnquantifiedExtras(uExtras);

          // If external selected IDs are passed initially, ensure they are marked with quantity >= 1
          if (externalSelectedExtras && externalSelectedExtras.length > 0) {
            setQuantities((prev) => {
              const updated = { ...prev };
              externalSelectedExtras.forEach((id) => {
                if (!updated[id]) updated[id] = 1;
              });
              return updated;
            });
          }
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
  }, [isOpen, externalSelectedExtras]);

  // Calculate total price of all selected extras
  const allExtrasMap = useMemo(() => {
    const map = new Map<string, BookingExtraItem>();
    quantifiedExtras.forEach((item) => map.set(item.id, item));
    unquantifiedExtras.forEach((item) => map.set(item.id, item));
    return map;
  }, [quantifiedExtras, unquantifiedExtras]);

  const totalExtrasAmount = useMemo(() => {
    return Object.entries(quantities).reduce((sum, [id, qty]) => {
      const item = allExtrasMap.get(id);
      if (item && qty > 0) {
        const price = parseFloat(item.price_per_booking) || 0;
        return sum + price * qty;
      }
      return sum;
    }, 0);
  }, [quantities, allExtrasMap]);

  if (!isOpen) return null;

  const toggleExtra = (id: string, defaultQty = 1) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      if (current > 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: defaultQty };
    });
  };

  const updateQuantity = (id: string, delta: number, max = 10) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.min(max, Math.max(0, current + delta));
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const formatPrice = (priceStr: string | number) => {
    const num = typeof priceStr === "number" ? priceStr : parseFloat(priceStr);
    if (isNaN(num)) return `₦${priceStr}`;
    return `₦${num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const handleContinue = () => {
    const payload: AddExtraPayloadItem[] = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => ({
        extra_id: id,
        quantity: qty,
      }));

    const selectedIds = payload.map((p) => p.extra_id);
    onContinue(payload, selectedIds);
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
            x
          </button>
        </div>

        <p className={styles.description}>
          Add optional extras to make your journey smoother and more comfortable.
        </p>

        {loading ? (
          <div className={styles.centerContainer}>
            <Spinner size={36} />
            <p className={styles.loadingText}>Loading extras...</p>
          </div>
        ) : error ? (
          <div className={styles.errorBanner}>{error}</div>
        ) : (
          <div className={styles.extrasList}>
            {/* Quantified Extras (Seats, items with quantities) */}
            {quantifiedExtras.length > 0 && (
              <div className={styles.sectionGroup}>
                <div className={styles.sectionHeading}>Child Seats & Equipment</div>
                {quantifiedExtras.map((item) => {
                  const qty = quantities[item.id] || 0;
                  const isChecked = qty > 0;
                  const itemPrice = parseFloat(item.price_per_booking) || 0;
                  const lineTotal = itemPrice * (qty || 1);

                  return (
                    <div
                      key={item.id}
                      className={`${styles.extraItem} ${isChecked ? styles.extraItemSelected : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleExtra(item.id, 1)}
                      />
                      <div className={styles.extraContent}>
                        <div
                          className={styles.extraHeader}
                          onClick={() => toggleExtra(item.id, 1)}
                          style={{ cursor: "pointer" }}
                        >
                          <span className={styles.extraTitle}>{item.name}</span>
                          <span className={styles.extraPrice}>
                            {formatPrice(item.price_per_booking)}
                            <small> / booking</small>
                          </span>
                        </div>
                        {item.description && (
                          <p
                            className={styles.extraSub}
                            onClick={() => toggleExtra(item.id, 1)}
                            style={{ cursor: "pointer" }}
                          >
                            {item.description}
                          </p>
                        )}

                        {isChecked && (
                          <div className={styles.quantifiedControls}>
                            <span className={styles.qtyLabel}>
                              Total: <strong>{formatPrice(lineTotal)}</strong> ({qty} {qty === 1 ? "unit" : "units"})
                            </span>
                            <div className={styles.stepper}>
                              <button
                                type="button"
                                className={styles.stepBtn}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateQuantity(item.id, -1);
                                }}
                                aria-label="Decrease quantity"
                              >
                                –
                              </button>
                              <span className={styles.qtyValue}>{qty}</span>
                              <button
                                type="button"
                                className={styles.stepBtn}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateQuantity(item.id, 1);
                                }}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Unquantified Extras (Fuel, Insurance, Wi-Fi, etc.) */}
            {unquantifiedExtras.length > 0 && (
              <div className={styles.sectionGroup}>
                <div className={styles.sectionHeading}>Protection, Navigation & Services</div>
                {unquantifiedExtras.map((item) => {
                  const isChecked = (quantities[item.id] || 0) > 0;

                  return (
                    <div
                      key={item.id}
                      className={`${styles.extraItem} ${isChecked ? styles.extraItemSelected : ""}`}
                      onClick={() => toggleExtra(item.id, 1)}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                      />
                      <div className={styles.extraContent}>
                        <div className={styles.extraHeader}>
                          <span className={styles.extraTitle}>{item.name}</span>
                          <span className={styles.extraPrice}>
                            {formatPrice(item.price_per_booking)}
                            <small> / booking</small>
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
          </div>
        )}

        {totalExtrasAmount > 0 && (
          <div className={styles.summaryFooter}>
            <span className={styles.summaryLabel}>Total Extras:</span>
            <span className={styles.summaryValue}>{formatPrice(totalExtrasAmount)}</span>
          </div>
        )}

        <button
          type="button"
          className={styles.continueBtn}
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
